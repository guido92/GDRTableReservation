import { CharacterData, AbilityScores, Feature } from '../types/dnd';
import { CLASSES, RACES, BACKGROUNDS, ALIGNMENTS, PERSONALITY_TRAITS, IDEALS, BONDS, FLAWS, Option, ITEMS } from '../data/dnd-data';
import { FiveToolsService, SOURCES_2014 } from '../services/five-tools-service';
import { UnifiedDataService } from '../services/unified-data-service';
import { SpellService } from './spell-service';
import { getClassTemplate, getOptimalStatDistribution, getIconicSpells, getDefaultEquipment, hasUnarmoredDefense, CLASS_TEMPLATES } from '../data/class-templates';
import { translateSpell } from '../data/translations';

// PHB 2014 skill proficiency counts per class
const SKILL_PROFICIENCY_COUNT: Record<string, number> = {
    'Barbaro': 2, 'Bardo': 3, 'Chierico': 2, 'Druido': 2,
    'Guerriero': 2, 'Monaco': 2, 'Paladino': 2, 'Ranger': 3,
    'Ladro': 4, 'Stregone': 2, 'Mago': 2, 'Warlock': 2,
    'Artefice': 2,
};

// Armor data with Italian names and 5etools type mapping
const ARMOR_DATA: Record<string, { baseAC: number; type: 'light' | 'medium' | 'heavy'; maxDex?: number }> = {
    // Light Armor (full DEX)
    'imbottita': { baseAC: 11, type: 'light' },
    'padded': { baseAC: 11, type: 'light' },
    'cuoio': { baseAC: 11, type: 'light' },
    'leather': { baseAC: 11, type: 'light' },
    'cuoio borchiato': { baseAC: 12, type: 'light' },
    'studded leather': { baseAC: 12, type: 'light' },
    // Medium Armor (DEX max +2)
    'pelle': { baseAC: 12, type: 'medium', maxDex: 2 },
    'hide': { baseAC: 12, type: 'medium', maxDex: 2 },
    'giaco di maglia': { baseAC: 13, type: 'medium', maxDex: 2 },
    'giaco': { baseAC: 13, type: 'medium', maxDex: 2 },
    'chain shirt': { baseAC: 13, type: 'medium', maxDex: 2 },
    'corazza a scaglie': { baseAC: 14, type: 'medium', maxDex: 2 },
    'scaglie': { baseAC: 14, type: 'medium', maxDex: 2 },
    'scale mail': { baseAC: 14, type: 'medium', maxDex: 2 },
    'corazza di piastre': { baseAC: 14, type: 'medium', maxDex: 2 },
    'breastplate': { baseAC: 14, type: 'medium', maxDex: 2 },
    'mezza armatura': { baseAC: 15, type: 'medium', maxDex: 2 },
    'half plate': { baseAC: 15, type: 'medium', maxDex: 2 },
    // Heavy Armor (no DEX)
    'cotta ad anelli': { baseAC: 14, type: 'heavy' },
    'anelli': { baseAC: 14, type: 'heavy' },
    'ring mail': { baseAC: 14, type: 'heavy' },
    'cotta di maglia': { baseAC: 16, type: 'heavy' },
    'chain mail': { baseAC: 16, type: 'heavy' },
    'armatura smembrata': { baseAC: 17, type: 'heavy' },
    'smembrata': { baseAC: 17, type: 'heavy' },
    'splint': { baseAC: 17, type: 'heavy' },
    'armatura completa': { baseAC: 18, type: 'heavy' },
    'completa': { baseAC: 18, type: 'heavy' },
    'a piastre': { baseAC: 18, type: 'heavy' },
    'plate': { baseAC: 18, type: 'heavy' },
};

export class CharacterLogic {

    // Calculates ability modifier: (Score - 10) / 2 rounded down
    static getModifier(score: number): number {
        return Math.floor((score - 10) / 2);
    }

