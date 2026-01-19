import { NextRequest, NextResponse } from 'next/server';
import { generateCharacterPDF } from '@/lib/pdf-generator';
import { CharacterData } from '@/types/dnd';

export async function POST(req: NextRequest) {
    try {
        const data: CharacterData = await req.json();

        if (!data.characterName || !data.class) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pdfBytes = await generateCharacterPDF(data);

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${data.characterName.replace(/\s+/g, '_')}_Sheet.pdf"`,
            },
        });
    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}
