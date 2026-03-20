import { SPELLS as STATIC_SPELLS } from '../data/spells';

export interface UnifiedSpell {
    name: string;           // Italian name
    originalName: string;   // English name (from Plutonium) or same as name for static
    level: number;
    school: string;
    classes: string[];      // Italian class names
    source: string;
    description: string;
}

// English → Italian class name mapping
const CLASS_EN_TO_IT: Record<string, string> = {
    'Barbarian': 'Barbaro',
    'Bard': 'Bardo',
    'Cleric': 'Chierico',
    'Druid': 'Druido',
    'Fighter': 'Guerriero',
    'Monk': 'Monaco',
    'Paladin': 'Paladino',
    'Ranger': 'Ranger',
    'Rogue': 'Ladro',
    'Sorcerer': 'Stregone',
    'Warlock': 'Warlock',
    'Wizard': 'Mago',
    'Artificer': 'Artefice',
};

// Spells known/prepared count tables per class (PHB 2014)
const BARD_SPELLS_KNOWN = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22];
const SORCERER_SPELLS_KNOWN = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15];
const WARLOCK_SPELLS_KNOWN = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15];
const RANGER_SPELLS_KNOWN = [0, 0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11];

let cachedSpells: UnifiedSpell[] | null = null;

/**
 * Checks if we're running on the server (Node.js) where fs is available.
 */
function isServer(): boolean {
    return typeof window === 'undefined';
}

/**
 * Loads static spells as UnifiedSpell format.
 */
function getStaticSpells(): UnifiedSpell[] {
    return STATIC_SPELLS.map(s => ({
        name: s.name,
        originalName: s.name,
        level: s.level,
        school: s.school || '',
        classes: s.classes,
        source: 'STATIC',
        description: s.description,
    }));
}

export class SpellService {
    /**
     * Returns all unified spells. On server, uses Plutonium as primary source.
     * On client, uses static data directly.
     */
    static async getAllSpells(): Promise<UnifiedSpell[]> {
        if (cachedSpells) return cachedSpells;

        // On server, try Plutonium for enriched data
        if (isServer()) {
            try {
                // Dynamic import to avoid bundling fs/promises in client
                const { Plutonium } = await import('./plutonium');
                const plutoniumSpells = await Plutonium.getSpellsWithClasses(['PHB', 'XGE', 'TCE']);

                if (plutoniumSpells.length > 0) {
                    cachedSpells = plutoniumSpells.map(s => ({
                        name: Plutonium.translate(s.name, 'exact') || s.name,
                        originalName: s.name,
                        level: s.level,
                        school: Plutonium.translate(s.school || 'U', 'exact') || s.school,
                        classes: s.classNames.map(cn => CLASS_EN_TO_IT[cn] || cn).filter(Boolean),
                        source: s.source,
                        description: Plutonium.cleanText((s.entries?.[0] as string) || ''),
                    }));

                    // Merge in static spells that Plutonium might miss
                    const plutNames = new Set(cachedSpells.map(s => s.name.toLowerCase()));
                    for (const ss of STATIC_SPELLS) {
                        if (!plutNames.has(ss.name.toLowerCase())) {
                            cachedSpells.push({
                                name: ss.name,
                                originalName: ss.name,
                                level: ss.level,
                                school: ss.school || '',
                                classes: ss.classes,
                                source: 'STATIC',
                                description: ss.description,
                            });
                        }
                    }

                    return cachedSpells;
                }
            } catch (e) {
                console.warn('SpellService: Plutonium unavailable, using static data', e);
            }
        }

        // Fallback to static spells (client or server without Plutonium)
        cachedSpells = getStaticSpells();
        return cachedSpells;
    }

    /**
     * Returns spells for a specific class (Italian name) up to a max spell level.
     */
    static async getSpellsForClass(classNameIT: string, maxLevel: number = 9): Promise<UnifiedSpell[]> {
        const all = await this.getAllSpells();
        return all.filter(s =>
            s.level <= maxLevel &&
            s.classes.some(c => c.toLowerCase() === classNameIT.toLowerCase())
        );
    }

    /**
     * Returns a spell by Italian name (fuzzy).
     */
    static async getSpellByName(name: string): Promise<UnifiedSpell | undefined> {
        const all = await this.getAllSpells();
        const lower = name.toLowerCase().trim();
        return all.find(s => s.name.toLowerCase() === lower) ||
            all.find(s => s.name.toLowerCase().includes(lower) || lower.includes(s.name.toLowerCase()));
    }

    /**
     * How many spells a character should know/prepare based on class and level (PHB 2014).
     * Returns { cantrips, spells } counts. This is synchronous (no I/O).
     */
    static getSpellCounts(className: string, level: number, abilityMod: number): { cantrips: number; spells: number } {
        let cantrips = 0;
        const isFull = ['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone'].includes(className);
        const isWarlock = className === 'Warlock';

        if (isFull) {
            cantrips = level < 4 ? 3 : level < 10 ? 4 : 5;
            if (className === 'Stregone') cantrips = level < 4 ? 4 : level < 10 ? 5 : 6;
        }
        if (isWarlock) cantrips = level < 4 ? 2 : level < 10 ? 3 : 4;

        let spells = 0;
        switch (className) {
            case 'Bardo':
                spells = BARD_SPELLS_KNOWN[level] || 0;
                break;
            case 'Stregone':
                spells = SORCERER_SPELLS_KNOWN[level] || 0;
                break;
            case 'Warlock':
                spells = WARLOCK_SPELLS_KNOWN[level] || 0;
                break;
            case 'Ranger':
                spells = RANGER_SPELLS_KNOWN[level] || 0;
                break;
            case 'Mago':
            case 'Chierico':
            case 'Druido':
                spells = Math.max(1, level + abilityMod);
                break;
            case 'Paladino':
                spells = level < 2 ? 0 : Math.max(1, Math.floor(level / 2) + abilityMod);
                break;
            case 'Artefice':
                spells = Math.max(1, Math.floor(level / 2) + abilityMod);
                break;
            default:
                spells = 0;
        }

        return { cantrips, spells };
    }

    /**
     * Max spell level accessible for a given class at a given character level.
     * Synchronous — no I/O needed.
     */
    static getMaxSpellLevel(className: string, level: number): number {
        const isFull = ['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone'].includes(className);
        const isHalf = ['Paladino', 'Ranger'].includes(className);
        const isWarlock = className === 'Warlock';

        if (!isFull && !isHalf && !isWarlock) return 0;
        if (isHalf && level < 2) return 0;

        if (isFull) return Math.min(9, Math.ceil(level / 2));
        if (isHalf) return Math.min(5, Math.floor(level / 2));
        if (isWarlock) return Math.min(5, Math.ceil(level / 2));
        return 0;
    }

    /** Clear in-memory cache (useful for testing) */
    static clearCache(): void {
        cachedSpells = null;
    }
}
