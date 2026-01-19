
import { NextResponse } from 'next/server';
import { Plutonium, PlutoniumItem } from '@/lib/plutonium';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sources = searchParams.get('sources')?.split(',') || ['PHB', 'XGE', 'TCE'];

    const items = await Plutonium.getItems(sources);

    // Map to simple structure
    const mapped = items.map(i => ({
        name: Plutonium.translate(i.name, 'exact'),
        originalName: i.name,
        source: i.source,
        type: Plutonium.translate(i.type || '', 'exact') || i.type,
        rarity: Plutonium.translate(i.rarity || '', 'exact'),
        weight: i.weight,
        value: i.value,
        description: i.entries ? Plutonium.cleanText(JSON.stringify(i.entries)) : ''
    }));

    return NextResponse.json({ items: mapped });
}
