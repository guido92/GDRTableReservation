import { PDFDocument, PDFTextField } from 'pdf-lib';
import { CharacterData } from '@/types/dnd';
import { SpellService } from './spell-service';

export interface ValidationResult {
    success: boolean;
    issues: string[];
    warnings: string[];
    critical: boolean;
}

// Non-caster classes that should not have leveled spells
const NON_CASTER_CLASSES = ['Barbaro', 'Guerriero', 'Ladro', 'Monaco'];

// Skill proficiency count limits per class (PHB 2014)
const MAX_SKILLS: Record<string, number> = {
    'Barbaro': 2, 'Bardo': 3, 'Chierico': 2, 'Druido': 2,
    'Guerriero': 2, 'Monaco': 2, 'Paladino': 2, 'Ranger': 3,
    'Ladro': 4, 'Stregone': 2, 'Mago': 2, 'Warlock': 2,
};

// Hit Die by class
const HIT_DIE: Record<string, number> = {
    'Barbaro': 12, 'Guerriero': 10, 'Paladino': 10, 'Ranger': 10,
    'Chierico': 8, 'Druido': 8, 'Monaco': 8, 'Ladro': 8, 'Bardo': 8, 'Warlock': 8,
    'Mago': 6, 'Stregone': 6, 'Artefice': 8
};

