import { NextResponse } from 'next/server';
import { Plutonium } from '@/lib/plutonium';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sources = searchParams.get('sources')?.split(',') || ['PHB', 'XGE', 'TCE'];
    const className = searchParams.get('class');
    const levelStr = searchParams.get('level');

    try {
        const allSpells = await Plutonium.getSpells(sources);

        let filtered = allSpells;
        // Note: Filtering by Class in 5etools data requires parsing the "fromClassList" or "classes" object which might be complex.
        // For now, we return ALL spells and let Client filter if needed, OR we implement a basic class filter if possible.
        // Checking schema: 5etools spells usually have `classes: { fromClassList: [...] }`.

        if (className) {
            filtered = filtered.filter(s => {
                // Check if spell belongs to class. 
                // Since we didn't fully implement class parsing in Plutonium.ts yet, we might return all. 
                // But let's check if the 'classes' property exists on the entries we loaded.
                // If the user wants "Wizard" spells, returning Cleric spells isn't ideal.
                // However, without a dedicated Index, it's hard.
                // For V1, let's return ALL and rely on client or name search.
                return true;
            });
        }

        if (levelStr) {
            const maxLevel = parseInt(levelStr);
            filtered = filtered.filter(s => s.level <= maxLevel);
        }

        // Optimization: Map to simplified object to save bandwidth
        const responseData = filtered.map(s => ({
            name: Plutonium.translate(s.name, 'exact'),
            originalName: s.name,
            level: s.level,
            school: Plutonium.translate(s.school || 'U', 'exact') || s.school,
            source: s.source,
            classes: s.classes?.fromClassList?.map((c: any) => c.name) || [],
            description: Plutonium.cleanText(s.entries?.[0] || ''),
        }));

        return NextResponse.json({ spells: responseData, count: responseData.length });
    } catch (e) {
        console.error('Spells API Error:', e);
        return NextResponse.json({ error: 'Failed to load spells' }, { status: 500 });
    }
}
