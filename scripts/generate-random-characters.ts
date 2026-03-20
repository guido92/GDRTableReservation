
import { CharacterLogic } from '../src/lib/character-logic';
import { FiveToolsService } from '../src/services/five-tools-service';
import { generateCharacterPDF } from '../src/lib/pdf-generator';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'generation_iterations.md');
const OUT_DIR = path.join(process.cwd(), 'output', 'characters');

function logIteration(content: string) {
    fs.appendFileSync(LOG_FILE, content + '\n');
    console.log(content);
}

async function main() {
    logIteration(`# Random Character Generation & PDF Log - ${new Date().toISOString()}`);
    logIteration(`Target: 5 Valid Characters with PDFs`);

    // Ensure output dir
    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    // Initialize Services
    try {
        await FiveToolsService.getInstance().initialize();
    } catch (e) {
        logIteration(`⚠️ Failed to initialize FiveToolsService: ${e}`);
    }

    const TARGET_SUCCESS = 5;
    let successCount = 0;
    let attemptCount = 0;

    while (successCount < TARGET_SUCCESS) {
        attemptCount++;
        const level = Math.floor(Math.random() * 20) + 1;
        const sources: string[] = ["PHB", "TCE", "XGE"];

        logIteration(`\n## Attempt #${attemptCount} (Targetting Level ${level})`);

        try {
            const start = Date.now();
            const char = await CharacterLogic.generateQuickCharacter(level, sources);
            const duration = Date.now() - start;

            logIteration(`Generated: ${char.level} ${char.race} ${char.class} (${char.subclass || 'No Subclass'}) in ${duration}ms`);

            // VALIDATION
            const checks: { name: string, valid: boolean, msg?: string }[] = [];

            // 1. Basic Info
            checks.push({ name: "Has Basic Info", valid: !!char.race && !!char.class && !!char.background });

            // 2. Stats
            checks.push({ name: "Valid Stats", valid: Object.values(char.abilities).every(v => v >= 3 && v <= 20) });

            // 3. Derived Stats
            checks.push({ name: "HP > 0", valid: char.hp.current > 0, msg: `HP: ${char.hp.current}` });
            checks.push({ name: "AC Valid", valid: char.armorClass >= 10, msg: `AC: ${char.armorClass}` });

            // 4. Equipment & Attacks
            checks.push({ name: "Has Equipment", valid: char.equipment.length > 0 });
            checks.push({ name: "Has Attacks", valid: char.attacks.length > 0 });

            // 5. Spells
            const casters = ['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone', 'Warlock', 'Artefice'];
            const halfCasters = ['Paladino', 'Ranger'];
            const isCaster = casters.includes(char.class) || (halfCasters.includes(char.class) && level >= 2);

            if (isCaster) {
                checks.push({ name: "Has Spells", valid: char.spells.length > 0, msg: `Count: ${char.spells.length}` });
            }

            // 6. Speed Validation (Regression Test)
            let expectedSpeed = 30; // Default
            if (['Gnomo', 'Halfling', 'Nano'].some(r => char.race.includes(r))) expectedSpeed = 25;
            if (char.race.includes('Elfo dei Boschi')) expectedSpeed = 35;

            // Simple check for Monk/Barbarian bonuses (just checks if >= base)
            if (char.class === 'Monaco' && char.level >= 2) expectedSpeed += 10; // Min bonus
            if (char.class === 'Barbaro' && char.level >= 5) expectedSpeed += 10;

            // Allow for some wiggle room if complex logic (like armor) isn't fully replicated here, 
            // but for small races it MUST be 25 base.
            const minSpeed = expectedSpeed;
            checks.push({
                name: "Valid Speed",
                valid: char.speed >= minSpeed,
                msg: `Speed: ${char.speed} (Expected >= ${minSpeed})`
            });

            const failedChecks = checks.filter(c => !c.valid);

            if (failedChecks.length === 0) {
                // PDF GENERATION STEP
                try {
                    const pdfStart = Date.now();
                    const pdfBytes = await generateCharacterPDF(char);
                    const pdfDuration = Date.now() - pdfStart;

                    if (pdfBytes.length > 0) {
                        const fileNameBase = `char_${successCount + 1}_${char.class}_lvl${char.level}`;
                        const jsonPath = path.join(OUT_DIR, `${fileNameBase}.json`);
                        const pdfPath = path.join(OUT_DIR, `${fileNameBase}.pdf`);

                        fs.writeFileSync(jsonPath, JSON.stringify(char, null, 2));
                        fs.writeFileSync(pdfPath, pdfBytes);

                        logIteration(`✅ VALIDATED & PDF GENERATED (${pdfBytes.length} bytes in ${pdfDuration}ms) - Success ${successCount + 1}/${TARGET_SUCCESS}`);
                        logIteration(`Saved to ${fileNameBase}.json/.pdf`);
                        successCount++;
                    } else {
                        logIteration(`❌ PDF GENERATION FAILED: Empty output`);
                    }
                } catch (pdfErr) {
                    logIteration(`❌ PDF GENERATION ERROR: ${pdfErr}`);
                    if (pdfErr instanceof Error) logIteration(pdfErr.stack || '');
                }

            } else {
                logIteration(`❌ FAILED VALIDATION:`);
                failedChecks.forEach(c => logIteration(`   - ${c.name}: ${c.msg || 'Invalid'}`));
            }

        } catch (err: any) {
            logIteration(`🔥 CRITICAL ERROR: ${err.message}`);
            if (err.stack) console.error(err.stack);
        }
    }

    logIteration(`\n\n=== COMPLETED ===`);
    logIteration(`Attempts: ${attemptCount}`);
    logIteration(`Successes: ${successCount}`);
}

main();
