import fs from 'fs-extra';
import path from 'path';
import { SPELL_TRANSLATIONS, CLASS_TRANSLATIONS, RACE_TRANSLATIONS, BACKGROUND_TRANSLATIONS, getReverseTranslation } from '../data/translations';

// 5etools Raw Types
export interface RawSpell {
    name: string;
    level: number;
    school: string;
    classes?: { fromClassList?: { name: string, source: string }[] };
    source: string;
    entries?: any[];
    time?: any[];
    range?: any;
    components?: any;
    duration?: any[];
    meta?: any;
}

export interface RawItem {
    name: string;
    source: string;
    type?: string;
    ac?: number;
    strength?: string;
    stealth?: boolean;
    entries?: any[];
    dmg1?: string;
    dmg2?: string;
    dmgType?: string;
    property?: string[];
    weight?: number;
    value?: number;
}

export interface RawClass {
    name: string;
    source: string;
    page?: number;
    hd?: { number: number; faces: number };
    proficiency?: string[];  // Saving throws (e.g., ["str", "con"])
    spellcastingAbility?: string;
    casterProgression?: string;  // "full", "half", "third", "pact"
    preparedSpells?: string;
    cantripProgression?: number[];
    spellsKnownProgression?: number[];
    spellsKnownProgressionFixed?: number[];
    startingProficiencies?: {
        armor?: string[];
        weapons?: string[];
        tools?: any[];
        skills?: Array<{ choose?: { from: string[]; count: number } } | string>;
    };
    startingEquipment?: {
        additionalFromBackground?: boolean;
        default?: string[];
        defaultData?: any[];
        goldAlternative?: string;
    };
    classFeatures?: (string | { classFeature: string; gainSubclassFeature?: boolean })[];
    subclassTitle?: string;
    multiclassing?: any;
}

export interface RawFeature {
    name: string;
    source: string;
    className: string;
    classSource: string;
    level: number;
    entries: any[];
    subclassShortName?: string;
    subclassSource?: string;
}

export interface RawSubclass {
    name: string;
    shortName: string;
    source: string;
    className: string;
    classSource: string;
    page?: number;
    subclassFeatures?: string[];
    spellcastingAbility?: string;
    casterProgression?: string;
    cantripProgression?: number[];
    spellsKnownProgression?: number[];
}

export interface RawRace {
    name: string;
    source: string;
    page?: number;
    size?: string[];
    speed?: number | { walk?: number; fly?: number | boolean; swim?: number; climb?: number };
    ability?: Array<Record<string, number>>;
    darkvision?: number;
    traitTags?: string[];
    languageProficiencies?: Array<Record<string, boolean | number>>;
    skillProficiencies?: Array<Record<string, boolean>>;
    entries?: any[];
    lineage?: string;
    resist?: string[];
    additionalSpells?: any[];
    age?: { mature?: number; max?: number };
    heightAndWeight?: any;
}

export interface RawBackground {
    name: string;
    source: string;
    page?: number;
    skillProficiencies?: Array<Record<string, boolean>>;
    languageProficiencies?: Array<Record<string, boolean | number>>;
    toolProficiencies?: Array<Record<string, boolean>>;
    startingEquipment?: any[];
    entries?: any[];
    feats?: any[];
    ability?: any[];
}

const DATA_DIR = path.join(process.cwd(), 'plutonium', 'data');

// Source lists for 2014 vs 2024 rules
export const SOURCES_2014 = ['PHB', 'XGE', 'TCE', 'SCAG', 'VGTM', 'MTOF', 'EGW', 'FTD', 'VRGR'];
export const SOURCES_2024 = ['XPHB', 'PHB24']; // PHB24 is our UI id, XPHB is 5etools id

/**
 * Maps UI source IDs to 5etools source IDs
 */
export const SOURCE_MAPPING: Record<string, string[]> = {
    'PHB24': ['XPHB', 'PHB24'],
    'PHB': ['PHB'],
    'XGE': ['XGE'],
    'TCE': ['TCE'],
    'DMG': ['DMG', 'XDMG'],
    'MM': ['MM', 'XMM']
};

/**
 * Expands a list of sources to include their 5etools equivalents
 */
export function expandSources(sources: string[]): string[] {
    const expanded = new Set<string>();
    for (const s of sources) {
        if (SOURCE_MAPPING[s]) {
            SOURCE_MAPPING[s].forEach(id => expanded.add(id));
        } else {
            expanded.add(s);
        }
    }
    return Array.from(expanded);
}

