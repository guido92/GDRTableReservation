import { PDFDocument, PDFTextField, PDFCheckBox, StandardFonts, PDFString, PDFName, PDFBool } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { CharacterData } from '@/types/dnd';
import { SPELLS } from '../data/spells';

export async function generateCharacterPDF(data: CharacterData): Promise<Uint8Array> {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'character-sheet-template.pdf');
    const pdfBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // REMOVED: NeedAppearances (Causes Auto-Size issues)
    // We will use updateFieldAppearances at the end instead.

    // --- HELPER FUNCTIONS ---

    // --- HELPER FUNCTIONS ---

    // Calculate Modifiers
    const getMod = (score: number) => Math.floor((score - 10) / 2);
    const fmtMod = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

    // Fuzzy Field Finder
    const findField = (name: string) => {
        const possibleNames = [name, `${name} `, `${name}  `];
        for (const n of possibleNames) {
            try {
                const f = form.getField(n);
                if (f) return f;
            } catch (e) { continue; }
        }
        return null;
    };

    const setField = (name: string, value: any, size: number = 10) => {
        try {
            const field = findField(name);
            if (field && field instanceof PDFTextField) {
                const valToSet = value === undefined || value === null ? '' : String(value);
                try {
                    field.setFontSize(size);
                    field.setText(valToSet);
                } catch (e) {
                    field.setText(valToSet);
                }
            }
        } catch (e) { console.warn(`Error setField ${name}:`, e); }
    };

    const setMultiLine = (name: string, value: any, size: number = 9) => {
        try {
            const field = findField(name);
            if (field && field instanceof PDFTextField) {
                const valToSet = value === undefined || value === null ? '' : String(value);
                try {
                    field.setFontSize(size);
                    field.setText(valToSet);
                } catch (e) {
                    field.setText(valToSet);
                }
            } else {
                console.warn(`Field ${name} not found for MultiLine`);
            }
        } catch (e) { console.warn(`Error setMultiLine ${name}:`, e); }
    };

    const setChecked = (name: string, checked: boolean) => {
        try {
            // Try explicit variations for Checkboxes which are messy
            const variations = [name, name.replace('Check Box', 'Check Box '), name.replace(' ', ''), name.replace('Box', 'Box ')];
            let box: PDFCheckBox | undefined;
            for (const v of variations) {
                try {
                    const f = form.getCheckBox(v);
                    if (f) { box = f; break; }
                } catch (e) { }
            }

            if (box) {
                if (checked) box.check();
                else box.uncheck();
            }
        } catch (e) { console.warn(`Error setChecked ${name}:`, e); }
    };

    // --- 1. BASIC INFO ---
    setField('CharacterName', data.characterName);
    setField('CharacterName 2', data.characterName);
    setField('ClassLevel', `${data.class} ${data.level}`);
    setField('Race', data.race);
    setField('Background', data.background);
    setField('Alignment', data.alignment);
    setField('PlayerName', data.playerName);
    setField('XP', (data.level || 1).toString());

    // --- 2. ABILITIES & MODS ---
    const stats: { [key: string]: number } = {
        STR: data.abilities.STR, DEX: data.abilities.DEX, CON: data.abilities.CON,
        INT: data.abilities.INT, WIS: data.abilities.WIS, CHA: data.abilities.CHA
    };
    const mods: { [key: string]: number } = {};

    Object.keys(stats).forEach(stat => {
        mods[stat] = getMod(stats[stat]);
        setField(stat, stats[stat].toString());
        setField(`${stat}mod`, fmtMod(mods[stat]));
    });
    // Specific quirks
    setField('DEXmod ', fmtMod(mods.DEX));
    setField('CHamod', fmtMod(mods.CHA));

    // --- 3. COMBAT STATS ---
    const profBonus = Math.ceil(data.level / 4) + 1;
    setField('ProfBonus', `+${profBonus}`);
    setField('AC', (data.armorClass || 10).toString());
    setField('Initiative', fmtMod(mods.DEX));
    setField('Speed', (data.speed || 30).toString());

    const hpMax = data.hp?.max || 1;
    const hpCurr = data.hp?.current || 1;
    setField('HPMax', hpMax.toString());
    setField('HPCurrent', hpCurr.toString());

    const hdTotal = data.hitDice?.total || data.level || 1;
    const hdDie = data.hitDice?.die || 'd8';
    setField('HDTotal', hdTotal.toString());
    setField('HD', hdDie);

    // Saving Throws
    setField('ST Strength', fmtMod(mods.STR));
    setField('ST Dexterity', fmtMod(mods.DEX));
    setField('ST Constitution', fmtMod(mods.CON));
    setField('ST Intelligence', fmtMod(mods.INT));
    setField('ST Wisdom', fmtMod(mods.WIS));
    setField('ST Charisma', fmtMod(mods.CHA));

    // --- 4. SKILLS & CHECKBOXES ---
    const skillMap: { [key: string]: { field: string, stat: number, box: string } } = {
        'Acrobazia': { field: 'Acrobatics', stat: mods.DEX, box: 'Check Box 23' },
        'Addestrare Animali': { field: 'Animal', stat: mods.WIS, box: 'Check Box 24' },
        'Arcano': { field: 'Arcana', stat: mods.INT, box: 'Check Box 25' },
        'Atletica': { field: 'Athletics', stat: mods.STR, box: 'Check Box 26' },
        'Inganno': { field: 'Deception ', stat: mods.CHA, box: 'Check Box 27' },
        'Storia': { field: 'History ', stat: mods.INT, box: 'Check Box 28' },
        'Intuizione': { field: 'Insight', stat: mods.WIS, box: 'Check Box 29' },
        'Intimidire': { field: 'Intimidation', stat: mods.CHA, box: 'Check Box 30' },
        'Indagare': { field: 'Investigation ', stat: mods.INT, box: 'Check Box 31' },
        'Medicina': { field: 'Medicine', stat: mods.WIS, box: 'Check Box 32' },
        'Natura': { field: 'Nature', stat: mods.INT, box: 'Check Box 33' },
        'Percezione': { field: 'Perception ', stat: mods.WIS, box: 'Check Box 34' },
        'Intrattenere': { field: 'Performance', stat: mods.CHA, box: 'Check Box 35' },
        'Persuasione': { field: 'Persuasion', stat: mods.CHA, box: 'Check Box 36' },
        'Religione': { field: 'Religion', stat: mods.INT, box: 'Check Box 37' },
        'Rapidità di Mano': { field: 'SleightofHand', stat: mods.DEX, box: 'Check Box 38' },
        'Furtività': { field: 'Stealth ', stat: mods.DEX, box: 'Check Box 39' },
        'Sopravvivenza': { field: 'Survival', stat: mods.WIS, box: 'Check Box 40' }
    };

    Object.entries(skillMap).forEach(([itName, config]) => {
        const isProficient = (data.skills || []).some(s => s.toLowerCase().includes(itName.toLowerCase()));
        const val = config.stat + (isProficient ? profBonus : 0);
        setField(config.field, fmtMod(val), 6); // Small font for skills
        if (isProficient) setChecked(config.box, true);
    });

    setField('Passive', String(10 + (mods.WIS || 0) + ((data.skills || []).some(s => s.includes('Percezione')) ? profBonus : 0)), 8);

    // --- 5. ATTACKS ---
    let attackCount = 1;
    const attackSummary: string[] = [];

    (data.attacks || []).forEach(atk => {
        attackSummary.push(`${atk.name}: ${atk.bonus} to hit, ${atk.damage} dmg`);

        if (attackCount > 3) return;
        if (attackCount === 1) {
            setField('Wpn Name', atk.name);
            setField('Wpn1 AtkBonus', atk.bonus);
            setField('Wpn1 Damage', atk.damage);
        } else if (attackCount === 2) {
            setField('Wpn Name 2', atk.name);
            setField('Wpn2 AtkBonus ', atk.bonus); // 1 space
            setField('Wpn2 Damage ', atk.damage); // 1 space
        } else if (attackCount === 3) {
            setField('Wpn Name 3', atk.name);
            setField('Wpn3 AtkBonus  ', atk.bonus); // 2 spaces verified
            setField('Wpn3 Damage ', atk.damage); // 1 space verified
        }
        attackCount++;
    });

    // Fallback: Populate the big text box
    if (attackSummary.length > 0) {
        setMultiLine('AttacksSpellcasting', attackSummary.join('\n'), 8);
    }

    // --- 6. FEATURES & TEXTS ---
    let featuresText = (data.features || []).map(f => `${f.name}: ${f.description}`).join('\n\n');
    setMultiLine('Features and Traits', featuresText, 10); // Standard readable size

    const profs = [];
    if (data.proficiencies?.armor?.length) profs.push(`Armature: ${data.proficiencies.armor.join(', ')}`);
    if (data.proficiencies?.weapons?.length) profs.push(`Armi: ${data.proficiencies.weapons.join(', ')}`);
    if (data.proficiencies?.tools?.length) profs.push(`Strumenti: ${data.proficiencies.tools.join(', ')}`);
    profs.push(`Linguaggi: ${(data.languages || []).join(', ')}`);

    // Skills are already checked, but a summary is nice.
    // profs.push(`Abilità: ${data.skills.join(', ')}`); 

    setMultiLine('ProficienciesLang', profs.join('\n\n'), 10); // Increased to 10
    setMultiLine('Equipment', (data.equipment || []).join('\n'), 10); // Increased to 10

    const p = data.personality || { traits: '', ideals: '', bonds: '', flaws: '', backstory: '' };
    setMultiLine('PersonalityTraits ', p.traits || '', 10);
    setMultiLine('Ideals', p.ideals || '', 10);
    setMultiLine('Bonds', p.bonds || '', 10);
    setMultiLine('Flaws', p.flaws || '', 10);

    // Page 2 - Reduced Font
    setMultiLine('Backstory', p.backstory || '', 11); // Good reading size
    setMultiLine('Allies', "Compagni di Avventura / Fazioni sconosciute", 11); // Consistent
    setMultiLine('Treasure', `10 Monete d'oro\nZaino\nSacco a pelo\nRazion da viaggio\n${(data.equipment || []).join('\n')}`, 10);

    setField('Age', "25");
    setField('Height', "1.80m");
    setField('Weight', "80kg");
    setField('Eyes', "Scuro");
    setField('Skin', "Chiaro");
    setField('Hair', "Scuro");

    // --- 7. MAGIC (PAGE 3) ---
    if (data.spells && data.spells.length > 0) {
        // Normalize Spell Levels (Fix AI hallucinations)
        data.spells.forEach(s => {
            const cleanName = s.name.split(' (')[0].trim();
            const dbSpell = SPELLS.find(d => d.name.toLowerCase() === cleanName.toLowerCase());
            if (dbSpell) {
                s.level = dbSpell.level;
            }
        });

        // Casting Stats
        setField('Spellcasting Class 2', data.class);
        let castStat = 'INT';
        const csl = data.class.toLowerCase();
        if (csl.includes('chierico') || csl.includes('druido') || csl.includes('ranger')) castStat = 'WIS';
        if (csl.includes('paladino') || csl.includes('stregone') || csl.includes('warlock') || csl.includes('bardo')) castStat = 'CHA';

        const castMod = mods[castStat];
        const saveDC = 8 + profBonus + (castMod || 0);
        const atkBonus = profBonus + castMod;

        setField('SpellcastingAbility 2', castStat);
        setField('SpellSaveDC  2', saveDC.toString());
        setField('SpellAtkBonus 2', fmtMod(atkBonus));

        // Spell Slots Calculation
        // Spell Slots Calculation (Advanced Multiclass Analysis)
        const getSlots = (fullClassStr: string) => {
            const finalSlots = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

            // Parse classes: "Paladino 13 / Warlock 2"
            // Regex to find "Name Level" pairs
            const matches = [...fullClassStr.matchAll(/([a-zA-Z\u00C0-\u00FF]+)\s*(\d+)/g)];

            let effectiveCasterLevel = 0;
            let warlockSlots = 0;
            let warlockSlotLevel = 0;

            if (matches.length === 0) {
                // Fallback if no digits found, assume single class = data.level
                const csl = fullClassStr.toLowerCase();
                // ... reuse old logic or just assume 1 class
                // But since we have data.level passed in main function, we can use that if single class.
                // Let's assume regex failed, try treating whole string as one class at data.level
                // Fallback: Mock a RegExpExecArray-like object
                const mockMatch = [fullClassStr, fullClassStr, String(data.level)];
                // @ts-ignore
                matches.push(mockMatch);
            }

            matches.forEach(m => {
                const className = m[1].toLowerCase();
                const lvl = parseInt(m[2]);

                if (className.includes('warlock')) {
                    // Pact Magic (Independent)
                    // Determine slot level and count based on Warlock Table
                    // LVL 1: 1@1st, LVL 2: 2@1st, LVL 3: 2@2nd...
                    // Simplified Warlock Logic
                    const wSlotLvl = Math.ceil(lvl / 2); // Roughly caps at 5th
                    const cappedLvl = wSlotLvl > 5 ? 5 : wSlotLvl;

                    let count = 0;
                    if (lvl === 1) count = 1;
                    else if (lvl >= 2 && lvl <= 10) count = 2;
                    else if (lvl >= 11 && lvl <= 16) count = 3;
                    else if (lvl >= 17) count = 4;

                    // Add to final slots directly? Usually Warlocks are separate.
                    // But Character Sheets often just sum them or put them together.
                    // We will ADD them to the corresponding slot level.
                    // @ts-ignore
                    finalSlots[cappedLvl] += count;

                } else if (className.includes('paladin') || className.includes('ranger') || className.includes('artificer')) { // Artificer is 1/2 rounded up actually, Paladin is 1/2 rounded down? No, Paladin starts at 2.
                    // Paladin: Level / 2 (floor)
                    // Ranger: Level / 2 (floor)
                    // Artificer: Level / 2 (ceil) - treat as half for now
                    effectiveCasterLevel += Math.floor(lvl / 2);
                } else if (className.includes('fighter') && (className.includes('eldritch') || className.includes('cavaliere'))) { // Arcane Trickster too
                    effectiveCasterLevel += Math.floor(lvl / 3);
                } else if (className.includes('rogue') && (className.includes('arcane') || className.includes('mistificatore'))) {
                    effectiveCasterLevel += Math.floor(lvl / 3);
                } else if (['bard', 'bardo', 'cleric', 'chierico', 'druid', 'druido', 'sorcerer', 'stregone', 'wizard', 'mago'].some(k => className.includes(k))) {
                    effectiveCasterLevel += lvl;
                }
            });

            // Calculate slots for effectiveCasterLevel (Standard Table)
            // ... (Use the fullSlots array from before)
            const fullSlots = [
                [2, 0, 0, 0, 0, 0, 0, 0, 0], // Lv 1
                [3, 0, 0, 0, 0, 0, 0, 0, 0], // Lv 2
                [4, 2, 0, 0, 0, 0, 0, 0, 0], // Lv 3
                [4, 3, 0, 0, 0, 0, 0, 0, 0], // Lv 4
                [4, 3, 2, 0, 0, 0, 0, 0, 0], // Lv 5
                [4, 3, 3, 0, 0, 0, 0, 0, 0], // Lv 6
                [4, 3, 3, 1, 0, 0, 0, 0, 0], // Lv 7
                [4, 3, 3, 2, 0, 0, 0, 0, 0], // Lv 8
                [4, 3, 3, 3, 1, 0, 0, 0, 0], // Lv 9
                [4, 3, 3, 3, 2, 0, 0, 0, 0], // Lv 10
                [4, 3, 3, 3, 2, 1, 0, 0, 0], // Lv 11
                [4, 3, 3, 3, 2, 1, 0, 0, 0], // Lv 12
                [4, 3, 3, 3, 2, 1, 1, 0, 0], // Lv 13
                [4, 3, 3, 3, 2, 1, 1, 0, 0], // Lv 14
                [4, 3, 3, 3, 2, 1, 1, 1, 0], // Lv 15
                [4, 3, 3, 3, 2, 1, 1, 1, 0], // Lv 16
                [4, 3, 3, 3, 2, 1, 1, 1, 1], // Lv 17
                [4, 3, 3, 3, 3, 1, 1, 1, 1], // Lv 18
                [4, 3, 3, 3, 3, 2, 1, 1, 1], // Lv 19
                [4, 3, 3, 3, 3, 2, 2, 1, 1], // Lv 20
            ];

            if (effectiveCasterLevel > 0) {
                if (effectiveCasterLevel > 20) effectiveCasterLevel = 20;
                const s = fullSlots[effectiveCasterLevel - 1];
                for (let i = 1; i <= 9; i++) {
                    // @ts-ignore
                    finalSlots[i] += (s[i - 1] || 0);
                }
            }

            return finalSlots;
        };

        const slots = getSlots(`${data.class} ${data.level}`); // Pass the combined string for regex logic

        // Map Level to Slot Field ID (SlotsTotal X)
        const slotFieldIds: { [key: number]: number } = {
            1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 9: 27
        };

        Object.entries(slotFieldIds).forEach(([lvlStr, fieldId]) => {
            const lvl = parseInt(lvlStr);
            // @ts-ignore
            const count = slots[lvl] || 0;
            if (count > 0) {
                setField(`SlotsTotal ${fieldId}`, count.toString(), 10); // Forced 10
                setField(`SlotsRemaining ${fieldId}`, count.toString(), 10); // Forced 10
            }
        });

        // Spell Mapping - Fuzzy Find
        // Spell Mapping - Fuzzy Find
        const spellStartIds: { [key: number]: number } = {
            0: 1014, 1: 1023, 2: 1034, 3: 1047, 4: 1060,
            5: 1073, 6: 1082, 7: 1089, 8: 1096, 9: 1103
        };

        const allFields = form.getFields(); // Cache all fields for fuzzy search

        for (let lvl = 0; lvl <= 9; lvl++) {
            const lvlSpells = (data.spells || []).filter(s => s.level === lvl);
            const startId = spellStartIds[lvl];
            if (!startId) continue;

            lvlSpells.forEach((spell, idx) => {
                if (idx > 12) return;
                const targetIdStr = (startId + idx).toString();
                // Find field that starts with "Spells <TargetID>"
                // We look for exact "Spells 1014" or "Spells 1014..."
                const field = allFields.find(f => {
                    const n = f.getName();
                    return n === `Spells ${targetIdStr}` || n.startsWith(`Spells ${targetIdStr}`);
                });

                if (field && field instanceof PDFTextField) {
                    try {
                        field.setFontSize(9);
                        field.setText(spell.name);
                    } catch (e) {
                        field.acroField.setValue(PDFString.of(spell.name));
                        // field.updateAppearances(font); // Done globally at end
                    }
                }
            });
        }
    }

    // --- SAVING THROWS (Inferred) ---
    // Extract base class from "Paladin 13 / Warlock 2" -> "Paladin"
    // Handle Italian "Paladino" or English "Paladin"
    const baseClass = data.class.split(/[\s/0-9]/)[0].trim();

    // We will Map Class -> Saves.
    const classSaves: { [key: string]: string[] } = {
        'Barbaro': ['STR', 'CON'], 'Bardo': ['DEX', 'CHA'], 'Chierico': ['WIS', 'CHA'],
        'Druido': ['INT', 'WIS'], 'Guerriero': ['STR', 'CON'], 'Monaco': ['STR', 'DEX'],
        'Paladino': ['WIS', 'CHA'], 'Ranger': ['STR', 'DEX'], 'Ladro': ['DEX', 'INT'],
        'Stregone': ['CON', 'CHA'], 'Mago': ['INT', 'WIS'], 'Warlock': ['WIS', 'CHA'],
        // English fallbacks
        'Barbarian': ['STR', 'CON'], 'Bard': ['DEX', 'CHA'], 'Cleric': ['WIS', 'CHA'],
        'Druid': ['INT', 'WIS'], 'Fighter': ['STR', 'CON'], 'Monk': ['STR', 'DEX'],
        'Paladin': ['WIS', 'CHA'], 'Rogue': ['DEX', 'INT'], 'Sorcerer': ['CON', 'CHA'],
        'Wizard': ['INT', 'WIS']
    };

    const mySaves = classSaves[baseClass] || classSaves[Object.keys(classSaves).find(k => baseClass.includes(k)) || ''] || [];

    // Attempt standard checkboxes 11, 18, 19, 20, 21, 22 (WotC standard)
    const saveBoxMap: { [key: string]: string } = {
        'STR': 'Check Box 11', 'DEX': 'Check Box 18', 'CON': 'Check Box 19',
        'INT': 'Check Box 20', 'WIS': 'Check Box 21', 'CHA': 'Check Box 22'
    };

    mySaves.forEach(stat => {
        setChecked(saveBoxMap[stat], true);
        // Also try sequential logic if standard fails (double tap for variants)
        const seqMap: { [key: string]: string } = {
            'STR': 'Check Box 11', 'DEX': 'Check Box 12', 'CON': 'Check Box 13',
            'INT': 'Check Box 14', 'WIS': 'Check Box 15', 'CHA': 'Check Box 16'
        };
        setChecked(seqMap[stat], true);
    });

    try {
        form.updateFieldAppearances(font);
    } catch (e) { console.warn("Could not update field appearances", e); }

    return await pdfDoc.save();
}
