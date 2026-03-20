/**
 * Test Script for Character Generation
 *
 * Tests the character generation logic for various classes and levels.
 * Run with: npx ts-node scripts/test-character-generation.ts
 */

import { CharacterLogic } from '../src/lib/character-logic';
import { PDFValidator } from '../src/lib/pdf-validator';
import { FiveToolsService } from '../src/services/five-tools-service';

// Test configuration
const TEST_CLASSES = [
    'Barbaro', 'Bardo', 'Chierico', 'Druido', 'Guerriero',
    'Ladro', 'Mago', 'Monaco', 'Paladino', 'Ranger',
    'Stregone', 'Warlock'
];

const TEST_LEVELS = [1, 5, 10, 15, 20];
const SOURCES = ['PHB', 'XGE', 'TCE'];

// Expected HP ranges by class/level
const HIT_DIE: Record<string, number> = {
    'Barbaro': 12, 'Guerriero': 10, 'Paladino': 10, 'Ranger': 10,
    'Chierico': 8, 'Druido': 8, 'Monaco': 8, 'Ladro': 8, 'Bardo': 8, 'Warlock': 8,
    'Mago': 6, 'Stregone': 6
};

// Expected cantrip counts by class
const CANTRIP_CLASSES = ['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone', 'Warlock'];

// Non-caster classes
const NON_CASTERS = ['Barbaro', 'Guerriero', 'Ladro', 'Monaco'];

interface TestResult {
    class: string;
    level: number;
    passed: boolean;
    issues: string[];
    warnings: string[];
    character?: any;
}

async function testCharacter(className: string, level: number): Promise<TestResult> {
    const result: TestResult = {
        class: className,
        level,
        passed: true,
        issues: [],
        warnings: []
    };

    try {
        // Generate character
        const character = await CharacterLogic.generateQuickCharacter(level, SOURCES, { class: className });
        result.character = character;

        // ═══════════════════════════════════════════════════
        // VALIDATION CHECKS
        // ═══════════════════════════════════════════════════

        // 1. HP Validation
        const hitDie = HIT_DIE[className] || 8;
        const avgRoll = Math.floor(hitDie / 2) + 1;
        const conMod = Math.floor((character.abilities?.CON || 10) - 10) / 2;

        const minHP = hitDie + (level - 1) * avgRoll + Math.floor(conMod) * level;
        const maxHP = hitDie * level + Math.ceil(conMod + 2) * level;

        if (!character.hp || character.hp.max <= 0) {
            result.issues.push(`HP is 0 or missing`);
            result.passed = false;
        } else if (character.hp.max < minHP * 0.7 || character.hp.max > maxHP * 1.3) {
            result.warnings.push(`HP ${character.hp.max} outside expected range (${minHP}-${maxHP})`);
        }

        // 2. Spell Validation
        if (NON_CASTERS.includes(className)) {
            const leveledSpells = (character.spells || []).filter((s: any) => s.level > 0);
            if (leveledSpells.length > 0) {
                result.issues.push(`Non-caster ${className} has ${leveledSpells.length} leveled spells`);
                result.passed = false;
            }
        } else if (CANTRIP_CLASSES.includes(className)) {
            const cantrips = (character.spells || []).filter((s: any) => s.level === 0);
            if (cantrips.length === 0) {
                result.warnings.push(`Caster ${className} has no cantrips`);
            }
        }

        // 3. Hit Dice Validation
        if (!character.hitDice || character.hitDice.total !== level) {
            result.issues.push(`Hit dice total ${character.hitDice?.total} doesn't match level ${level}`);
            result.passed = false;
        }

        const expectedDie = `d${hitDie}`;
        if (character.hitDice?.die !== expectedDie) {
            result.warnings.push(`Hit die ${character.hitDice?.die} expected ${expectedDie}`);
        }

        // 4. AC Validation
        if (!character.armorClass || character.armorClass < 8 || character.armorClass > 25) {
            result.warnings.push(`AC ${character.armorClass} seems unusual`);
        }

        // 5. Ability Scores Validation
        if (character.abilities) {
            const stats = Object.values(character.abilities) as number[];
            const hasInvalid = stats.some(s => s < 3 || s > 20);
            if (hasInvalid) {
                result.issues.push(`Ability scores outside valid range (3-20)`);
                result.passed = false;
            }

            const total = stats.reduce((a, b) => a + b, 0);
            if (total < 60 || total > 90) {
                result.warnings.push(`Ability total ${total} unusual (expected 60-90)`);
            }
        }

        // 6. Skills Validation
        const expectedSkillCount = className === 'Ladro' ? 4 : className === 'Bardo' || className === 'Ranger' ? 3 : 2;
        const maxSkills = expectedSkillCount + 4; // +background +racial
        if ((character.skills || []).length > maxSkills) {
            result.warnings.push(`${character.skills.length} skills (expected max ${maxSkills})`);
        }

        // 7. Level Validation
        if (character.level !== level) {
            result.issues.push(`Character level ${character.level} doesn't match requested ${level}`);
            result.passed = false;
        }

        // 8. Class Validation
        if (!character.class.includes(className)) {
            result.issues.push(`Character class ${character.class} doesn't match requested ${className}`);
            result.passed = false;
        }

        // Run PDF Validator as well
        const validation = PDFValidator.validateData(character);
        if (!validation.success) {
            result.issues.push(...validation.issues);
            result.passed = false;
        }
        if (validation.warnings) {
            result.warnings.push(...validation.warnings);
        }

    } catch (error: any) {
        result.issues.push(`Generation failed: ${error.message}`);
        result.passed = false;
    }

    return result;
}

async function runTests() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  D&D 5e Character Generation Test Suite');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Initialize services
    console.log('Initializing services...');
    await FiveToolsService.getInstance().initialize();
    console.log('Services ready.\n');

    const results: TestResult[] = [];
    let passed = 0;
    let failed = 0;

    for (const className of TEST_CLASSES) {
        console.log(`\n━━━ Testing ${className} ━━━`);

        for (const level of TEST_LEVELS) {
            process.stdout.write(`  Level ${level.toString().padStart(2)}: `);

            const result = await testCharacter(className, level);
            results.push(result);

            if (result.passed) {
                passed++;
                console.log(`✓ PASS`);
                if (result.warnings.length > 0) {
                    result.warnings.forEach(w => console.log(`    ⚠ ${w}`));
                }
            } else {
                failed++;
                console.log(`✗ FAIL`);
                result.issues.forEach(i => console.log(`    ✗ ${i}`));
            }
        }
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  Total Tests: ${results.length}`);
    console.log(`  Passed:      ${passed} (${((passed / results.length) * 100).toFixed(1)}%)`);
    console.log(`  Failed:      ${failed}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Detailed failure report
    if (failed > 0) {
        console.log('FAILED TESTS:');
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  ${r.class} Lv${r.level}:`);
            r.issues.forEach(i => console.log(`    - ${i}`));
        });
    }

    process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(console.error);
