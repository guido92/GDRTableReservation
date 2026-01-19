import { NextResponse } from 'next/server';
import { Plutonium } from '@/lib/plutonium';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sources = searchParams.get('sources')?.split(',') || ['PHB', 'XGE', 'TCE'];

    const feats = await Plutonium.getFeats(sources);

    const mapped = feats.map(f => ({
        name: Plutonium.translate(f.name, 'exact'),
        originalName: f.name,
        source: f.source,
        prerequisite: f.prerequisite,
        description: (f.entries as any[]).map(e => typeof e === 'string' ? e : e.name || '').join('\n') // Simplified description
    }));

    return NextResponse.json({ feats: mapped });
}
