import { CharacterData, AbilityScores, Feature } from '@/types/dnd';
import { CLASSES, RACES, BACKGROUNDS, ALIGNMENTS, PERSONALITY_TRAITS, IDEALS, BONDS, FLAWS, Option, ITEMS } from '@/data/dnd-data';

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
        return { current: hp, max: hp, temp: 0 };
    }

    static getRandomItem<T>(arr: T[] | readonly T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static getSpells(className: string, level: number, mentalStatMod: number): any[] {
        const SPELLS = require('@/data/spells').SPELLS;
        const knownSpells: any[] = [];

        // Simplified Logic for slots/known
        // Full Casters (Bard, Cleric, Druid, Sorcerer, Wizard): ~ Level + Mod
        // Half Casters (Paladin, Ranger): ~ Level/2 + Mod
        // Warlock: Special

        const isFull = ["Bardo", "Chierico", "Druido", "Mago", "Stregone"].includes(className);
        const isHalf = ["Paladino", "Ranger"].includes(className);
        const isWarlock = className === "Warlock";

        if (!isFull && !isHalf && !isWarlock) return [];

        const maxSpellLevel = isFull ? Math.min(9, Math.ceil(level / 2)) :
            isHalf ? Math.min(5, Math.ceil(level / 2)) :
                isWarlock ? Math.min(5, Math.ceil(level / 2)) : 0; // Warlock simplif.

        // Cantrips (Level 0)
        let numCantrips = 0;
        if (isFull) numCantrips = level < 4 ? 3 : level < 10 ? 4 : 5;
        if (isWarlock) numCantrips = 2; // simplified
        if (["Paladino", "Ranger"].includes(className)) numCantrips = 0; // standard 5e

        if (numCantrips > 0) {
            const cantrips = SPELLS.filter((s: any) => s.level === 0 && s.classes.includes(className));
            for (let i = 0; i < numCantrips; i++) {
                if (cantrips.length > 0) {
                    const s = this.getRandomItem(cantrips) as any;
                    if (!knownSpells.find(k => k.name === s.name)) {
                        knownSpells.push({ ...s, prepared: true });
                    }
                }
            }
        }

        // Leveled Spells
        // Pick a few per level up to max
        for (let l = 1; l <= maxSpellLevel; l++) {
            const levelSpells = SPELLS.filter((s: any) => s.level === l && s.classes.includes(className));
            if (levelSpells.length === 0) continue;

            const numToPick = 6;

            for (let i = 0; i < numToPick; i++) {
                if (levelSpells.length === 0) break;
                const randomIndex = Math.floor(Math.random() * levelSpells.length);
                const s = levelSpells[randomIndex] as any;

                // Avoid duplicates
                if (!knownSpells.find(k => k.name === s.name)) {
                    knownSpells.push({ ...s, prepared: true });
                }
                // Remove selected to avoid re-picking
                levelSpells.splice(randomIndex, 1);
            }
        }

        return knownSpells;
    }

    /**
     * Validates and corrects spell levels based on canonical data.
     * Use this to fix AI hallucinations (e.g. Benedizione as Cantrip).
     */
    static validateSpellLevels(spells: any[]): any[] {
        if (!spells || !Array.isArray(spells)) return [];
        const SPELLS = require('@/data/spells').SPELLS;

        return spells.map(spell => {
            const cleanName = spell.name.replace(/\(.*\)/, '').trim().toLowerCase();

            // Find canonical spell (Fuzzy Match)
            const match = SPELLS.find((s: any) => {
                const dbName = s.name.trim().toLowerCase();
                return dbName === cleanName || cleanName.includes(dbName) || dbName.includes(cleanName);
            });

            if (match) {
                return { ...spell, level: match.level };
            }

            // Heuristic fallback
            if (cleanName.includes('trucchetto') || cleanName.includes('cantrip')) {
                return { ...spell, level: 0 };
            }

            return spell;
        });
    }

    static generateQuickCharacter(level: number, sources: string[], overrides?: { race?: string, class?: string }): CharacterData {
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
        // Stats - Smart Allocation
        const rolls = Array.from({ length: 6 }, () => this.rollStat()).sort((a, b) => b - a); // Descending

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
            'Warlock': ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR']
        };

        const priorities = primaryStats[rClass.name] || ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
        const abilities: AbilityScores = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

        priorities.forEach((stat, index) => {
            (abilities as any)[stat] = rolls[index];
        });

        // Consistent Personality
        const rIdeal = this.getRandomItem(IDEALS);
        const idealAlignMatch = rIdeal.match(/\((.*?)\)/);
        let validAlignments = ALIGNMENTS;

        if (idealAlignMatch) {
            const constraint = idealAlignMatch[1];
            if (constraint !== "Qualsiasi") {
                validAlignments = ALIGNMENTS.filter(a => a.includes(constraint) || (constraint === 'Neutrale' && a === 'Neutrale Puro'));
                if (validAlignments.length === 0) validAlignments = [constraint + " Neutrale", "Neutrale " + constraint];

                if (constraint === 'Legale') validAlignments = ALIGNMENTS.filter(a => a.includes('Legale'));
                if (constraint === 'Caotico') validAlignments = ALIGNMENTS.filter(a => a.includes('Caotico'));
                if (constraint === 'Buono') validAlignments = ALIGNMENTS.filter(a => a.includes('Buono'));
                if (constraint === 'Malvagio') validAlignments = ALIGNMENTS.filter(a => a.includes('Malvagio'));
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

        // Subrace Logic
        let subrace: Option | undefined;
        let raceName = rRace.name;
        if (rRace.suboptions) {
            subrace = this.getRandomItem(rRace.suboptions);
            raceName = subrace.name;
        }

        // Features
        const features: Feature[] = [];
        const equipment: string[] = [...(rClass.equipment || [])];
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

        let castStatMod = this.getModifier(abilities.INT); // Default
        if (["Chierico", "Druido", "Ranger", "Monaco"].includes(rClass.name)) castStatMod = this.getModifier(abilities.WIS);
        if (["Bardo", "Paladino", "Stregone", "Warlock"].includes(rClass.name)) castStatMod = this.getModifier(abilities.CHA);

        // 4. Skills Selection
        const skills: string[] = [];
        if (rClass.proficiencies && rClass.proficiencies.skills) {
            const available = [...rClass.proficiencies.skills];
            for (let i = 0; i < 2; i++) {
                if (available.length === 0) break;
                const idx = Math.floor(Math.random() * available.length);
                skills.push(available[idx]);
                available.splice(idx, 1);
            }
        }

        // AC Calculation
        let ac = 10 + dexMod;
        if (equipment.some(e => e.includes('Cuoio'))) ac = 11 + dexMod;
        if (equipment.some(e => e.includes('Cotta di maglia'))) ac = 16;
        if (equipment.some(e => e.includes('Scaglie'))) ac = 14 + (dexMod > 2 ? 2 : dexMod);
        if (equipment.some(e => e.includes('Scudo'))) ac += 2;

        if (rClass.name === 'Barbaro' && !equipment.some(e => e.includes('Armatura'))) ac = 10 + dexMod + conMod;
        if (rClass.name === 'Monaco' && !equipment.some(e => e.includes('Armatura'))) ac = 10 + dexMod + this.getModifier(abilities.WIS);


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
            attacks.push({ name: 'Arti Marziali', bonus: `+${dexMod + prof}`, damage: `1d4+${dexMod}` });
        }

        // Fallback Attack if empty
        if (attacks.length === 0) {
            attacks.push({ name: 'Colpo Disarmato', bonus: `+${strMod + prof}`, damage: `1+${strMod}` });
            attacks.push({ name: 'Daga', bonus: `+${dexMod + prof}`, damage: `1d4+${dexMod}` });
        }

        // Personality
        const personality = {
            traits: this.getRandomItem(PERSONALITY_TRAITS),
            ideals: this.getRandomItem(IDEALS),
            bonds: this.getRandomItem(BONDS),
            flaws: this.getRandomItem(FLAWS),
            backstory: `Un ${rClass.name} ${rRace.name} proveniente da ${rBg.name}. Ha iniziato il suo viaggio per cercare fortuna e gloria, ma il destino ha in serbo altro. Cresciuto tra le leggende del suo popolo, ha giurato di proteggere i deboli e sconfiggere il male ovunque si annidi. Porta con sé i ricordi del passato e la speranza di un futuro migliore. Odiato dai suoi nemici e rispettato dai suoi alleati, è pronto a scrivere la propria leggenda.`
        };

        // SPELLS GENERATION
        const spells = this.getSpells(rClass.name, level, castStatMod);

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
            skills: skills,
            languages: ["Comune", ...(rRace.name === 'Elfo' ? ['Elfico'] : []), ...(rRace.name === 'Nano' ? ['Nanico'] : [])],
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
            speed: 30, // Changed from 9 to 30 (User probably wants Speed 30 for standard)
            hitDice: { total: level, die: rClass.hitDie ? `d${rClass.hitDie}` : 'd8' },
            personality,
            spells,
            is2024: sources.includes('PHB24')
        };
    }

    /**
     * Hydrates a partially filled character (from Manual Wizard) with full features and stats 
     * based on the selected Class/Race/Background names.
     */
    static hydrateCharacter(data: CharacterData): CharacterData {
        const newData = { ...data };
        const level = newData.level || 1;

        // Resolve Objects
        const rClass = CLASSES.find(c => c.name === data.class.replace(/ *\(.*\)/, '')) || CLASSES[0];
        const rRace = RACES.find(r => r.name === data.race.replace(/ *\(.*\)/, '')) || RACES[0];
        const rBg = BACKGROUNDS.find(b => b.name === data.background.replace(/ *\(.*\)/, '')) || BACKGROUNDS[0];

        // Resolve Suboptions
        const subclassName = data.class.match(/\((.*?)\)/)?.[1];
        const subclass = subclassName ? rClass.suboptions?.find(s => s.name === subclassName) : undefined;

        const subraceName = data.race.match(/\((.*?)\)/)?.[1];
        const subrace = subraceName ? rRace.suboptions?.find(s => s.name === subraceName) : undefined;

        // Features
        const features: Feature[] = [...(newData.features || [])];

        // 1. Race Features
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

        // 2. Class Features
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

        // 3. Background Features
        if (rBg.features) {
            rBg.features.filter(f => !f.level || f.level <= level).forEach(f => {
                if (!features.find(ef => ef.name === f.name)) features.push({ ...f, name: `(Background) ${f.name}` });
            });
        }

        newData.features = features;

        // HP Calculation (if default)
        if (newData.hp.max === 10 && rClass.hitDie && rClass.hitDie !== 10) {
            const conMod = this.getModifier(newData.abilities.CON);
            const hpCalc = this.calculateHP(level, conMod, `d${rClass.hitDie}`);
            newData.hp = hpCalc;
            newData.hitDice = { total: level, die: `d${rClass.hitDie}` };
        }

        // 4. Equipment Aggregation (if empty)
        if (newData.equipment.length === 0) {
            if (rClass.equipment) newData.equipment.push(...rClass.equipment);
            if (rBg.equipment) newData.equipment.push(...rBg.equipment);
            // Default Pack if missing
            if (newData.equipment.length === 0) newData.equipment.push("Zaino da Esploratore");
        }

        // 5. Proficiencies Aggregation (Merge Unique)
        const mergeUnique = (arr1: string[] = [], arr2: string[] = []) => Array.from(new Set([...arr1, ...arr2]));

        newData.proficiencies = {
            armor: mergeUnique(newData.proficiencies?.armor, rClass.proficiencies?.armor),
            weapons: mergeUnique(newData.proficiencies?.weapons, rClass.proficiencies?.weapons),
            tools: mergeUnique(newData.proficiencies?.tools, rClass.proficiencies?.tools),
            savingThrows: mergeUnique(newData.proficiencies?.savingThrows, rClass.proficiencies?.savingThrows)
        };

        // Merge Skills (Unique)
        newData.skills = mergeUnique(newData.skills, rBg.skillProficiencies || []);

        // 6. HP Calculation (Safe Fallback)
        if ((!newData.hp.max || newData.hp.max === 0) && rClass.hitDie) {
            const conMod = this.getModifier(newData.abilities.CON);
            const hpCalc = this.calculateHP(level, conMod, `d${rClass.hitDie}`);
            newData.hp = hpCalc;
            newData.hitDice = { total: level, die: `d${rClass.hitDie}` };
        }

        // Ensure HitDice are correct even if HP was manual
        if (!newData.hitDice?.die) {
            newData.hitDice = { total: level, die: rClass.hitDie ? `d${rClass.hitDie}` : 'd8' };
        }

        // 7. Generate Attacks from Equipment
        if (!newData.attacks || newData.attacks.length === 0) {
            newData.attacks = [];
            const strMod = this.getModifier(newData.abilities.STR);
            const dexMod = this.getModifier(newData.abilities.DEX);
            const profBonus = Math.ceil((level) / 4) + 1;

            newData.equipment.forEach(itemStr => {
                // Handle "Spada Lunga (2)" or similar
                const itemName = itemStr.replace(/x[0-9]+/, '').trim();
                // Find in DB (Case insensitive)
                const item = ITEMS.find(i => itemName.toLowerCase().includes(i.name.toLowerCase()));

                if (item && item.type === 'Weapon' && item.damage) {
                    const props = (item.properties || []).join(' ').toLowerCase();
                    const isFinesse = props.includes('accurata') || props.includes('finesse');
                    const isRanged = props.includes('arco') || props.includes('balestra') || props.includes('lancio') || item.name.toLowerCase().includes('arco');

                    // Determine Stat
                    let useDex = isRanged;
                    if (isFinesse) useDex = dexMod > strMod;

                    const mod = useDex ? dexMod : strMod;

                    // Simple Proficiency check (Assumed proficient with class weapons)
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

            // Default fallback if still empty
            if (newData.attacks.length === 0) {
                newData.attacks.push({ name: 'Colpo Disarmato', bonus: `+${strMod + profBonus}`, damage: `1+${strMod}` });
            }
        }

        // 8. Spells (if empty and caster)
        if (newData.spells.length === 0) {
            let castStatMod = this.getModifier(newData.abilities.INT);
            if (["Chierico", "Druido", "Ranger", "Monaco"].includes(rClass.name)) castStatMod = this.getModifier(newData.abilities.WIS);
            if (["Bardo", "Paladino", "Stregone", "Warlock"].includes(rClass.name)) castStatMod = this.getModifier(newData.abilities.CHA);
            newData.spells = this.getSpells(rClass.name, level, castStatMod);
        }

        return newData;
    }
}
