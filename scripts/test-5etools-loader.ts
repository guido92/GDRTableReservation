import { FiveToolsService } from '../src/services/five-tools-service';
import path from 'path';

async function test() {
    console.log("Testing FiveToolsService...");
    const fts = FiveToolsService.getInstance();

    // 1. Initialize
    console.time("Initialization");
    await fts.initialize();
    console.timeEnd("Initialization");

    // 2. Test Spells
    console.log("--- Testing Spells ---");
    const fireball = fts.getSpellByName("Fireball"); // English
    const palla = fts.getSpellByName("Palla di Fuoco"); // Italian (if mapped? No, I don't implement translation yet, only English lookup from 5etools)
    // Wait, the prompting logic asks for Italian names, but the 5etools data is English (unless the user cloned a translation repo? The repo is 5etools-2014-src, usually English).
    // If the repo is English, and I ask for Italian, it won't find it unless I have a translation layer.
    // The internal `spells.ts` had Italian names.
    // My `FiveToolsService` loads 5etools JSONs.
    // If the JSONs are English, I need to check if I broke the Italian support.

    // The prompt says: "Se la classe usa magia, DEVI compilare l'array 'spells' con nomi ITALIANI validi per il livello."
    // If the AI generates Italian names, my `getSpellByName` needs to handle them.
    // Currently `FiveToolsService` loads the raw JSON.
    // If the JSON is English, looking up "Palla di Fuoco" will fail.

    // I NEED TO CHECK if the Repo I cloned is English or Italian. 
    // The repo URL `https://github.com/5etools-mirror-3/5etools-2014-src.git` suggests generic 5etools (English).

    // If so, I have a problem: The AI is forced to output Italian, but my validator checks against English DB.
    // I might need to rely on the internal `spells.ts` for translation map or fallback?
    // OR I update the prompt to output English names or provide the English name in brackets?
    // OR Use the `translations.ts` file I saw earlier! 

    // Let's check `src/data/translations.ts`.

    console.log("Fireball found:", !!fireball);
    if (fireball) console.log("Fireball Level:", fireball.level);

    // 3. Test Items
    console.log("--- Testing Items ---");
    const plate = fts.getItemByName("Plate Armor");
    const fullPlate = fts.getItemByName("Armatura Completa"); // Italian?
    console.log("Plate Armor found:", !!plate);
    if (plate) console.log("Plate AC:", plate.ac);

}

test().catch(console.error);
