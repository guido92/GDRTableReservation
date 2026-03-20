import fs from 'fs/promises';
import path from 'path';
import { DICTIONARY, SPELL_TRANSLATIONS, FEAT_TRANSLATIONS, BACKGROUND_TRANSLATIONS } from '../data/translations';

const DATA_DIR = path.join(process.cwd(), 'plutonium', 'data');

export interface PlutoniumSpell {
    name: string;
    level: number;
    school: string;
    source: string;
    entries: unknown[]; // complex rich text
    duration: unknown[];
    range: unknown;
    components: unknown;
    classes?: { fromClassList?: string[] };
}

export interface PlutoniumItem {
    name: string;
    source: string;
    type: string;
    rarity: string;
    weight?: number;
    value?: number;
    weaponCategory?: string;
    property?: string[];
    dmg1?: string;
    dmgType?: string;
    ac?: number;
    entries?: unknown[];
}

export interface PlutoniumFeat {
    name: string;
    source: string;
    prerequisite?: unknown[];
    access?: unknown;
    entries: unknown[];
}

export interface PlutoniumBackground {
    name: string;
    source: string;
    skillProficiencies?: unknown[];
    toolProficiencies?: unknown[];
    languageProficiencies?: unknown[];
    startingEquipment?: unknown[];
    entries?: unknown[];
}

// Spell class mapping from sources.json: { "SOURCE": { "SpellName": { "class": [{ "name": "Wizard", "source": "PHB" }, ...] } } }
export type SpellClassMapping = Record<string, Record<string, { class: { name: string; source: string }[] }>>;

export class Plutonium {
    private static spellCache: PlutoniumSpell[] | null = null;
    private static itemCache: PlutoniumItem[] | null = null;
    private static featCache: PlutoniumFeat[] | null = null;
    private static backgroundCache: PlutoniumBackground[] | null = null;
    private static spellClassCache: SpellClassMapping | null = null;

    /**
     * Loads all spells from available sources.
     */
    static async getSpells(sources: string[] = ['PHB', 'XGE', 'TCE']): Promise<PlutoniumSpell[]> {
        if (this.spellCache) return this.filterSpells(this.spellCache, sources);

        const spellDir = path.join(DATA_DIR, 'spells');
        const files = await fs.readdir(spellDir);
        const spells: PlutoniumSpell[] = [];

        for (const file of files) {
            if (!file.startsWith('spells-') || file.includes('ua-') || file.includes('fluff')) continue;

            try {
                const content = await fs.readFile(path.join(spellDir, file), 'utf-8');
                const json = JSON.parse(content);
                if (json.spell) {
                    spells.push(...json.spell);
                }
            } catch (e) {
                console.error(`Failed to load ${file}`, e);
            }
        }

        this.spellCache = spells;
        return this.filterSpells(spells, sources);
    }

    private static filterSpells(spells: PlutoniumSpell[], sources: string[]) {
        const filtered = spells.filter(s => sources.includes(s.source) || s.source === 'PHB');

        // Deduplicate by Name (Case Insensitive)
        const unique = new Map<string, PlutoniumSpell>();
        for (const spell of filtered) {
            const lowerName = spell.name.toLowerCase();
            // Priority Logic: If already exists, overwrite ONLY if new source is in priority list [PHB, TCE, XGE]
            // Actually, simple "First Win" or "Last Win" is tricky without strict priority.
            // Let's assume standard order: PHB -> XGE -> TCE.
            // If we encounter "Booming Blade" (SCAG) then "Booming Blade" (TCE). 
            // We usually want TCE.
            // But we don't control iteration order perfectly across files.
            // Simplest: Keep the first one encountered, unless we specifically want to implement priority.

            // For now, just ensuring UNIQUE KEYS is the goal.
            if (!unique.has(lowerName)) {
                unique.set(lowerName, spell);
            }
        }
        return Array.from(unique.values());
    }

    /**
     * Loads items from items-base.json
     */
    static async getItems(sources: string[] = ['PHB', 'DMG', 'XGE', 'TCE']): Promise<PlutoniumItem[]> {
        if (this.itemCache) return this.filterItems(this.itemCache, sources);

        const itemFile = path.join(DATA_DIR, 'items-base.json');
        const items: PlutoniumItem[] = [];

        try {
            const content = await fs.readFile(itemFile, 'utf-8');
            const json = JSON.parse(content);
            if (json.baseitem) {
                items.push(...json.baseitem);
            }
        } catch (e) {
            console.error(`Failed to load items`, e);
        }

        this.itemCache = items;
        return this.filterItems(items, sources);
    }

    private static filterItems(items: PlutoniumItem[], sources: string[]) {
        return items.filter(i => {
            if (['DMG', 'XDMG'].includes(i.source) && !sources.includes('DMG')) return false;
            return sources.includes(i.source) || i.source === 'PHB';
        });
    }

