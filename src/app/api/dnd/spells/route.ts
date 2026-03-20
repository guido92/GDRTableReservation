import { NextResponse } from 'next/server';
import { SpellService } from '@/lib/spell-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class');
    const levelStr = searchParams.get('level');

    try {
        let spells;

        if (className) {
            const maxLevel = levelStr ? parseInt(levelStr) : 9;
            spells = await SpellService.getSpellsForClass(className, maxLevel);
        } else {
            spells = await SpellService.getAllSpells();
            if (levelStr) {
                const maxLevel = parseInt(levelStr);
                spells = spells.filter(s => s.level <= maxLevel);
            }
        }

        const responseData = spells.map(s => ({
            name: s.name,
            originalName: s.originalName,
            level: s.level,
            school: s.school,
            source: s.source,
            classes: s.classes,
            description: s.description,
        }));

        return NextResponse.json({ spells: responseData, count: responseData.length });
    } catch (e) {
        console.error('Spells API Error:', e);
        return NextResponse.json({ error: 'Failed to load spells' }, { status: 500 });
    }
}
