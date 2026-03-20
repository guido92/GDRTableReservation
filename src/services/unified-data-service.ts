/**
 * UnifiedDataService - Centralized data access layer
 *
 * Provides a single interface to access D&D 5e data from:
 * 1. 5etools JSON files (primary source)
 * 2. Static TypeScript data (fallback)
 *
 * Features:
 * - Lazy initialization
 * - In-memory caching
 * - Automatic fallback to static data
 * - Support for both English and Italian names
 */

import { FiveToolsService, RawClass, RawRace, RawBackground, RawSpell, RawItem, SOURCES_2014 } from './five-tools-service';
import { CLASSES, ClassOption } from '../data/classes';
import { RACES, RaceOption } from '../data/races';
import { BACKGROUNDS } from '../data/backgrounds';
import { CLASS_TRANSLATIONS, RACE_TRANSLATIONS, BACKGROUND_TRANSLATIONS, translateClass, translateRace, translateBackground, translateSkill, getReverseTranslation } from '../data/translations';
import { AbilityScores, Feature } from '../types/dnd';

// Unified interfaces that combine 5etools and static data
export interface UnifiedClass {
    name: string;           // Italian name
    nameEn: string;         // English name
    source: string;
    hitDie: number;
    savingThrows: string[];
    armorProficiencies: string[];
    weaponProficiencies: string[];
    toolProficiencies: string[];
    skillChoices: { skills: string[]; count: number };
    equipment: string[];
    features: Feature[];
    subclasses: UnifiedSubclass[];
    casterProgression: string | null;
    spellcastingAbility: string | null;
    cantripProgression: number[];
    spellsKnownProgression: number[];
}

export interface UnifiedSubclass {
    name: string;
    nameEn: string;
    source: string;
    features: Feature[];
}

export interface UnifiedRace {
    name: string;           // Italian name
    nameEn: string;         // English name
    source: string;
    speed: number;
    abilityBonuses: Record<string, number>;
    features: Feature[];
    darkvision: number;
    languages: string[];
    subraces: UnifiedSubrace[];
}

export interface UnifiedSubrace {
    name: string;
    nameEn: string;
    source: string;
    abilityBonuses: Record<string, number>;
    features: Feature[];
    speed?: number;
}

export interface UnifiedBackground {
    name: string;           // Italian name
    nameEn: string;         // English name
    source: string;
    skillProficiencies: string[];
    toolProficiencies: string[];
    languages: string[];
    equipment: string[];
    feature: { name: string; description: string } | null;
}

export class UnifiedDataService {
    private static instance: UnifiedDataService;
    private fiveTools: FiveToolsService;
    private initialized = false;

    // Caches
    private classCache: Map<string, UnifiedClass> = new Map();
    private raceCache: Map<string, UnifiedRace> = new Map();
    private backgroundCache: Map<string, UnifiedBackground> = new Map();

    private constructor() {
        this.fiveTools = FiveToolsService.getInstance();
    }

    public static getInstance(): UnifiedDataService {
        if (!UnifiedDataService.instance) {
            UnifiedDataService.instance = new UnifiedDataService();
        }
        return UnifiedDataService.instance;
    }

