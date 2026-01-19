import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get('to');

    if (!to) return NextResponse.json({ error: 'Missing to parameter' }, { status: 400 });

    try {
        const { inviaEmailPrenotazioneTavolo } = await import('@/lib/emailService');

        const testData = {
            emailOrganizzatore: to,
            nomeOrganizzatore: 'Test Master',
            nomeGiocatore: 'Test Player',
            nomeTavolo: 'Test Table',
            descrizioneGioco: 'D&D 5e',
            data: '2026-01-20',
            ora: '20:00',
            numeroPostiPrenotati: 1
        };

        await inviaEmailPrenotazioneTavolo(testData);
        return NextResponse.json({ success: true, message: `Test email triggered for ${to}. Check server logs.` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
