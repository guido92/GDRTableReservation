import { NextRequest, NextResponse } from 'next/server';
import { generateCharacterPDF } from '@/lib/pdf-generator';
import { PDFValidator } from '@/lib/pdf-validator';
import { DataFixer } from '@/lib/data-fixer';
import { CharacterData } from '@/types/dnd';

import { FiveToolsService } from '@/services/five-tools-service';

export async function POST(req: NextRequest) {
    try {
        await FiveToolsService.getInstance().initialize();
        let data: CharacterData = await req.json();

        if (!data.characterName || !data.class) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 0. Pre-generation data validation (fixes issues in-place)
        const preValidation = PDFValidator.validateData(data);
        if (preValidation.issues.length > 0) {
            console.warn("Pre-PDF Validation:", preValidation.issues);
        }

        // 1. Initial Generation
        let pdfBytes = await generateCharacterPDF(data);

        // 2. Validation Loop
        const validation = await PDFValidator.validate(pdfBytes, data);

        if (!validation.success && validation.critical) {
            console.warn("PDF Validation Failed:", validation.issues);

            // 3. Auto-Fix
            const { fixedData, patches } = DataFixer.fix(data, validation.issues);

            if (patches.length > 0) {
                console.log("Applying Data Patches:", patches);
                // 4. Regenerate
                data = fixedData;
                pdfBytes = await generateCharacterPDF(data);
            }
        }

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${data.characterName.replace(/\s+/g, '_')}_Sheet.pdf"`,
                'X-Validation-Success': String(validation.success)
            },
        });
    } catch (error: unknown) {
        console.error('PDF Generation Error:', error);
        const msg = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        return NextResponse.json({ error: 'Failed to generate PDF', details: msg, stack }, { status: 500 });
    }
}
