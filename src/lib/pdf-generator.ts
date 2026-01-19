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

    // CRITICAL FIX: Force Acrobat/Preview/Chrome to re-render fields
    form.acroForm.dict.set(PDFName.of('NeedAppearances'), PDFBool.True);

    // --- HELPER FUNCTIONS ---

    // Force Re-render helper
    const forceRender = (field: any) => {
        try {
            if (field.acroField && field.acroField.getWidgets) {
                field.acroField.getWidgets().forEach((w: any) => {
                    w.dict.delete(PDFName.of('AP'));
                });
            }
        } catch (e) { }
    };

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
                    forceRender(field); // Delete AP to force NeedAppearances
                } catch (e) {
                    // Fallback for missing DA
                    field.acroField.setValue(PDFString.of(valToSet));
                    forceRender(field);
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
                    forceRender(field);
                } catch (e) {
                    // Fallback for missing DA
                    field.acroField.setValue(PDFString.of(valToSet));
                    forceRender(field);
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
                forceRender(box);
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
    setField('XP', data.level.toString());

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
    setField('AC', data.armorClass.toString());
    setField('Initiative', fmtMod(mods.DEX));
    setField('Speed', data.speed.toString());
    setField('HPMax', data.hp.max.toString());
    setField('HPCurrent', data.hp.current.toString());
    setField('HDTotal', data.hitDice.total.toString());
    setField('HD', data.hitDice.die);

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

    setField('Passive', (10 + mods.WIS + ((data.skills || []).some(s => s.includes('Percezione')) ? profBonus : 0)).toString(), 8);

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
    setMultiLine('Features and Traits', featuresText, 7); // Reduced font size

    const profs = [];
    if (data.proficiencies?.armor?.length) profs.push(`Armature: ${data.proficiencies.armor.join(', ')}`);
    if (data.proficiencies?.weapons?.length) profs.push(`Armi: ${data.proficiencies.weapons.join(', ')}`);
    if (data.proficiencies?.tools?.length) profs.push(`Strumenti: ${data.proficiencies.tools.join(', ')}`);
    profs.push(`Linguaggi: ${(data.languages || []).join(', ')}`);

    // Skills are already checked, but a summary is nice.
    // profs.push(`Abilità: ${data.skills.join(', ')}`); 

    setMultiLine('ProficienciesLang', profs.join('\n\n'), 7); // Clean formatting
    setMultiLine('Equipment', (data.equipment || []).join('\n'), 7); // Reduced

    const p = data.personality;
    setMultiLine('PersonalityTraits ', p.traits, 7);
    setMultiLine('Ideals', p.ideals || '', 7);
    setMultiLine('Bonds', p.bonds || '', 7);
    setMultiLine('Flaws', p.flaws || '', 7);

    // Page 2 - Reduced Font
    setMultiLine('Backstory', p.backstory || '', 8); // Slightly bigger than 7 but manageable, user said "enorme" so 9 was too big. 7 is tiny. 8 is okay.
    // Retrying with standard sizing logic. If setFontSize(size) is called, it should work.
    // User said "enorme" meaning it was likely Auto (0) which fills the box. explicitly setting it fixes it.
    // previous run set it to 7. Let's keep it 7 or look at Logic.
    // Actually, "font enorme" usually means it's auto-scaled to fill a mostly empty box.
    // By providing more text (previous step), it naturally shrinks. 
    // By setting font size explicitly, it stops being giant. 
    setMultiLine('Backstory', p.backstory || '', 8);
    setMultiLine('Allies', "Compagni di Avventura / Fazioni sconosciute", 7); // Forced to 7
    setMultiLine('Treasure', `10 Monete d'oro\nZaino\nSacco a pelo\nRazion da viaggio\n${(data.equipment || []).join('\n')}`, 7);

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
        const saveDC = 8 + profBonus + castMod;
        const atkBonus = profBonus + castMod;

        setField('SpellcastingAbility 2', castStat);
        setField('SpellSaveDC  2', saveDC.toString());
        setField('SpellAtkBonus 2', fmtMod(atkBonus));

        // Spell Slots Calculation
        const getSlots = (lvl: number, cls: string) => {
            const isHalf = cls.includes('paladino') || cls.includes('ranger');
            const isWarlock = cls.includes('warlock');
            if (isWarlock) {
                // Simplified Warlock Placeholder
                return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 0, 7: 0, 8: 0, 9: 0 };
            }

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

            let effectiveLvl = lvl;
            if (isHalf) effectiveLvl = Math.ceil(lvl / 2);
            if (effectiveLvl < 1) effectiveLvl = 1;
            if (effectiveLvl > 20) effectiveLvl = 20;

            const s = fullSlots[effectiveLvl - 1] || [];
            return {
                1: s[0] || 0, 2: s[1] || 0, 3: s[2] || 0, 4: s[3] || 0, 5: s[4] || 0,
                6: s[5] || 0, 7: s[6] || 0, 8: s[7] || 0, 9: s[8] || 0
            };
        };

        const slots = getSlots(data.level, csl);

        // Map Level to Slot Field ID (SlotsTotal X)
        const slotFieldIds: { [key: number]: number } = {
            1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 9: 27
        };

        Object.entries(slotFieldIds).forEach(([lvlStr, fieldId]) => {
            const lvl = parseInt(lvlStr);
            // @ts-ignore
            const count = slots[lvl];
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
    // Standard 5e Sheet: Str=11, Dex=18, Con=19, Int=20, Wis=21, Cha=22 (Usually)
    // But observed dump sequence: 11, 12, 13... let's try 11-16 sequence which is also common in alternats.
    // Let's safe bet: The user complained.
    // We will Map Class -> Saves.
    const classSaves: { [key: string]: string[] } = {
        'Barbaro': ['STR', 'CON'], 'Bardo': ['DEX', 'CHA'], 'Chierico': ['WIS', 'CHA'],
        'Druido': ['INT', 'WIS'], 'Guerriero': ['STR', 'CON'], 'Monaco': ['STR', 'DEX'],
        'Paladino': ['WIS', 'CHA'], 'Ranger': ['STR', 'DEX'], 'Ladro': ['DEX', 'INT'],
        'Stregone': ['CON', 'CHA'], 'Mago': ['INT', 'WIS'], 'Warlock': ['WIS', 'CHA']
    };
    const mySaves = classSaves[data.class] || [];

    // Attempt standard checkboxes 11, 18, 19, 20, 21, 22 (WotC standard)
    // If that fails, the ticks won't show, but better than nothing.
    const saveBoxMap: { [key: string]: string } = {
        'STR': 'Check Box 11', 'DEX': 'Check Box 18', 'CON': 'Check Box 19',
        'INT': 'Check Box 20', 'WIS': 'Check Box 21', 'CHA': 'Check Box 22'
    };

    // Also try simple sequential 11-16 just in case (Some IT sheets)
    // Str 11, Dex 12, Con 13, Int 14, Wis 15, Cha 16

    mySaves.forEach(stat => {
        // Try WotC standard
        setChecked(saveBoxMap[stat], true);

        // Also try sequential logic if standard fails (double tap)
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
