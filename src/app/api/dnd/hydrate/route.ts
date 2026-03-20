import { NextRequest, NextResponse } from 'next/server';
import { CharacterLogic } from '@/lib/character-logic';
import { FiveToolsService } from '@/services/five-tools-service';

export async function POST(req: NextRequest) {
    try {
        await FiveToolsService.getInstance().initialize();
        const data = await req.json();
        const hydrated = await CharacterLogic.hydrateCharacter(data);
        return NextResponse.json(hydrated);
    } catch (error: any) {
        console.error('Hydrate Error:', error.message);
        return NextResponse.json(
            { error: 'Failed to hydrate character data.' },
            { status: 500 }
        );
    }
}
