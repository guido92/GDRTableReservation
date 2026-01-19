
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { CharacterLogic } from '../src/lib/character-logic';
import { generateCharacterPDF } from '../src/lib/pdf-generator';

// Mock Level 20 Character Data
const lvl20Artificer = {
    class: "Artefice",
    level: 20,
    race: "Gnomo",
    background: "Artigiano di Gilda",
    name: "Gimble",
    stats: { strength: 10, dexterity: 14, constitution: 16, intelligence: 20, wisdom: 12, charisma: 10 },
    hp: 163,
    ac: 18,
    // Features should be auto-populated by PDFGenerator/CharacterLogic if we pass the right data
    // But usually the AI does it. Here we test if WE can make it.
};

async function test() {
    try {
        console.log("Generating Level 20 Artificer PDF...");
        // create a minimal 'AI' response structure
        const data: any = {
            ...lvl20Artificer,
            features: [
                { name: "Anima dell'Artificio", level: 20, source: "TCE", description: "+1 SV per attuned item." },
                { name: "Incantesimi", level: 1, source: "TCE", description: "Cast spells." }
            ],
            spells: [
                { name: "Dardo di Fuoco", level: 0 },
                { name: "Cura Ferite", level: 1 }
            ]
        };

        const buffer = await generateCharacterPDF(data);
        fs.writeFileSync(path.join(__dirname, '../lvl20_artificer_test.pdf'), buffer);
        console.log("✅ Level 20 PDF Generated Successfully: lvl20_artificer_test.pdf");
    } catch (e) {
        console.error("❌ Generation Failed:", e);
        process.exit(1);
    }
}

test();