    public async initialize(): Promise<void> {
        if (this.initialized) return;

        await this.fiveTools.initialize();
        this.initialized = true;
        console.log('UnifiedDataService initialized.');
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    // ========== CLASS METHODS ==========

    /**
     * Get a class by name (supports both English and Italian)
     */
    public async getClass(name: string, sources: string[] = SOURCES_2014): Promise<UnifiedClass | undefined> {
        await this.initialize();

        const cacheKey = `${name.toLowerCase()}-${sources.join(',')}`;
        if (this.classCache.has(cacheKey)) {
            return this.classCache.get(cacheKey);
        }

        // Try 5etools first
        const rawClass = this.fiveTools.getClassByName(name, sources);
        if (rawClass) {
            const unified = this.convertRawClass(rawClass, sources);
            this.classCache.set(cacheKey, unified);
            return unified;
        }

        // Fallback to static data
        const staticClass = this.findStaticClass(name);
        if (staticClass) {
            const unified = this.convertStaticClass(staticClass);
            this.classCache.set(cacheKey, unified);
            console.log(`[UnifiedDataService] Using static fallback for class: ${name}`);
            return unified;
        }

        return undefined;
    }

    /**
     * Get all classes
     */
    public async getClasses(sources: string[] = SOURCES_2014): Promise<UnifiedClass[]> {
        await this.initialize();

        const rawClasses = this.fiveTools.getClasses(sources);
        if (rawClasses.length > 0) {
            return rawClasses.map(rc => this.convertRawClass(rc, sources));
        }

        // Fallback to static data
        return CLASSES.map(sc => this.convertStaticClass(sc));
    }

    private convertRawClass(raw: RawClass, sources: string[]): UnifiedClass {
        const nameIt = translateClass(raw.name);
        const subclasses = this.fiveTools.getSubclasses(raw.name, sources);

        return {
            name: nameIt,
            nameEn: raw.name,
            source: raw.source,
            hitDie: raw.hd?.faces || 8,
            savingThrows: (raw.proficiency || []).map(p => p.toUpperCase()),
            armorProficiencies: raw.startingProficiencies?.armor || [],
            weaponProficiencies: raw.startingProficiencies?.weapons || [],
            toolProficiencies: this.extractToolProficiencies(raw.startingProficiencies?.tools),
            skillChoices: this.fiveTools.getClassSkillChoices(raw.name),
            equipment: this.extractEquipment(raw.startingEquipment?.default),
            features: this.extractClassFeatures(raw),
            subclasses: subclasses.map(sc => ({
                name: sc.shortName,
                nameEn: sc.name,
                source: sc.source,
                features: []  // Would need classFeature data to populate
            })),
            casterProgression: raw.casterProgression || null,
            spellcastingAbility: raw.spellcastingAbility || null,
            cantripProgression: raw.cantripProgression || [],
            spellsKnownProgression: raw.spellsKnownProgression || raw.spellsKnownProgressionFixed || []
        };
    }

    private convertStaticClass(staticClass: ClassOption): UnifiedClass {
        const engName = getReverseTranslation(staticClass.name, CLASS_TRANSLATIONS) || staticClass.name;

        return {
            name: staticClass.name,
            nameEn: engName,
            source: staticClass.source || 'PHB',
            hitDie: staticClass.hitDie,
            savingThrows: staticClass.proficiencies.savingThrows,
            armorProficiencies: staticClass.proficiencies.armor,
            weaponProficiencies: staticClass.proficiencies.weapons,
            toolProficiencies: staticClass.proficiencies.tools,
            skillChoices: { skills: staticClass.proficiencies.skills, count: this.getDefaultSkillCount(staticClass.name) },
            equipment: staticClass.equipment || [],
            features: staticClass.features || [],
            subclasses: (staticClass.suboptions || []).map(sub => ({
                name: sub.name,
                nameEn: sub.name,
                source: sub.source || 'PHB',
                features: sub.features || []
            })),
            casterProgression: this.inferCasterProgression(staticClass.name),
            spellcastingAbility: this.inferSpellcastingAbility(staticClass.name),
            cantripProgression: [],
            spellsKnownProgression: []
        };
    }

    private findStaticClass(name: string): ClassOption | undefined {
        const cleanName = name.toLowerCase().trim();
        return CLASSES.find(c =>
            c.name.toLowerCase() === cleanName ||
            (getReverseTranslation(c.name, CLASS_TRANSLATIONS) || '').toLowerCase() === cleanName
        );
    }

    // ========== RACE METHODS ==========

    /**
     * Get a race by name (supports both English and Italian)
     */
    public async getRace(name: string, sources: string[] = SOURCES_2014): Promise<UnifiedRace | undefined> {
        await this.initialize();

        const cacheKey = `${name.toLowerCase()}-${sources.join(',')}`;
        if (this.raceCache.has(cacheKey)) {
            return this.raceCache.get(cacheKey);
        }

        // Try 5etools first
        const rawRace = this.fiveTools.getRaceByName(name, sources);
        if (rawRace) {
            const unified = this.convertRawRace(rawRace, sources);
            this.raceCache.set(cacheKey, unified);
            return unified;
        }

        // Fallback to static data
        const staticRace = this.findStaticRace(name);
        if (staticRace) {
            const unified = this.convertStaticRace(staticRace);
            this.raceCache.set(cacheKey, unified);
            console.log(`[UnifiedDataService] Using static fallback for race: ${name}`);
            return unified;
        }

        return undefined;
    }

    /**
     * Get all races
     */
    public async getRaces(sources: string[] = SOURCES_2014): Promise<UnifiedRace[]> {
        await this.initialize();

        const rawRaces = this.fiveTools.getRaces(sources, false);
        if (rawRaces.length > 0) {
            return rawRaces.map(rr => this.convertRawRace(rr, sources));
        }

        // Fallback to static data
        return RACES.map(sr => this.convertStaticRace(sr));
    }

    /**
     * Get ability bonuses for a race (PHB 2014 style)
     */
    public async getRaceAbilityBonuses(raceName: string, subraceName?: string): Promise<Record<string, number>> {
        const race = await this.getRace(raceName);
        if (!race) return {};

        let bonuses = { ...race.abilityBonuses };

        if (subraceName) {
            const subrace = race.subraces.find(sr =>
                sr.name.toLowerCase() === subraceName.toLowerCase() ||
                sr.nameEn.toLowerCase() === subraceName.toLowerCase()
            );
            if (subrace) {
                for (const [stat, value] of Object.entries(subrace.abilityBonuses)) {
                    bonuses[stat] = (bonuses[stat] || 0) + value;
                }
            }
        }

        return bonuses;
    }

    private convertRawRace(raw: RawRace, sources: string[]): UnifiedRace {
        const nameIt = translateRace(raw.name);
        const features = this.fiveTools.getRaceFeatures(raw.name);

        return {
            name: nameIt,
            nameEn: raw.name,
            source: raw.source,
            speed: this.fiveTools.getRaceSpeed(raw.name),
            abilityBonuses: this.fiveTools.getRaceAbilityBonuses(raw.name, sources),
            features: features.map(f => ({ name: f.name, description: f.description, level: 1 })),
            darkvision: raw.darkvision || 0,
            languages: this.extractLanguages(raw.languageProficiencies),
            subraces: []  // 5etools handles subraces as separate race entries
        };
    }

    private convertStaticRace(staticRace: RaceOption): UnifiedRace {
        const engName = getReverseTranslation(staticRace.name, RACE_TRANSLATIONS) || staticRace.name;

        return {
            name: staticRace.name,
            nameEn: engName,
            source: staticRace.source || 'PHB',
            speed: staticRace.speed || 30,
            abilityBonuses: staticRace.abilityBonuses || {},
            features: staticRace.features || [],
            darkvision: this.inferDarkvision(staticRace),
            languages: this.inferLanguages(staticRace.name),
            subraces: (staticRace.suboptions || []).map(sub => ({
                name: sub.name,
                nameEn: sub.name,
                source: sub.source || 'PHB',
                abilityBonuses: sub.abilityBonuses || {},
                features: sub.features || [],
                speed: sub.speed
            }))
        };
    }

    private findStaticRace(name: string): RaceOption | undefined {
        const cleanName = name.toLowerCase().trim();
        return RACES.find(r =>
            r.name.toLowerCase() === cleanName ||
            (getReverseTranslation(r.name, RACE_TRANSLATIONS) || '').toLowerCase() === cleanName
        );
    }

    // ========== BACKGROUND METHODS ==========

    /**
     * Get a background by name (supports both English and Italian)
     */
    public async getBackground(name: string, sources: string[] = SOURCES_2014): Promise<UnifiedBackground | undefined> {
        await this.initialize();

        const cacheKey = `${name.toLowerCase()}-${sources.join(',')}`;
        if (this.backgroundCache.has(cacheKey)) {
            return this.backgroundCache.get(cacheKey);
        }

        // Try 5etools first
        const rawBg = this.fiveTools.getBackgroundByName(name, sources);
        if (rawBg) {
            const unified = this.convertRawBackground(rawBg);
            this.backgroundCache.set(cacheKey, unified);
            return unified;
        }

        // Fallback to static data
        const staticBg = this.findStaticBackground(name);
        if (staticBg) {
            const unified = this.convertStaticBackground(staticBg);
            this.backgroundCache.set(cacheKey, unified);
            console.log(`[UnifiedDataService] Using static fallback for background: ${name}`);
            return unified;
        }

        return undefined;
    }

    /**
     * Get all backgrounds
     */
    public async getBackgrounds(sources: string[] = SOURCES_2014): Promise<UnifiedBackground[]> {
        await this.initialize();

        const rawBgs = this.fiveTools.getBackgrounds(sources);
        if (rawBgs.length > 0) {
            return rawBgs.map(rb => this.convertRawBackground(rb));
        }

        // Fallback to static data
        return BACKGROUNDS.map(sb => this.convertStaticBackground(sb));
    }

    private convertRawBackground(raw: RawBackground): UnifiedBackground {
        const nameIt = translateBackground(raw.name);
        const skills = this.fiveTools.getBackgroundSkills(raw.name);
        const feature = this.fiveTools.getBackgroundFeature(raw.name);

        return {
            name: nameIt,
            nameEn: raw.name,
            source: raw.source,
            skillProficiencies: skills.map(s => translateSkill(s)),
            toolProficiencies: this.extractToolProficiencies(raw.toolProficiencies),
            languages: this.extractLanguages(raw.languageProficiencies),
            equipment: this.extractBackgroundEquipment(raw.startingEquipment),
            feature: feature ? { name: feature.name, description: feature.description } : null
        };
    }

    private convertStaticBackground(staticBg: any): UnifiedBackground {
        const engName = getReverseTranslation(staticBg.name, BACKGROUND_TRANSLATIONS) || staticBg.name;

        return {
            name: staticBg.name,
            nameEn: engName,
            source: staticBg.source || 'PHB',
            skillProficiencies: staticBg.skillProficiencies || [],
            toolProficiencies: staticBg.toolProficiencies || [],
            languages: staticBg.languages || [],
            equipment: staticBg.equipment || [],
            feature: staticBg.features?.[0] ? { name: staticBg.features[0].name, description: staticBg.features[0].description } : null
        };
    }

    private findStaticBackground(name: string): any {
        const cleanName = name.toLowerCase().trim();
        return BACKGROUNDS.find(b =>
            b.name.toLowerCase() === cleanName ||
            (getReverseTranslation(b.name, BACKGROUND_TRANSLATIONS) || '').toLowerCase() === cleanName
        );
    }

    // ========== SPELL METHODS ==========

    /**
     * Get spells for a class at a specific level
     */
    public async getSpellsForClass(className: string, characterLevel: number, maxSpellLevel: number, sources: string[] = SOURCES_2014): Promise<RawSpell[]> {
        await this.initialize();

        const spells: RawSpell[] = [];
        for (let level = 0; level <= maxSpellLevel; level++) {
            const levelSpells = this.fiveTools.getSpells(className, level, sources);
            spells.push(...levelSpells);
        }
        return spells;
    }

    /**
     * Get a spell by name
     */
    public async getSpell(name: string): Promise<RawSpell | undefined> {
        await this.initialize();
        return this.fiveTools.getSpellByName(name);
    }

    // ========== ITEM METHODS ==========

    /**
     * Get an item by name
     */
    public async getItem(name: string): Promise<RawItem | undefined> {
        await this.initialize();
        return this.fiveTools.getItemByName(name);
    }

    /**
     * Get item AC
     */
    public async getItemAC(name: string): Promise<number | null> {
        await this.initialize();
        return this.fiveTools.getItemAC(name);
    }

    // ========== HELPER METHODS ==========

    private extractToolProficiencies(tools: any[] | undefined): string[] {
        if (!tools) return [];

        const result: string[] = [];
        for (const tool of tools) {
            if (typeof tool === 'string') {
                result.push(tool);
            } else if (typeof tool === 'object') {
                // Handle complex tool entries
                for (const [key, value] of Object.entries(tool)) {
                    if (value === true) result.push(key);
                }
            }
        }
        return result;
    }

    private extractEquipment(defaultEquipment: string[] | undefined): string[] {
        if (!defaultEquipment) return [];

        // Parse 5etools equipment strings and simplify
        return defaultEquipment.map(eq => {
            // Remove {@item} tags and simplify
            return eq.replace(/\{@item\s+([^}|]+)(?:\|[^}]*)?\}/g, '$1')
                     .replace(/\{@filter\s+([^}|]+)(?:\|[^}]*)?\}/g, '$1');
        });
    }

    private extractBackgroundEquipment(startingEquipment: any[] | undefined): string[] {
        if (!startingEquipment) return [];

        const result: string[] = [];
        for (const eq of startingEquipment) {
            if (eq._ && Array.isArray(eq._)) {
                for (const item of eq._) {
                    if (typeof item === 'string') {
                        result.push(this.fiveTools.parseItemReference(item).name);
                    } else if (item.item) {
                        result.push(this.fiveTools.parseItemReference(item.item).name);
                    } else if (item.special) {
                        result.push(item.special);
                    }
                }
            }
        }
        return result;
    }

    private extractLanguages(langProfs: Array<Record<string, boolean | number>> | undefined): string[] {
        if (!langProfs) return ['Comune'];

        const langs: string[] = [];
        for (const prof of langProfs) {
            for (const [lang, value] of Object.entries(prof)) {
                if (value === true) {
                    langs.push(lang.charAt(0).toUpperCase() + lang.slice(1));
                } else if (typeof value === 'number' && lang === 'anyStandard') {
                    langs.push(`${value} a scelta`);
                }
            }
        }
        return langs.length > 0 ? langs : ['Comune'];
    }

    private extractClassFeatures(raw: RawClass): Feature[] {
        // This would require loading classFeature data from 5etools
        // For now, return empty and rely on static data fallback
        return [];
    }

    private getDefaultSkillCount(className: string): number {
        const counts: Record<string, number> = {
            'Barbaro': 2, 'Bardo': 3, 'Chierico': 2, 'Druido': 2,
            'Guerriero': 2, 'Monaco': 2, 'Paladino': 2, 'Ranger': 3,
            'Ladro': 4, 'Stregone': 2, 'Mago': 2, 'Warlock': 2, 'Artefice': 2
        };
        return counts[className] || 2;
    }

    private inferCasterProgression(className: string): string | null {
        const progressions: Record<string, string | null> = {
            'Bardo': 'full', 'Chierico': 'full', 'Druido': 'full', 'Mago': 'full', 'Stregone': 'full',
            'Paladino': 'half', 'Ranger': 'half', 'Artefice': 'half',
            'Warlock': 'pact',
            'Guerriero': null, 'Barbaro': null, 'Monaco': null, 'Ladro': null
        };
        return progressions[className] ?? null;
    }

    private inferSpellcastingAbility(className: string): string | null {
        const abilities: Record<string, string> = {
            'Bardo': 'cha', 'Chierico': 'wis', 'Druido': 'wis', 'Mago': 'int',
            'Stregone': 'cha', 'Paladino': 'cha', 'Ranger': 'wis', 'Warlock': 'cha',
            'Artefice': 'int'
        };
        return abilities[className] ?? null;
    }

    private inferDarkvision(race: RaceOption): number {
        // Check if race has darkvision feature
        const features = race.features || [];
        const hasDarkvision = features.some(f =>
            f.name.toLowerCase().includes('scurovisione') ||
            f.name.toLowerCase().includes('darkvision')
        );
        return hasDarkvision ? 60 : 0;
    }

    private inferLanguages(raceName: string): string[] {
        const languageMap: Record<string, string[]> = {
            'Umano': ['Comune'],
            'Elfo': ['Comune', 'Elfico'],
            'Nano': ['Comune', 'Nanico'],
            'Halfling': ['Comune', 'Halfling'],
            'Dragonide': ['Comune', 'Draconico'],
            'Gnomo': ['Comune', 'Gnomesco'],
            'Mezzelfo': ['Comune', 'Elfico'],
            'Mezzorco': ['Comune', 'Orchesco'],
            'Tiefling': ['Comune', 'Infernale'],
            'Aasimar': ['Comune', 'Celestiale'],
            'Goliath': ['Comune', 'Gigante'],
            'Tabaxi': ['Comune'],
            'Tritone': ['Comune', 'Primordiale'],
            'Kenku': ['Comune'],
            'Firbolg': ['Comune', 'Elfico', 'Gigante'],
            'Genasi': ['Comune', 'Primordiale'],
            'Warforged': ['Comune']
        };
        return languageMap[raceName] || ['Comune'];
    }

    /**
     * Clear all caches
     */
    public clearCache(): void {
        this.classCache.clear();
        this.raceCache.clear();
        this.backgroundCache.clear();
    }
}
