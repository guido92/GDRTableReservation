import { NextResponse } from 'next/server';
import { UnifiedDataService } from '@/services/unified-data-service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sourcesParam = searchParams.get('sources');
        const sources = sourcesParam ? sourcesParam.split(',') : undefined;
        const name = searchParams.get('name');

        const unifiedService = UnifiedDataService.getInstance();

        // If a specific class name is requested, return detailed info
        if (name) {
            const classData = await unifiedService.getClass(name, sources);
            if (!classData) {
                return NextResponse.json({ error: 'Classe non trovata' }, { status: 404 });
            }
            return NextResponse.json({ class: classData });
        }

        // Otherwise return all classes list
        const allClasses = await unifiedService.getClasses(sources);

        // Map to simplified list format
        const classesList = allClasses.map(c => ({
            name: c.name,
            nameEn: c.nameEn,
            source: c.source,
            hitDie: c.hitDie,
            savingThrows: c.savingThrows,
            numSkills: c.skillChoices.count,
            armorProficiencies: c.armorProficiencies,
            weaponProficiencies: c.weaponProficiencies,
            spellcasting: c.spellcastingAbility ? {
                ability: c.spellcastingAbility,
                progression: c.casterProgression
            } : null,
            subclasses: c.subclasses.map(s => ({
                name: s.name,
                nameEn: s.nameEn,
                source: s.source
            }))
        }));

        return NextResponse.json({
            classes: classesList,
            count: classesList.length
        });
    } catch (error) {
        console.error('Error in /api/dnd/classes:', error);
        return NextResponse.json(
            { error: 'Errore nel caricamento delle classi' },
            { status: 500 }
        );
    }
}
