import { CharacterData } from '@/types/dnd';
import { CLASSES, RACES } from '@/data/dnd-data';

export class DataFixer {
    static fix(data: CharacterData, issues: string[]): { fixedData: CharacterData, patches: string[] } {
        const patches: string[] = [];
        const fixed = { ...data };

        // 1. Fix HP if missing or 0
        if (!fixed.hp || fixed.hp.max <= 0) {
            patches.push("Fixing HP: Calculated Standard Average");

            // Extract base class name (handle "Paladino 13", "Paladino (Vendetta)", "Paladino 13 / Warlock 2")
            // Regex: Take first word consisting of letters
            // \u00C0-\u00FF covers accents like 'à', 'è', 'ò' etc.
            const clsName = fixed.class.split(/[^a-zA-Z\u00C0-\u00FF]+/)[0];
            console.log(`DataFixer: Extracted Base Class '${clsName}' from '${fixed.class}'`);

            // Case insensitive match
            const cls = CLASSES.find(c => c.name.toLowerCase() === clsName.toLowerCase());

            if (!cls) {
                console.warn(`DataFixer: Class '${clsName}' not found in database. Defaulting to d8.`);
            }

            const hd = cls?.hitDie || 8;
            const con = Math.floor((fixed.abilities.CON - 10) / 2);
            const lvl = fixed.level || 1;

            // Standard Average: Max at 1, Avg at others
            const max = hd + con;
            const avg = Math.floor(hd / 2) + 1 + con;
            const total = max + ((lvl - 1) * avg);

            fixed.hp = { current: total, max: total, temp: 0 };
        }

        // 2. Fix Name if missing
        if (!fixed.characterName) {
            patches.push("Fixing Name: Set to 'Eroe Senza Nome'");
            fixed.characterName = "Eroe Senza Nome";
        }

        // 3. Fix AC if missing or low (assuming unarmored)
        if (!fixed.armorClass || fixed.armorClass < 5) {
            const dex = Math.floor((fixed.abilities.DEX - 10) / 2);
            // Basic 10+Dex
            fixed.armorClass = 10 + dex;
            patches.push("Fixing AC: Recalculated 10 + DEX");
        }

        // 4. Ensure Alignment
        if (!fixed.alignment) {
            fixed.alignment = "Neutrale";
            patches.push("Fixing Alignment: Set to Neutrale");
        }

        return { fixedData: fixed, patches };
    }
}