// Cantrip limits by class and level
const CANTRIP_PROGRESSION: Record<string, number[]> = {
    'Bardo': [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    'Chierico': [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    'Druido': [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    'Mago': [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    'Stregone': [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    'Warlock': [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
};

export class PDFValidator {

    /**
     * Validates character data BEFORE PDF generation.
     * Catches logical errors that would produce a broken sheet.
     */
    static validateData(data: CharacterData): ValidationResult {
        const issues: string[] = [];
        const warnings: string[] = [];
        let critical = false;

        // Extract base class name for validation
        const baseClass = data.class.replace(/\s*\(.*?\)\s*/g, '').split(/[\s/0-9]/)[0].trim();

        // ═══════════════════════════════════════════════════
        // CRITICAL CHECKS
        // ═══════════════════════════════════════════════════

        // HP must be > 0
        if (!data.hp || data.hp.max <= 0) {
            issues.push('HP max is 0 or negative');
            critical = true;
        }

        // Level must be 1-20
        if (data.level < 1 || data.level > 20) {
            issues.push(`Level ${data.level} is out of range (1-20)`);
            critical = true;
        }

        // AC in reasonable range (1-30)
        if (data.armorClass !== undefined && (data.armorClass < 1 || data.armorClass > 30)) {
            issues.push(`AC ${data.armorClass} is out of range (1-30)`);
        }

        // ═══════════════════════════════════════════════════
        // HP CONSISTENCY CHECK
        // ═══════════════════════════════════════════════════
        const hitDie = HIT_DIE[baseClass] || 8;
        const conMod = Math.floor((data.abilities?.CON || 10) - 10) / 2;

        // Calculate expected HP range
        // Min: all average rolls, min CON bonus
        // Max: all max rolls, max reasonable CON bonus
        const avgRoll = Math.floor(hitDie / 2) + 1;
        const minExpectedHp = hitDie + (data.level - 1) * avgRoll + Math.floor(conMod) * data.level;
        const maxExpectedHp = hitDie * data.level + Math.ceil(conMod + 2) * data.level; // Allow +2 for items/features

        if (data.hp && (data.hp.max < minExpectedHp * 0.7 || data.hp.max > maxExpectedHp * 1.3)) {
            warnings.push(`HP ${data.hp.max} seems unusual for ${baseClass} Lv${data.level} (expected ${minExpectedHp}-${maxExpectedHp})`);
        }

        // ═══════════════════════════════════════════════════
        // SPELL VALIDATION
        // ═══════════════════════════════════════════════════

        // Non-casters should not have leveled spells
        if (NON_CASTER_CLASSES.includes(baseClass)) {
            const leveledSpells = (data.spells || []).filter(s => s.level > 0);
            if (leveledSpells.length > 0) {
                issues.push(`Non-caster ${baseClass} has ${leveledSpells.length} leveled spells — removing`);
                data.spells = (data.spells || []).filter(s => s.level === 0);
            }
        }

        // Spell level validation
        const maxSpellLevel = SpellService.getMaxSpellLevel(baseClass, data.level);
        const tooHigh = (data.spells || []).filter(s => s.level > maxSpellLevel && s.level > 0);
        if (tooHigh.length > 0) {
            issues.push(`${tooHigh.length} spells exceed max level ${maxSpellLevel} for ${baseClass} ${data.level}`);
            // Auto-fix: remove spells above accessible level
            data.spells = (data.spells || []).filter(s => s.level <= maxSpellLevel || s.level === 0);
        }

        // Cantrip count validation
        const cantripProgression = CANTRIP_PROGRESSION[baseClass];
        if (cantripProgression) {
            const maxCantrips = cantripProgression[data.level - 1] || 4;
            const currentCantrips = (data.spells || []).filter(s => s.level === 0).length;
            if (currentCantrips > maxCantrips + 2) { // Allow +2 for racial/feat cantrips
                warnings.push(`${baseClass} has ${currentCantrips} cantrips (expected max ${maxCantrips})`);
            }
        }

        // ═══════════════════════════════════════════════════
        // SKILL VALIDATION
        // ═══════════════════════════════════════════════════
        const expectedSkills = MAX_SKILLS[baseClass] || 2;
        const maxTotalSkills = expectedSkills + 4; // +2 background, +2 racial/feat
        if ((data.skills || []).length > maxTotalSkills) {
            warnings.push(`${baseClass} has ${data.skills.length} skills (expected max ~${maxTotalSkills})`);
        }

        // ═══════════════════════════════════════════════════
        // ABILITY SCORE VALIDATION
        // ═══════════════════════════════════════════════════
        if (data.abilities) {
            const stats = Object.values(data.abilities);
            const hasInvalidStat = stats.some(s => s < 3 || s > 20);
            if (hasInvalidStat) {
                warnings.push('One or more ability scores are outside valid range (3-20)');
            }

            // Check for reasonable point buy / standard array
            const total = stats.reduce((a, b) => a + b, 0);
            if (total < 60 || total > 90) { // Standard array = 72, point buy = ~72-75
                warnings.push(`Ability score total ${total} is unusual (expected 60-90)`);
            }
        }

        return { success: issues.length === 0, issues, warnings, critical };
    }

    static async validate(pdfBytes: Uint8Array, data: CharacterData): Promise<ValidationResult> {
        const issues: string[] = [];
        const warnings: string[] = [];
        let critical = false;

        try {
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const form = pdfDoc.getForm();

            // 1. Critical Fields Check
            const checkField = (name: string, requiredValue?: string) => {
                try {
                    // Try exact name or common variations
                    let field = null;
                    const variations = [name, `${name} `, `${name}  `];
                    for (const v of variations) {
                        try { field = form.getTextField(v); if (field) break; } catch (e) { }
                    }

                    if (!field) {
                        warnings.push(`Field Not Found: ${name}`);
                        return;
                    }

                    const val = field.getText();
                    if (!val || val.trim() === '') {
                        issues.push(`Empty Field: ${name}`);
                        critical = true;
                    } else if (requiredValue && val !== requiredValue) {
                        // Soft warning for mismatch
                        // warnings.push(`Mismatch ${name}: Expected '${requiredValue}', got '${val}'`);
                    }
                } catch (e) {
                    warnings.push(`Error checking ${name}`);
                }
            };

            checkField('CharacterName');
            checkField('ClassLevel');
            // HP is critical
            checkField('HPMax');
            checkField('AC');

            // 2. Spell Validation (If caster)
            if (data.spells && data.spells.length > 0) {
                // Check if at least one spell slot or spell text is filled
                if (data.spells.some(s => s.level === 0)) {
                    // checkField('Spells 1014'); // Often mapped to cantrips
                }
            }

            return { success: issues.length === 0, issues, warnings, critical };

        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            return { success: false, issues: [`Validator Crash: ${msg}`], warnings: [], critical: true };
        }
    }
}
