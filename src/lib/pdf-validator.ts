import { PDFDocument, PDFTextField } from 'pdf-lib';
import { CharacterData } from '@/types/dnd';

export interface ValidationResult {
    success: boolean;
    issues: string[];
    critical: boolean;
}

export class PDFValidator {
    static async validate(pdfBytes: Uint8Array, data: CharacterData): Promise<ValidationResult> {
        const issues: string[] = [];
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
                        issues.push(`Field Not Found: ${name}`);
                        // Not critical if it's just a mapping error, but annoying
                        return;
                    }

                    const val = field.getText();
                    if (!val || val.trim() === '') {
                        issues.push(`Empty Field: ${name}`);
                        critical = true;
                    } else if (requiredValue && val !== requiredValue) {
                        // Soft warning for mismatch
                        // issues.push(`Mismatch ${name}: Expected '${requiredValue}', got '${val}'`);
                    }
                } catch (e) {
                    issues.push(`Error checking ${name}`);
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
                // This is hard to check accurately without knowning the exact mapping
                // But we can check if "Spells 1014" (Cantrip 1) is filled if we have cantrips
                if (data.spells.some(s => s.level === 0)) {
                    // checkField('Spells 1014'); // Often mapped to cantrips
                }
            }

            return { success: issues.length === 0, issues, critical };

        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            return { success: false, issues: [`Validator Crash: ${msg}`], critical: true };
        }
    }
}
