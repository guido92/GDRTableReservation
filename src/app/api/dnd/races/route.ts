import { NextResponse } from 'next/server';
import { UnifiedDataService } from '@/services/unified-data-service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sourcesParam = searchParams.get('sources');
        const sources = sourcesParam ? sourcesParam.split(',') : undefined;
        const name = searchParams.get('name');

        const unifiedService = UnifiedDataService.getInstance();

        // If a specific race name is requested, return detailed info
        if (name) {
            const raceData = await unifiedService.getRace(name, sources);
            if (!raceData) {
                return NextResponse.json({ error: 'Razza non trovata' }, { status: 404 });
            }
            return NextResponse.json({ race: raceData });
        }

        // Otherwise return all races list
        const allRaces = await unifiedService.getRaces(sources);

        // Map to simplified list format
        const racesList = allRaces.map(r => ({
            name: r.name,
            nameEn: r.nameEn,
            speed: r.speed,
            abilityBonuses: r.abilityBonuses,
            darkvision: r.darkvision,
            languages: r.languages,
            features: r.features.map(f => ({
                name: f.name,
                description: f.description
            })),
            subraces: r.subraces?.map(s => ({
                name: s.name,
                nameEn: s.nameEn,
                abilityBonuses: s.abilityBonuses
            })) || []
        }));

        return NextResponse.json({
            races: racesList,
            count: racesList.length
        });
    } catch (error) {
        console.error('Error in /api/dnd/races:', error);
        return NextResponse.json(
            { error: 'Errore nel caricamento delle razze' },
            { status: 500 }
        );
    }
}
