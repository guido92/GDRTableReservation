import { NextResponse } from 'next/server';
import { UnifiedDataService } from '@/services/unified-data-service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sourcesParam = searchParams.get('sources');
        const sources = sourcesParam ? sourcesParam.split(',') : ['PHB', 'XGE', 'TCE'];

        const unifiedService = UnifiedDataService.getInstance();
        const backgrounds = await unifiedService.getBackgrounds(sources);
        
        console.log(`[API Backgrounds] Requested sources: ${sourcesParam}`);
        console.log(`[API Backgrounds] Returning ${backgrounds.length} backgrounds`);

        return NextResponse.json({
            backgrounds: backgrounds,
            count: backgrounds.length
        });
    } catch (error) {
        console.error('Error in /api/dnd/backgrounds:', error);
        return NextResponse.json(
            { error: 'Errore nel caricamento dei background' },
            { status: 500 }
        );
    }
}
