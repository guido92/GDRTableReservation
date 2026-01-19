import { NextResponse } from 'next/server';
import { Plutonium } from '@/lib/plutonium';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sources = searchParams.get('sources')?.split(',') || ['PHB', 'XGE', 'TCE'];

    const backgrounds = await Plutonium.getBackgrounds(sources);

    const mapped = backgrounds.map(b => ({
        name: Plutonium.translate(b.name, 'exact'),
        originalName: b.name,
        source: b.source,
        skillProficiencies: b.skillProficiencies,
        toolProficiencies: b.toolProficiencies,
        languageProficiencies: b.languageProficiencies,
        startingEquipment: b.startingEquipment,
        feature: (b.entries as any[])?.find(e => e.name?.includes('Feature')) // heuristic to find feature
    }));

    return NextResponse.json({ backgrounds: mapped });
}
