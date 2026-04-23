
import { FiveToolsService } from '../src/services/five-tools-service';
import { UnifiedDataService } from '../src/services/unified-data-service';
import * as path from 'path';

async function runAudit() {
    console.log("=== CHARACTER SYSTEM COMPREHENSIVE AUDIT ===");
    
    const uds = UnifiedDataService.getInstance();
    const fts = FiveToolsService.getInstance();
    
    // 1. Initialize
    console.log("Initializing services...");
    await fts.initialize();
    
    // 2. Class Audit
    console.log("\n--- CLASSES ---");
    const sourcesToTest = [
        { name: "2014 Core", sources: ["PHB"] },
        { name: "2024 Core", sources: ["PHB24"] }, // PHB24 maps to XPHB
        { name: "Full 2014 Set", sources: ["PHB", "XGE", "TCE"] },
        { name: "Full 2024 Set", sources: ["PHB24", "XGE", "TCE"] }
    ];
    
    for (const test of sourcesToTest) {
        const classes = await uds.getClasses(test.sources);
        console.log(`[${test.name}]: ${classes.length} classes found.`);
        if (classes.length < 12 && test.name.includes("Core")) {
            console.error(`  ❌ ERROR: Core classes missing! Found: ${classes.map(c => c.name).join(', ')}`);
        } else {
            console.log(`  ✅ OK: ${classes.slice(0, 5).map(c => c.name).join(', ')}...`);
        }
    }

    // 3. Race Audit
    console.log("\n--- RACES ---");
    const races = await uds.getRaces(["PHB", "XPHB", "MPMM"]);
    console.log(`Total Unified Races: ${races.length}`);
    if (races.length === 0) console.error("  ❌ ERROR: No races found!");
    else console.log(`  ✅ OK: ${races.slice(0, 5).map(r => r.name).join(', ')}...`);

    // 4. Background Audit
    console.log("\n--- BACKGROUNDS ---");
    const backgrounds = await uds.getBackgrounds(["PHB", "XPHB", "XGE", "TCE"]);
    console.log(`Total Unified Backgrounds: ${backgrounds.length}`);
    if (backgrounds.length === 0) console.error("  ❌ ERROR: No backgrounds found!");
    else console.log(`  ✅ OK: ${backgrounds.slice(0, 5).map(b => b.name).join(', ')}...`);

    // 5. Spell Audit
    console.log("\n--- SPELLS ---");
    const wizardSpellsLvl1 = fts.getSpells("Wizard", 1, ["PHB", "XPHB"]);
    console.log(`Wizard Level 1 Spells (2014+2024): ${wizardSpellsLvl1.length}`);
    if (wizardSpellsLvl1.length === 0) console.error("  ❌ ERROR: No spells found for Wizard!");
    else console.log(`  ✅ OK.`);

    // 6. Translation Check
    console.log("\n--- TRANSLATIONS ---");
    const testClass = "Fighter";
    const { translateClass } = require('../src/utils/translations');
    console.log(`'Fighter' -> '${translateClass(testClass)}'`);
    if (translateClass(testClass) === testClass) console.warn("  ⚠️  Translation might be failing or missing for 'Fighter'");
    else console.log("  ✅ Translation working.");

    console.log("\n=== AUDIT COMPLETE ===");
}

runAudit().catch(console.error);