    static async getFeats(sources: string[] = ['PHB', 'XGE', 'TCE']): Promise<PlutoniumFeat[]> {
        if (this.featCache) return this.filterGeneric(this.featCache, sources);

        const file = path.join(DATA_DIR, 'feats.json');
        const list: PlutoniumFeat[] = [];
        try {
            const content = await fs.readFile(file, 'utf-8');
            const json = JSON.parse(content);
            if (json.feat) list.push(...json.feat);
        } catch (e) { console.error('Failed to load feats', e); }

        this.featCache = list;
        return this.filterGeneric(list, sources);
    }

    static async getBackgrounds(sources: string[] = ['PHB', 'XGE', 'TCE']): Promise<PlutoniumBackground[]> {
        if (this.backgroundCache) return this.filterGeneric(this.backgroundCache, sources);

        const file = path.join(DATA_DIR, 'backgrounds.json');
        const list: PlutoniumBackground[] = [];
        try {
            const content = await fs.readFile(file, 'utf-8');
            const json = JSON.parse(content);
            if (json.background) list.push(...json.background);
        } catch (e) { console.error('Failed to load backgrounds', e); }

        this.backgroundCache = list;
        return this.filterGeneric(list, sources);
    }

    private static filterGeneric<T extends { source: string }>(list: T[], sources: string[]): T[] {
        return list.filter(i => sources.includes(i.source) || i.source === 'PHB');
    }

    /**
     * Loads spell-to-class mappings from sources.json
     */
    static async getSpellClassMapping(): Promise<SpellClassMapping> {
        if (this.spellClassCache) return this.spellClassCache;

        const sourcesFile = path.join(DATA_DIR, 'spells', 'sources.json');
        try {
            const content = await fs.readFile(sourcesFile, 'utf-8');
            this.spellClassCache = JSON.parse(content);
            return this.spellClassCache!;
        } catch (e) {
            console.error('Failed to load spell sources.json', e);
            return {};
        }
    }

    /**
     * Gets the classes for a spell by name and source.
     * Returns English class names from sources.json.
     */
    static async getClassesForSpell(spellName: string, source: string = 'PHB'): Promise<string[]> {
        const mapping = await this.getSpellClassMapping();
        const sourceMapping = mapping[source];
        if (!sourceMapping) return [];
        const spellMapping = sourceMapping[spellName];
        if (!spellMapping || !spellMapping.class) return [];
        // Deduplicate class names (same class may appear for different source books)
        return [...new Set(spellMapping.class.map(c => c.name))];
    }

    /**
     * Returns spells merged with their class assignments from sources.json.
     * Each spell gets a `classNames` field with English class names.
     */
    static async getSpellsWithClasses(sources: string[] = ['PHB', 'XGE', 'TCE']): Promise<(PlutoniumSpell & { classNames: string[] })[]> {
        const spells = await this.getSpells(sources);
        const mapping = await this.getSpellClassMapping();

        return spells.map(spell => {
            const sourceMapping = mapping[spell.source];
            const classNames: string[] = [];
            if (sourceMapping && sourceMapping[spell.name]?.class) {
                const seen = new Set<string>();
                for (const c of sourceMapping[spell.name].class) {
                    if (!seen.has(c.name)) {
                        seen.add(c.name);
                        classNames.push(c.name);
                    }
                }
            }
            return { ...spell, classNames };
        });
    }

    /**
     * Cleans 5etools rich text tags {@tag content} -> content
     */
    static cleanText(text: string): string {
        return text.replace(/{@\w+ (.*?)\|.*?}/g, '$1')
            .replace(/{@\w+ (.*?)}/g, '$1');
    }

    /**
     * Translates a known token using the dictionary, or returns the original
     */
    static translate(text: string, type: 'exact' | 'partial' = 'exact'): string {
        if (!text) return text;
        // 1. Check Spell Map
        if (SPELL_TRANSLATIONS[text]) return SPELL_TRANSLATIONS[text];
        if (FEAT_TRANSLATIONS[text]) return FEAT_TRANSLATIONS[text];
        if (BACKGROUND_TRANSLATIONS[text]) return BACKGROUND_TRANSLATIONS[text];

        // 2. Check Dictionary (Exact)
        if (DICTIONARY[text]) return DICTIONARY[text];

        // 3. Partial/Generic Replacement (only if requested, risky for names)
        if (type === 'partial') {
            let translated = text;
            for (const [eng, ita] of Object.entries(DICTIONARY)) {
                // simple word boundary check
                const regex = new RegExp(`\\b${eng}\\b`, 'g');
                translated = translated.replace(regex, ita);
            }
            return translated;
        }

        return text;
    }
}