export class FiveToolsService {
    private static instance: FiveToolsService;
    private spells: RawSpell[] = [];
    private items: RawItem[] = [];
    private classes: RawClass[] = [];
    private subclasses: RawSubclass[] = [];
    private classFeatures: RawFeature[] = [];
    private subclassFeatures: RawFeature[] = [];
    private races: RawRace[] = [];
    private backgrounds: RawBackground[] = [];
    private spellClassMapping: Record<string, Record<string, { class: { name: string; source: string }[] }>> = {};
    private initialized = false;

    private constructor() { }

    public static getInstance(): FiveToolsService {
        if (!FiveToolsService.instance) {
            FiveToolsService.instance = new FiveToolsService();
        }
        return FiveToolsService.instance;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public async initialize() {
        if (this.initialized) return;

        try {
            console.log('Initializing FiveToolsService...');

            // Load all data types in parallel for better performance
            await Promise.all([
                this.loadSpells(),
                this.loadItems(),
                this.loadClasses(),
                this.loadRaces(),
                this.loadBackgrounds()
            ]);

            this.initialized = true;
            console.log('FiveToolsService initialized successfully.');
        } catch (error) {
            console.error('Failed to initialize FiveToolsService:', error);
        }
    }

    // ========== SPELLS ==========
    private async loadSpells() {
        const spellsDir = path.join(DATA_DIR, 'spells');

        // Load Sources (Class Mapping)
        const sourcesPath = path.join(spellsDir, 'sources.json');
        if (await fs.pathExists(sourcesPath)) {
            this.spellClassMapping = await fs.readJson(sourcesPath);
        }

        const spellFiles = await fs.readdir(spellsDir);
        for (const file of spellFiles) {
            if (file.startsWith('spells-') && file.endsWith('.json') && !file.includes('fluff')) {
                const content = await fs.readJson(path.join(spellsDir, file));
                if (content.spell) {
                    const enrichedSpells = content.spell.map((s: RawSpell) => {
                        const sourceMap = this.spellClassMapping[s.source];
                        if (sourceMap && sourceMap[s.name] && sourceMap[s.name].class) {
                            s.classes = { fromClassList: sourceMap[s.name].class };
                        }
                        return s;
                    });
                    this.spells.push(...enrichedSpells);
                }
            }
        }
        console.log(`Loaded ${this.spells.length} spells from 5etools.`);
    }

    // ========== ITEMS ==========
    private async loadItems() {
        const itemsPath = path.join(DATA_DIR, 'items.json');
        if (await fs.pathExists(itemsPath)) {
            const content = await fs.readJson(itemsPath);
            if (content.item) this.items.push(...content.item);
        }

        const itemsBasePath = path.join(DATA_DIR, 'items-base.json');
        if (await fs.pathExists(itemsBasePath)) {
            const content = await fs.readJson(itemsBasePath);
            if (content.item) this.items.push(...content.item);
            if (content.baseitem) this.items.push(...content.baseitem);
        }
        console.log(`Loaded ${this.items.length} items from 5etools.`);
    }

    // ========== CLASSES ==========
    private async loadClasses() {
        const classDir = path.join(DATA_DIR, 'class');
        if (!await fs.pathExists(classDir)) {
            console.warn('Class directory not found:', classDir);
            return;
        }

        const classFiles = await fs.readdir(classDir);
        for (const file of classFiles) {
            // Only load class-*.json files (not fluff or index)
            if (file.startsWith('class-') && file.endsWith('.json') && !file.includes('fluff') && !file.includes('sidekick') && !file.includes('mystic')) {
                const content = await fs.readJson(path.join(classDir, file));
                if (content.class) {
                    this.classes.push(...content.class);
                }
                if (content.subclass) {
                    this.subclasses.push(...content.subclass);
                }
                if (content.classFeature) {
                    this.classFeatures.push(...content.classFeature);
                }
                if (content.subclassFeature) {
                    this.subclassFeatures.push(...content.subclassFeature);
                }
            }
        }
        console.log(`Loaded ${this.classes.length} classes, ${this.subclasses.length} subclasses and ${this.classFeatures.length + this.subclassFeatures.length} features from 5etools.`);
    }

    // ========== RACES ==========
    private async loadRaces() {
        const racesPath = path.join(DATA_DIR, 'races.json');
        if (await fs.pathExists(racesPath)) {
            const content = await fs.readJson(racesPath);
            if (content.race) {
                this.races.push(...content.race);
            }
        }
        console.log(`Loaded ${this.races.length} races from 5etools.`);
    }

    // ========== BACKGROUNDS ==========
    private async loadBackgrounds() {
        const bgPath = path.join(DATA_DIR, 'backgrounds.json');
        if (await fs.pathExists(bgPath)) {
            const content = await fs.readJson(bgPath);
            if (content.background) {
                this.backgrounds.push(...content.background);
            }
        }
        console.log(`Loaded ${this.backgrounds.length} backgrounds from 5etools.`);
    }

    // ========== SPELL METHODS ==========

    /**
     * Get spells for a class and level.
     * @param className Class name (Italian or English)
     * @param level Spell level
     * @param sources Filter by source (e.g., ['PHB'])
     */
    public getSpells(className: string, level: number, sources: string[] = SOURCES_2014): RawSpell[] {
        const engClass = getReverseTranslation(className, CLASS_TRANSLATIONS) || className;
        const expandedSources = expandSources(sources);

        return this.spells.filter(s => {
            if (s.level !== level) return false;
            if (expandedSources.length > 0 && !expandedSources.includes(s.source)) return false;
            if (!s.classes?.fromClassList) return false;
            return s.classes.fromClassList.some(c =>
                c.name === engClass && (!c.source || expandedSources.includes(c.source))
            );
        });
    }

    public getSpellByName(name: string): RawSpell | undefined {
        const clean = name.toLowerCase().trim();

        // 1. Direct Match (English)
        let found = this.spells.find(s => s.name.toLowerCase() === clean);
        if (found) return found;

        // 2. Reverse Translation Match (Italian Input -> English Key)
        const engKey = Object.keys(SPELL_TRANSLATIONS).find(key =>
            SPELL_TRANSLATIONS[key].toLowerCase() === clean
        );

        if (engKey) {
            found = this.spells.find(s => s.name.toLowerCase() === engKey.toLowerCase());
        }

        return found;
    }

    public getAllSpells(): RawSpell[] {
        return this.spells;
    }

    // ========== ITEM METHODS ==========

    public getItemByName(name: string): RawItem | undefined {
        const clean = name.toLowerCase().trim();
        return this.items.find(i => i.name.toLowerCase() === clean);
    }

    public getItemAC(name: string): number | null {
        const item = this.getItemByName(name);
        if (item && item.ac) return item.ac;
        return null;
    }

    /**
     * Get armor items filtered by type
     * @param armorType 'LA' (light), 'MA' (medium), 'HA' (heavy), 'S' (shield)
     */
    public getArmorByType(armorType: string, sources: string[] = SOURCES_2014): RawItem[] {
        const expandedSources = expandSources(sources);
        return this.items.filter(i =>
            i.type === armorType &&
            (expandedSources.length === 0 || expandedSources.includes(i.source))
        );
    }

    public getAllItems(): RawItem[] {
        return this.items;
    }

    // ========== CLASS METHODS ==========

    /**
     * Get a class by name (English or Italian)
     */
    public getClassByName(name: string, sources: string[] = SOURCES_2014): RawClass | undefined {
        const clean = name.toLowerCase().trim();
        const engName = getReverseTranslation(name, CLASS_TRANSLATIONS) || name;
        const expandedSources = expandSources(sources);

        return this.classes.find(c =>
            (c.name.toLowerCase() === clean || c.name.toLowerCase() === engName.toLowerCase()) &&
            (expandedSources.length === 0 || expandedSources.includes(c.source))
        );
    }

    /**
     * Get all classes filtered by sources
     */
    public getClasses(sources: string[] = SOURCES_2014): RawClass[] {
        const expandedSources = expandSources(sources);
        return this.classes.filter(c =>
            expandedSources.length === 0 || expandedSources.includes(c.source)
        );
    }

    /**
     * Get subclasses for a class
     */
    public getSubclasses(className: string, sources: string[] = SOURCES_2014): RawSubclass[] {
        const engName = getReverseTranslation(className, CLASS_TRANSLATIONS) || className;
        const expandedSources = expandSources(sources);

        return this.subclasses.filter(sc =>
            sc.className.toLowerCase() === engName.toLowerCase() &&
            (expandedSources.length === 0 || expandedSources.includes(sc.source))
        );
    }

    /**
     * Get subclass by name
     */
    public getSubclassByName(className: string, subclassName: string, sources: string[] = SOURCES_2014): RawSubclass | undefined {
        const engClassName = getReverseTranslation(className, CLASS_TRANSLATIONS) || className;
        const cleanSubName = subclassName.toLowerCase().trim();
        const expandedSources = expandSources(sources);

        return this.subclasses.find(sc =>
            sc.className.toLowerCase() === engClassName.toLowerCase() &&
            (sc.name.toLowerCase() === cleanSubName || sc.shortName.toLowerCase() === cleanSubName) &&
            (expandedSources.length === 0 || expandedSources.includes(sc.source))
        );
    }

    /**
     * Get hit die faces for a class
     */
    public getClassHitDie(className: string): number {
        const cls = this.getClassByName(className);
        return cls?.hd?.faces || 8;
    }

    /**
     * Get cantrip progression for a class
     */
    public getClassCantripProgression(className: string): number[] {
        const cls = this.getClassByName(className);
        return cls?.cantripProgression || [];
    }

    /**
     * Get spells known progression for a class
     */
    public getClassSpellsKnownProgression(className: string): number[] {
        const cls = this.getClassByName(className);
        return cls?.spellsKnownProgression || cls?.spellsKnownProgressionFixed || [];
    }

    /**
     * Get starting proficiencies for a class
     */
    public getClassStartingProficiencies(className: string): RawClass['startingProficiencies'] | undefined {
        const cls = this.getClassByName(className);
        return cls?.startingProficiencies;
    }

    /**
     * Get skill choices for a class
     */
    public getClassSkillChoices(className: string): { skills: string[]; count: number } {
        const profs = this.getClassStartingProficiencies(className);
        if (!profs?.skills) return { skills: [], count: 2 };

        for (const skillEntry of profs.skills) {
            if (typeof skillEntry === 'object' && skillEntry.choose) {
                return {
                    skills: skillEntry.choose.from,
                    count: skillEntry.choose.count
                };
            }
        }
        return { skills: [], count: 2 };
    }

    /**
     * Get features for a class up to a certain level
     */
    public getClassFeatures(className: string, level: number, sources: string[] = SOURCES_2014): RawFeature[] {
        const engName = getReverseTranslation(className, CLASS_TRANSLATIONS) || className;
        const expandedSources = expandSources(sources);

        return this.classFeatures.filter(f =>
            f.className.toLowerCase() === engName.toLowerCase() &&
            f.level <= level &&
            (expandedSources.length === 0 || expandedSources.includes(f.source))
        );
    }

    // ========== RACE METHODS ==========

    /**
     * Get a race by name (English or Italian)
     */
    public getRaceByName(name: string, sources: string[] = SOURCES_2014): RawRace | undefined {
        const clean = name.toLowerCase().trim();
        const engName = getReverseTranslation(name, RACE_TRANSLATIONS) || name;
        const expandedSources = expandSources(sources);

        return this.races.find(r =>
            (r.name.toLowerCase() === clean || r.name.toLowerCase() === engName.toLowerCase()) &&
            (expandedSources.length === 0 || expandedSources.includes(r.source))
        );
    }

    /**
     * Get all races filtered by sources
     * @param includeVariants Include reprinted/variant races
     */
    public getRaces(sources: string[] = SOURCES_2014, includeVariants: boolean = false): RawRace[] {
        const expandedSources = expandSources(sources);
        return this.races.filter(r => {
            if (expandedSources.length > 0 && !expandedSources.includes(r.source)) return false;
            // Optionally exclude lineage/variant races
            if (!includeVariants && r.lineage) return false;
            return true;
        });
    }

    /**
     * Get ability bonuses for a race (PHB 2014 style)
     * Returns { STR: 2, CON: 1 } style object
     */
    public getRaceAbilityBonuses(raceName: string, sources: string[] = SOURCES_2014): Record<string, number> {
        const race = this.getRaceByName(raceName, sources);
        if (!race?.ability || race.ability.length === 0) return {};

        // Combine all ability entries
        const bonuses: Record<string, number> = {};
        for (const abilityEntry of race.ability) {
            for (const [stat, value] of Object.entries(abilityEntry)) {
                if (typeof value === 'number') {
                    // Convert lowercase 5etools stats to uppercase
                    const statUpper = stat.toUpperCase();
                    bonuses[statUpper] = (bonuses[statUpper] || 0) + value;
                }
            }
        }
        return bonuses;
    }

    /**
     * Get race speed (walking speed)
     */
    public getRaceSpeed(raceName: string): number {
        const race = this.getRaceByName(raceName);
        if (!race?.speed) return 30;
        if (typeof race.speed === 'number') return race.speed;
        return race.speed.walk || 30;
    }

    /**
     * Get race features from entries
     */
    public getRaceFeatures(raceName: string): Array<{ name: string; description: string }> {
        const race = this.getRaceByName(raceName);
        if (!race?.entries) return [];

        const features: Array<{ name: string; description: string }> = [];
        for (const entry of race.entries) {
            if (typeof entry === 'object' && entry.type === 'entries' && entry.name) {
                const description = this.entriesToString(entry.entries);
                features.push({ name: entry.name, description });
            }
        }
        return features;
    }

    // ========== BACKGROUND METHODS ==========

    /**
     * Get a background by name (English or Italian)
     */
    public getBackgroundByName(name: string, sources: string[] = SOURCES_2014): RawBackground | undefined {
        const clean = name.toLowerCase().trim();
        const engName = getReverseTranslation(name, BACKGROUND_TRANSLATIONS) || name;
        const expandedSources = expandSources(sources);

        return this.backgrounds.find(b =>
            (b.name.toLowerCase() === clean || b.name.toLowerCase() === engName.toLowerCase()) &&
            (expandedSources.length === 0 || expandedSources.includes(b.source))
        );
    }

    /**
     * Get all backgrounds filtered by sources
     */
    public getBackgrounds(sources: string[] = SOURCES_2014): RawBackground[] {
        const expandedSources = expandSources(sources);
        return this.backgrounds.filter(b =>
            expandedSources.length === 0 || expandedSources.includes(b.source)
        );
    }

    /**
     * Get skill proficiencies for a background
     */
    public getBackgroundSkills(backgroundName: string, sources: string[] = SOURCES_2014): string[] {
        const bg = this.getBackgroundByName(backgroundName, sources);
        if (!bg?.skillProficiencies) return [];

        const skills: string[] = [];
        for (const skillEntry of bg.skillProficiencies) {
            for (const [skill, value] of Object.entries(skillEntry)) {
                if (value === true) {
                    skills.push(skill);
                }
            }
        }
        return skills;
    }

    /**
     * Get background feature
     */
    public getBackgroundFeature(backgroundName: string, sources: string[] = SOURCES_2014): { name: string; description: string } | undefined {
        const bg = this.getBackgroundByName(backgroundName, sources);
        if (!bg?.entries) {
            // Check for 2024 style feats
            if (bg?.feats && Array.isArray(bg.feats) && bg.feats.length > 0) {
                const featRef = bg.feats[0];
                const featName = typeof featRef === 'string' ? featRef.split('|')[0] : Object.keys(featRef)[0].split('|')[0];
                return {
                    name: `Talento: ${featName.charAt(0).toUpperCase() + featName.slice(1)}`,
                    description: "Questo background fornisce un talento (Feat) come da regole 2024."
                };
            }
            return undefined;
        }

        // 1. Look for explicit feature entry
        for (const entry of bg.entries) {
            if (typeof entry === 'object' && entry.type === 'entries') {
                if (entry.data?.isFeature || (entry.name && (entry.name.includes('Feature') || entry.name.includes('Caratteristica')))) {
                    return {
                        name: entry.name.replace('Feature: ', '').replace('Caratteristica: ', ''),
                        description: this.entriesToString(entry.entries)
                    };
                }
            }
        }

        // 2. Look for "Feat:" in lists (2024 style)
        for (const entry of bg.entries) {
            if (typeof entry === 'object' && entry.type === 'list') {
                const featItem = (entry.items as any[])?.find(it => it.name === 'Feat:');
                if (featItem) {
                    return {
                        name: "Talento (Feat)",
                        description: this.entriesToString([featItem.entry])
                    };
                }
            }
        }

        return undefined;
    }

    // ========== UTILITY METHODS ==========

    /**
     * Convert 5etools entries array to a string description
     */
    private entriesToString(entries: any[]): string {
        if (!entries) return '';

        return entries.map(entry => {
            if (typeof entry === 'string') {
                // Remove 5etools formatting tags like {@spell fireball} -> fireball
                return entry.replace(/\{@\w+\s+([^}|]+)(?:\|[^}]*)?\}/g, '$1');
            }
            if (typeof entry === 'object' && entry.entries) {
                return this.entriesToString(entry.entries);
            }
            return '';
        }).filter(Boolean).join(' ');
    }

    /**
     * Parse 5etools item reference (e.g., "chain mail|phb" -> "chain mail")
     */
    public parseItemReference(ref: string): { name: string; source?: string } {
        const parts = ref.split('|');
        return {
            name: parts[0],
            source: parts[1]?.toUpperCase()
        };
    }

    /**
     * Get caster type for a class
     * Returns: 'full', 'half', 'third', 'pact', or null for non-casters
     */
    public getClassCasterType(className: string): string | null {
        const cls = this.getClassByName(className);
        return cls?.casterProgression || null;
    }

    /**
     * Get spellcasting ability for a class
     */
    public getClassSpellcastingAbility(className: string): string | null {
        const cls = this.getClassByName(className);
        return cls?.spellcastingAbility || null;
    }
}