    // Rolls 4d6 drop lowest
    static rollStat(): number {
        const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => a - b);
        return rolls.slice(1).reduce((a, b) => a + b, 0);
    }

    static generateAbilities(): AbilityScores {
        return {
            STR: this.rollStat(),
            DEX: this.rollStat(),
            CON: this.rollStat(),
            INT: this.rollStat(),
            WIS: this.rollStat(),
            CHA: this.rollStat(),
        };
    }

    static calculateHP(level: number, conMod: number, hitDieStr: string): { current: number; max: number; temp: number } {
        const hitDie = parseInt(hitDieStr.replace('d', '')) || 8;
        // Level 1: Full die
        let hp = hitDie + conMod;
        // Level 2+: Average (die/2 + 1)
        if (level > 1) {
            hp += (Math.floor(hitDie / 2) + 1 + conMod) * (level - 1);
        }
        // PHB: minimum 1 HP per level (even with negative CON mod)
        hp = Math.max(1, hp);
        return { current: hp, max: hp, temp: 0 };
    }

    static getRandomItem<T>(arr: T[] | readonly T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Calculate Armor Class from equipment
     * Uses armor data lookup with support for Italian and English names
     */
    static calculateArmorClass(
        equipment: string[],
        abilities: AbilityScores,
        className: string
    ): { ac: number; hasArmor: boolean; armorType: 'none' | 'light' | 'medium' | 'heavy' } {
        const dexMod = this.getModifier(abilities.DEX);
        const conMod = this.getModifier(abilities.CON);
        const wisMod = this.getModifier(abilities.WIS);

        let bestAC = 10 + dexMod;
        let hasArmor = false;
        let armorType: 'none' | 'light' | 'medium' | 'heavy' = 'none';
        const hasShield = equipment.some(e =>
            e.toLowerCase().includes('scudo') || e.toLowerCase().includes('shield')
        );

        // Find best armor in equipment
        for (const item of equipment) {
            const cleanName = item.toLowerCase().trim();

            // Check against armor data
            for (const [armorName, data] of Object.entries(ARMOR_DATA)) {
                if (cleanName.includes(armorName)) {
                    let ac: number;

                    switch (data.type) {
                        case 'light':
                            ac = data.baseAC + dexMod;
                            break;
                        case 'medium':
                            ac = data.baseAC + Math.min(dexMod, data.maxDex || 2);
                            break;
                        case 'heavy':
                            ac = data.baseAC;
                            break;
                    }

                    if (ac > bestAC) {
                        bestAC = ac;
                        hasArmor = true;
                        armorType = data.type;
                    }
                    break;
                }
            }
        }

        // Unarmored Defense
        const unarmoredDef = hasUnarmoredDefense(className);
        if (!hasArmor && unarmoredDef.enabled) {
            let unarmoredAC: number;
            if (unarmoredDef.secondaryStat === 'con') {
                // Barbarian: 10 + DEX + CON
                unarmoredAC = 10 + dexMod + conMod;
            } else if (unarmoredDef.secondaryStat === 'wis') {
                // Monk: 10 + DEX + WIS
                unarmoredAC = 10 + dexMod + wisMod;
            } else {
                unarmoredAC = 10 + dexMod;
            }
            bestAC = Math.max(bestAC, unarmoredAC);
        }

        // Shield bonus (+2)
        if (hasShield) {
            bestAC += 2;
        }

        return { ac: bestAC, hasArmor, armorType };
    }

    /**
     * Apply ability score bonuses from race (2014) or background (2024)
     * @param abilities Base ability scores
     * @param race Race data with abilityBonuses
     * @param subrace Optional subrace data
     * @param is2024 Whether using 2024 rules (bonuses from background instead)
     */
    static applyAbilityBonuses(
        abilities: AbilityScores,
        race: any,
        subrace?: any,
        is2024: boolean = false
    ): AbilityScores {
        const result = { ...abilities };

        if (is2024) {
            // 2024 rules: Bonuses come from background, not race
            // For now, just return base abilities - will be implemented when 2024 support is added
            return result;
        }

        // 2014 rules: Apply racial bonuses
        if (race?.abilityBonuses) {
            for (const [stat, bonus] of Object.entries(race.abilityBonuses)) {
                const key = stat as keyof AbilityScores;
                if (key in result && typeof bonus === 'number') {
                    result[key] += bonus;
                }
            }
        }

        // Apply subrace bonuses
        if (subrace?.abilityBonuses) {
            for (const [stat, bonus] of Object.entries(subrace.abilityBonuses)) {
                const key = stat as keyof AbilityScores;
                if (key in result && typeof bonus === 'number') {
                    result[key] += bonus;
                }
            }
        }

        return result;
    }

    static async getSpells(className: string, level: number, mentalStatMod: number): Promise<any[]> {
        const fts = FiveToolsService.getInstance();
        await fts.initialize();

        const knownSpells: any[] = [];
        const maxSpellLevel = SpellService.getMaxSpellLevel(className, level);

        // Non-casters check
        if (maxSpellLevel === 0 && !['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone', 'Warlock', 'Artefice'].includes(className)) return [];
        if (['Paladino', 'Ranger'].includes(className) && level < 2) return [];

        const { cantrips: numCantrips, spells: numSpells } = SpellService.getSpellCounts(className, level, mentalStatMod);
        const template = getClassTemplate(className);

        // Cantrips - prioritize iconic ones from template
        if (numCantrips > 0) {
            const iconicCantrips = template?.iconicCantrips || [];
            const available = fts.getSpells(className, 0);

            // First, add iconic cantrips
            for (const iconicName of iconicCantrips) {
                if (knownSpells.length >= numCantrips) break;
                const found = available.find(s =>
                    translateSpell(s.name).toLowerCase() === iconicName.toLowerCase() ||
                    s.name.toLowerCase() === iconicName.toLowerCase()
                );
                if (found && !knownSpells.find(k => k.name === found.name)) {
                    knownSpells.push({ name: found.name, level: 0, prepared: true });
                }
            }

            // Fill remaining with random cantrips
            const shuffled = [...available].sort(() => Math.random() - 0.5);
            for (const s of shuffled) {
                if (knownSpells.length >= numCantrips) break;
                if (!knownSpells.find(k => k.name === s.name)) {
                    knownSpells.push({ name: s.name, level: 0, prepared: true });
                }
            }
        }

        // Leveled Spells - prioritize iconic ones
        if (numSpells > 0) {
            let remaining = numSpells;
            const iconicByLevel = template?.iconicSpells || {};

            // First pass: add iconic spells
            for (let l = 1; l <= maxSpellLevel && remaining > 0; l++) {
                const iconicForLevel = iconicByLevel[l] || [];
                const available = fts.getSpells(className, l);

                for (const iconicName of iconicForLevel) {
                    if (remaining <= 0) break;
                    const found = available.find(s =>
                        translateSpell(s.name).toLowerCase() === iconicName.toLowerCase() ||
                        s.name.toLowerCase() === iconicName.toLowerCase()
                    );
                    if (found && !knownSpells.find(k => k.name === found.name)) {
                        knownSpells.push({ name: found.name, level: l, prepared: true });
                        remaining--;
                    }
                }
            }

            // Second pass: fill remaining with random spells
            for (let l = 1; l <= maxSpellLevel && remaining > 0; l++) {
                const available = fts.getSpells(className, l);
                const shuffled = [...available].sort(() => Math.random() - 0.5);

                for (const s of shuffled) {
                    if (remaining <= 0) break;
                    if (!knownSpells.find(k => k.name === s.name)) {
                        knownSpells.push({ name: s.name, level: l, prepared: true });
                        remaining--;
                    }
                }
            }
        }

        return knownSpells;
    }

    /**
     * Synchronous fallback for getSpells using static data only.
     */
    static getSpellsSync(className: string, level: number, mentalStatMod: number): any[] {
        const SPELLS = require('@/data/spells').SPELLS;
        const knownSpells: any[] = [];

        const maxSpellLevel = SpellService.getMaxSpellLevel(className, level);
        if (maxSpellLevel === 0 && !['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone', 'Warlock'].includes(className)) return [];
        if (['Paladino', 'Ranger'].includes(className) && level < 2) return [];

        const { cantrips: numCantrips, spells: numSpells } = SpellService.getSpellCounts(className, level, mentalStatMod);

        // Cantrips
        if (numCantrips > 0) {
            const cantrips = SPELLS.filter((s: any) => s.level === 0 && s.classes.includes(className));
            const shuffled = [...cantrips].sort(() => Math.random() - 0.5);
            for (const s of shuffled) {
                if (knownSpells.length >= numCantrips) break;
                if (!knownSpells.find((k: any) => k.name === s.name)) {
                    knownSpells.push({ ...s, prepared: true });
                }
            }
        }

        // Leveled
        if (numSpells > 0) {
            let remaining = numSpells;
            for (let l = 1; l <= maxSpellLevel && remaining > 0; l++) {
                const levelSpells = [...SPELLS.filter((s: any) => s.level === l && s.classes.includes(className))].sort(() => Math.random() - 0.5);
                for (const s of levelSpells) {
                    if (remaining <= 0) break;
                    if (!knownSpells.find((k: any) => k.name === s.name)) {
                        knownSpells.push({ ...s, prepared: true });
                        remaining--;
                    }
                }
            }
        }

        return knownSpells;
    }

    static calculateSpeed(race: any, subrace: any, className: string, level: number, equipment: string[]): number {
        let speed = race.speed || 30;
        if (subrace && subrace.speed) speed = subrace.speed;

        // Barbarian: Fast Movement (+10 at lvl 5 if no heavy armor)
        if (className === 'Barbaro' && level >= 5) {
            const hasHeavy = equipment.some(e =>
                ['anelli', 'cotta di maglia', 'smembrata', 'a piastre', 'completa', 'ring mail', 'chain mail', 'splint', 'plate'].some(h => e.toLowerCase().includes(h))
            );
            if (!hasHeavy) speed += 10;
        }

        // Monk: Unarmored Movement
        if (className === 'Monaco' && level >= 2) {
            let bonus = 10;
            if (level >= 6) bonus = 15;
            if (level >= 10) bonus = 20;
            if (level >= 14) bonus = 25;
            if (level >= 18) bonus = 30;

            const hasArmor = equipment.some(e =>
                ['imbottita', 'cuoio', 'pelle', 'giaco', 'corazza', 'maglia', 'scaglie', 'piastre', 'leather', 'hide', 'chain', 'scale', 'plate'].some(a => e.toLowerCase().includes(a))
            );
            const hasShield = equipment.some(e => e.toLowerCase().includes('scudo') || e.toLowerCase().includes('shield'));

            if (!hasArmor && !hasShield) speed += bonus;
        }

        return speed;
    }

    /**
     * Validates and corrects spell levels based on canonical data.
     */
    static validateSpellLevels(spells: any[]): any[] {
        if (!spells || !Array.isArray(spells)) return [];
        const fts = FiveToolsService.getInstance();

        return spells.map(spell => {
            const cleanName = spell.name.replace(/\(.*\)/, '').trim();
            const dbSpell = fts.getSpellByName(cleanName);

            if (dbSpell) {
                return { ...spell, level: dbSpell.level };
            }

            if (cleanName.toLowerCase().includes('trucchetto') || cleanName.toLowerCase().includes('cantrip')) {
                return { ...spell, level: 0 };
            }

            return spell;
        });
    }

    /**
     * Generate a quick character using class templates and UnifiedDataService
     */
    static async generateQuickCharacter(level: number, sources: string[], overrides?: { race?: string, class?: string }): Promise<CharacterData> {
        const uds = UnifiedDataService.getInstance();
        await uds.initialize();

        // Filter options based on available sources
        const validClasses = CLASSES.filter(c => !c.source || sources.includes(c.source));
        const validRaces = RACES.filter(r => !r.source || sources.includes(r.source));
        const validBackgrounds = BACKGROUNDS.filter(b => !b.source || sources.includes(b.source));

        // Random Selection or Override
        let rClass = this.getRandomItem(validClasses);
        if (overrides?.class) {
            const found = validClasses.find(c => c.name.toLowerCase() === overrides.class!.toLowerCase());
            if (found) rClass = found;
        }

        let rRace = this.getRandomItem(validRaces);
        if (overrides?.race) {
            const found = validRaces.find(r => r.name.toLowerCase() === overrides.race!.toLowerCase());
            if (found) rRace = found;
        }

        const rBg = this.getRandomItem(validBackgrounds);

        // Get class template for smart stat allocation
        const template = getClassTemplate(rClass.name);

        // Stats - Smart Allocation using class templates
        const rolls = Array.from({ length: 6 }, () => this.rollStat());
        let abilities: AbilityScores;

        if (template) {
            abilities = getOptimalStatDistribution(rClass.name, rolls);
        } else {
            // Fallback to legacy behavior
            const sortedRolls = [...rolls].sort((a, b) => b - a);
            const primaryStats: { [key: string]: string[] } = {
                'Barbaro': ['STR', 'CON', 'DEX', 'WIS', 'INT', 'CHA'],
                'Bardo': ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
                'Chierico': ['WIS', 'CON', 'STR', 'CHA', 'INT', 'DEX'],
                'Druido': ['WIS', 'CON', 'DEX', 'INT', 'CHA', 'STR'],
                'Guerriero': ['STR', 'CON', 'DEX', 'WIS', 'INT', 'CHA'],
                'Monaco': ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
                'Paladino': ['STR', 'CHA', 'CON', 'WIS', 'INT', 'DEX'],
                'Ranger': ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
                'Ladro': ['DEX', 'INT', 'CHA', 'CON', 'WIS', 'STR'],
                'Stregone': ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
                'Mago': ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
                'Warlock': ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
                'Artefice': ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR']
            };
            const priorities = primaryStats[rClass.name] || ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
            abilities = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
            priorities.forEach((stat, index) => {
                (abilities as any)[stat] = sortedRolls[index];
            });
        }

        // Subrace Logic
        let subrace: Option | undefined;
        let raceName = rRace.name;
        if (rRace.suboptions) {
            subrace = this.getRandomItem(rRace.suboptions);
            raceName = subrace.name;
        }

        // Apply racial ability bonuses (2014 rules)
        const is2024 = sources.includes('PHB24');
        abilities = this.applyAbilityBonuses(abilities, rRace, subrace, is2024);

        // Consistent Personality
        const rIdeal = this.getRandomItem(IDEALS);
        const idealAlignMatch = rIdeal.match(/\((.*?)\)/);
        let validAlignments = ALIGNMENTS;

        if (idealAlignMatch) {
            const constraint = idealAlignMatch[1];
            if (constraint !== "Qualsiasi") {
                if (constraint === 'Legale') validAlignments = ALIGNMENTS.filter(a => a.includes('Legale'));
                else if (constraint === 'Caotico') validAlignments = ALIGNMENTS.filter(a => a.includes('Caotico'));
                else if (constraint === 'Buono') validAlignments = ALIGNMENTS.filter(a => a.includes('Buono'));
                else if (constraint === 'Malvagio') validAlignments = ALIGNMENTS.filter(a => a.includes('Malvagio'));
                else if (constraint === 'Neutrale') validAlignments = ALIGNMENTS.filter(a => a.includes('Neutrale'));
            }
        }

        if (validAlignments.length === 0) validAlignments = ALIGNMENTS;
        const rAlign = this.getRandomItem(validAlignments);

        // Subclass Logic
        let subclass: Option | undefined;
        let subclassName = "";
        if (level >= 3 && rClass.suboptions) {
            const validSub = rClass.suboptions.filter(s => !s.source || sources.includes(s.source));
            if (validSub.length > 0) {
                subclass = this.getRandomItem(validSub);
                subclassName = subclass.name;
            }
        }

        // Features
        const features: Feature[] = [];

        // Get equipment from template or class defaults
        const equipment: string[] = template
            ? [...getDefaultEquipment(rClass.name)]
            : [...(rClass.equipment || [])];
        equipment.push(...(rBg.equipment || []));

        // 1. Race Features
        if (rRace.features) features.push(...rRace.features.map(f => ({ ...f, name: `(Razza) ${f.name}` })));
        if (subrace && subrace.features) features.push(...subrace.features.map(f => ({ ...f, name: `(Razza) ${f.name}` })));

        // 2. Class Features
        if (rClass.features) {
            features.push(...rClass.features.filter(f => f.level <= level).map(f => ({ ...f, name: `(Classe) ${f.name}` })));
        }
        if (subclass && subclass.features) {
            features.push(...subclass.features.filter(f => f.level <= level).map(f => ({ ...f, name: `(Archetipo) ${f.name}` })));
        }

        // 3. Background Features
        if (rBg.features) features.push(...rBg.features.map(f => ({ ...f, name: `(Background) ${f.name}` })));

        // Derived Stats
        const dexMod = this.getModifier(abilities.DEX);
        const conMod = this.getModifier(abilities.CON);

        let castStatMod = this.getModifier(abilities.INT);
        if (["Chierico", "Druido", "Ranger", "Monaco"].includes(rClass.name)) castStatMod = this.getModifier(abilities.WIS);
        if (["Bardo", "Paladino", "Stregone", "Warlock"].includes(rClass.name)) castStatMod = this.getModifier(abilities.CHA);

        // Skills Selection
        const skills: string[] = [];
        if (rClass.proficiencies && rClass.proficiencies.skills) {
            const available = [...rClass.proficiencies.skills];
            const numSkills = SKILL_PROFICIENCY_COUNT[rClass.name] || 2;
            for (let i = 0; i < numSkills; i++) {
                if (available.length === 0) break;
                const idx = Math.floor(Math.random() * available.length);
                skills.push(available[idx]);
                available.splice(idx, 1);
            }
        }

        // AC Calculation using new method
        const { ac } = this.calculateArmorClass(equipment, abilities, rClass.name);

        const hp = this.calculateHP(level, conMod, rClass.hitDie ? `d${rClass.hitDie}` : 'd8');

        // Attacks
        const attacks = [];
        const strMod = this.getModifier(abilities.STR);
        const prof = Math.ceil(level / 4) + 1;

        if (equipment.some(e => e.includes('Spada') || e.includes('Ascia') || e.includes('Mazza') || e.includes('Lancia'))) {
            attacks.push({ name: 'Arma da Mischia', bonus: `+${strMod + prof}`, damage: `1d8+${strMod}` });
        }
        if (equipment.some(e => e.includes('Arco') || e.includes('Balestra') || e.includes('Dardo'))) {
            attacks.push({ name: 'Arma a Distanza', bonus: `+${dexMod + prof}`, damage: `1d6+${dexMod}` });
        }
        if (rClass.name === "Monaco") {
            const martialDie = level >= 17 ? 10 : level >= 11 ? 8 : level >= 5 ? 6 : 4;
            attacks.push({ name: 'Arti Marziali', bonus: `+${dexMod + prof}`, damage: `1d${martialDie}+${dexMod}` });
        }

        if (attacks.length === 0) {
            attacks.push({ name: 'Colpo Disarmato', bonus: `+${strMod + prof}`, damage: `1+${strMod}` });
            attacks.push({ name: 'Daga', bonus: `+${dexMod + prof}`, damage: `1d4+${dexMod}` });
        }

        // Personality
        const personality = {
            traits: this.getRandomItem(PERSONALITY_TRAITS),
            ideals: rIdeal,
            bonds: this.getRandomItem(BONDS),
            flaws: this.getRandomItem(FLAWS),
            backstory: `Un ${rClass.name} ${rRace.name} proveniente da ${rBg.name}. Ha iniziato il suo viaggio per cercare fortuna e gloria, ma il destino ha in serbo altro. Cresciuto tra le leggende del suo popolo, ha giurato di proteggere i deboli e sconfiggere il male ovunque si annidi.`
        };

        // Languages based on race
        const raceLanguages: Record<string, string[]> = {
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
            'Firbolg': ['Comune', 'Elfico', 'Gigante'],
            'Genasi': ['Comune', 'Primordiale'],
        };
        const languages = raceLanguages[rRace.name] || ['Comune'];

        // Spells Generation
        const spells = await this.getSpells(rClass.name, level, castStatMod);

        return {
            characterName: "Eroe Generato",
            playerName: "Quick Build",
            race: raceName,
            class: rClass.name,
            subclass: subclassName,
            level: level,
            background: rBg.name,
            alignment: rAlign,
            abilities,
            skills,
            languages,
            proficiencies: {
                armor: rClass.proficiencies?.armor || [],
                weapons: rClass.proficiencies?.weapons || [],
                tools: rClass.proficiencies?.tools || [],
                savingThrows: rClass.proficiencies?.savingThrows || []
            },
            equipment,
            features,
            attacks,
            hp,
            armorClass: ac,
            initiative: dexMod,
            speed: this.calculateSpeed(rRace, subrace, rClass.name, level, equipment),
            hitDice: { total: level, die: rClass.hitDie ? `d${rClass.hitDie}` : 'd8' },
            personality,
            spells,
            is2024
        };
    }

    /**
     * Hydrates a partially filled character with full features and stats
     */
    static async hydrateCharacter(data: CharacterData): Promise<CharacterData> {
        const newData = { ...data };
        const level = newData.level || 1;

        const rClass = CLASSES.find(c => c.name === data.class.replace(/ *\(.*\)/, '')) || CLASSES[0];
        const rRace = RACES.find(r => r.name === data.race.replace(/ *\(.*\)/, '')) || RACES[0];
        const rBg = BACKGROUNDS.find(b => b.name === data.background.replace(/ *\(.*\)/, '')) || BACKGROUNDS[0];

        const subclassName = data.class.match(/\((.*?)\)/)?.[1];
        const subclass = subclassName ? rClass.suboptions?.find(s => s.name === subclassName) : undefined;

        const subraceName = data.race.match(/\((.*?)\)/)?.[1];
        const subrace = subraceName ? rRace.suboptions?.find(s => s.name === subraceName) : undefined;

        // Features
        const features: Feature[] = [...(newData.features || [])];

        if (rRace.features) {
            rRace.features.filter(f => !f.level || f.level <= level).forEach(f => {
                if (!features.find(ef => ef.name === f.name)) features.push({ ...f, name: `(Razza) ${f.name}` });
            });
        }
        if (subrace && subrace.features) {
            subrace.features.filter(f => !f.level || f.level <= level).forEach(f => {
                if (!features.find(ef => ef.name === f.name)) features.push({ ...f, name: `(Razza) ${f.name}` });
            });
        }

        if (rClass.features) {
            rClass.features.filter(f => f.level <= level).forEach(f => {
                if (!features.find(ef => ef.name === f.name || ef.name === `(Classe) ${f.name}`)) {
                    features.push({ ...f, name: `(Classe) ${f.name}` });
                }
            });
        }
        if (subclass && subclass.features) {
            subclass.features.filter(f => f.level <= level).forEach(f => {
                if (!features.find(ef => ef.name === f.name || ef.name === `(Archetipo) ${f.name}`)) {
                    features.push({ ...f, name: `(Archetipo) ${f.name}` });
                }
            });
        }

        if (rBg.features) {
            rBg.features.filter(f => !f.level || f.level <= level).forEach(f => {
                if (!features.find(ef => ef.name === f.name)) features.push({ ...f, name: `(Background) ${f.name}` });
            });
        }

        newData.features = features;

        // HP Calculation
        if (newData.hp.max === 10 && rClass.hitDie && rClass.hitDie !== 10) {
            const conMod = this.getModifier(newData.abilities.CON);
            const hpCalc = this.calculateHP(level, conMod, `d${rClass.hitDie}`);
            newData.hp = hpCalc;
            newData.hitDice = { total: level, die: `d${rClass.hitDie}` };
        }

        // Equipment Aggregation
        if (newData.equipment.length === 0) {
            if (rClass.equipment) newData.equipment.push(...rClass.equipment);
            if (rBg.equipment) newData.equipment.push(...rBg.equipment);
            if (newData.equipment.length === 0) newData.equipment.push("Zaino da Esploratore");
        }

        // Proficiencies
        const mergeUnique = (arr1: string[] = [], arr2: string[] = []) => Array.from(new Set([...arr1, ...arr2]));

        newData.proficiencies = {
            armor: mergeUnique(newData.proficiencies?.armor, rClass.proficiencies?.armor),
            weapons: mergeUnique(newData.proficiencies?.weapons, rClass.proficiencies?.weapons),
            tools: mergeUnique(newData.proficiencies?.tools, rClass.proficiencies?.tools),
            savingThrows: mergeUnique(newData.proficiencies?.savingThrows, rClass.proficiencies?.savingThrows)
        };

        newData.skills = mergeUnique(newData.skills, rBg.skillProficiencies || []);

        // Languages
        if (!newData.languages || newData.languages.length === 0) {
            const raceLanguages: Record<string, string[]> = {
                'Umano': ['Comune'], 'Elfo': ['Comune', 'Elfico'], 'Nano': ['Comune', 'Nanico'],
                'Halfling': ['Comune', 'Halfling'], 'Dragonide': ['Comune', 'Draconico'],
                'Gnomo': ['Comune', 'Gnomesco'], 'Mezzelfo': ['Comune', 'Elfico'],
                'Mezzorco': ['Comune', 'Orchesco'], 'Tiefling': ['Comune', 'Infernale'],
                'Aasimar': ['Comune', 'Celestiale'], 'Goliath': ['Comune', 'Gigante'],
                'Tabaxi': ['Comune'], 'Tritone': ['Comune', 'Primordiale'],
                'Kenku': ['Comune', 'Auran'], 'Tortle': ['Comune', 'Aquan'],
                'Warforged': ['Comune'], 'Genasi': ['Comune', 'Primordiale'],
            };
            const baseRaceName = data.race.replace(/\s*\(.*\)/, '');
            newData.languages = raceLanguages[baseRaceName] || ['Comune'];
            if (rBg.languages) {
                rBg.languages.forEach(l => {
                    if (!l.includes('scelta') && !newData.languages.includes(l)) {
                        newData.languages.push(l);
                    }
                });
            }
        }

        // HP Calculation Fallback
        if ((!newData.hp.max || newData.hp.max === 0) && rClass.hitDie) {
            const conMod = this.getModifier(newData.abilities.CON);
            const hpCalc = this.calculateHP(level, conMod, `d${rClass.hitDie}`);
            newData.hp = hpCalc;
            newData.hitDice = { total: level, die: `d${rClass.hitDie}` };
        }

        if (!newData.hitDice?.die) {
            newData.hitDice = { total: level, die: rClass.hitDie ? `d${rClass.hitDie}` : 'd8' };
        }

        // AC Calculation
        if (!newData.armorClass || newData.armorClass === 10) {
            const { ac } = this.calculateArmorClass(newData.equipment, newData.abilities, rClass.name);
            newData.armorClass = ac;
        }

        // Attacks
        if (!newData.attacks || newData.attacks.length === 0) {
            newData.attacks = [];
            const strMod = this.getModifier(newData.abilities.STR);
            const dexMod = this.getModifier(newData.abilities.DEX);
            const profBonus = Math.ceil((level) / 4) + 1;

            newData.equipment.forEach(itemStr => {
                const itemName = itemStr.replace(/x[0-9]+/, '').trim();
                const item = ITEMS.find(i => itemName.toLowerCase().includes(i.name.toLowerCase()));

                if (item && item.type === 'Weapon' && item.damage) {
                    const props = (item.properties || []).join(' ').toLowerCase();
                    const isFinesse = props.includes('accurata') || props.includes('finesse');
                    const isRanged = props.includes('arco') || props.includes('balestra') || props.includes('lancio') || item.name.toLowerCase().includes('arco');

                    let useDex = isRanged;
                    if (isFinesse) useDex = dexMod > strMod;

                    const mod = useDex ? dexMod : strMod;
                    const atkBonus = mod + profBonus;
                    const dmg = `${item.damage}${mod >= 0 ? '+' : ''}${mod}`;
                    const dmgType = item.damageType ? ` (${item.damageType})` : '';

                    newData.attacks.push({
                        name: item.name,
                        bonus: atkBonus >= 0 ? `+${atkBonus}` : `${atkBonus}`,
                        damage: `${dmg}${dmgType}`
                    });
                }
            });

            if (newData.attacks.length === 0) {
                newData.attacks.push({ name: 'Colpo Disarmato', bonus: `+${strMod + profBonus}`, damage: `1+${strMod}` });
            }
        }

        // Appearance
        if (!newData.appearance || (!newData.appearance.age && !newData.appearance.height)) {
            const raceAppearance: Record<string, { age: string; height: string; weight: string }> = {
                'Elfo': { age: '120', height: '1.70m', weight: '60kg' },
                'Nano': { age: '150', height: '1.30m', weight: '70kg' },
                'Halfling': { age: '40', height: '0.90m', weight: '35kg' },
                'Gnomo': { age: '100', height: '1.00m', weight: '35kg' },
                'Dragonide': { age: '30', height: '1.90m', weight: '110kg' },
                'Mezzorco': { age: '25', height: '1.85m', weight: '100kg' },
                'Tiefling': { age: '30', height: '1.75m', weight: '75kg' },
                'Mezzelfo': { age: '50', height: '1.70m', weight: '68kg' },
                'Aasimar': { age: '30', height: '1.80m', weight: '75kg' },
                'Goliath': { age: '30', height: '2.20m', weight: '140kg' },
                'Tabaxi': { age: '25', height: '1.75m', weight: '65kg' },
                'Warforged': { age: '10', height: '1.85m', weight: '130kg' },
                'Kenku': { age: '20', height: '1.50m', weight: '50kg' },
                'Tortle': { age: '40', height: '1.70m', weight: '200kg' },
                'Tritone': { age: '60', height: '1.60m', weight: '65kg' },
                'Genasi': { age: '30', height: '1.75m', weight: '75kg' },
            };
            const baseRaceName = data.race.replace(/\s*\(.*\)/, '');
            const raceDefaults = raceAppearance[baseRaceName] || { age: '25', height: '1.75m', weight: '75kg' };
            const eyes = ['Marroni', 'Azzurri', 'Verdi', 'Grigi', 'Ambra', 'Nocciola'];
            const skins = ['Chiara', 'Olivastra', 'Scura', 'Bronzea', 'Pallida'];
            const hairs = ['Neri', 'Castani', 'Biondi', 'Rossi', 'Grigi', 'Bianchi'];
            newData.appearance = {
                age: newData.appearance?.age || raceDefaults.age,
                height: newData.appearance?.height || raceDefaults.height,
                weight: newData.appearance?.weight || raceDefaults.weight,
                eyes: newData.appearance?.eyes || eyes[Math.floor(Math.random() * eyes.length)],
                skin: newData.appearance?.skin || skins[Math.floor(Math.random() * skins.length)],
                hair: newData.appearance?.hair || hairs[Math.floor(Math.random() * hairs.length)],
            };
        }

        // Spells
        if (newData.spells.length === 0) {
            let castStatMod = this.getModifier(newData.abilities.INT);
            if (["Chierico", "Druido", "Ranger", "Monaco"].includes(rClass.name)) castStatMod = this.getModifier(newData.abilities.WIS);
            if (["Bardo", "Paladino", "Stregone", "Warlock"].includes(rClass.name)) castStatMod = this.getModifier(newData.abilities.CHA);
            newData.spells = await this.getSpells(rClass.name, level, castStatMod);
        }

        return newData;
    }
}
