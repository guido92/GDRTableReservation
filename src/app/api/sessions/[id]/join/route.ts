import { NextResponse } from 'next/server';
import { getSessionById, updateSession } from '@/lib/db';
import { Player } from '@/types';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const player: Player = body.player;

    const session = await getSessionById(id);

    if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.currentPlayers.length >= session.maxPlayers) {
        return NextResponse.json({ error: 'Session is full' }, { status: 400 });
    }

    // Check if player already joined
    // Check if player already joined
    if (session.currentPlayers.some(p => p.name === player.name)) {
        return NextResponse.json({ error: 'Player already joined' }, { status: 400 });
    }

    session.currentPlayers.push(player);
    await updateSession(session);

    // Send Email Notification to Master and Player
    // Prepare data for email service
    const emailData = {
        emailOrganizzatore: session.masterEmail || process.env.ADMIN_EMAIL,
        nomeOrganizzatore: session.masterName,
        nomeGiocatore: player.name,
        emailGiocatore: player.email, // Assuming player object has email
        telefonoGiocatore: player.contactInfo,
        nomeTavolo: session.title,
        descrizioneGioco: session.system, // Using system as description
        data: session.date,
        ora: session.time,
        numeroPostiPrenotati: 1,
        note: player.notes
    };

    try {
        const { inviaEmailPrenotazioneTavolo, inviaEmailConfermaGiocatore } = await import('@/lib/emailService');

        console.log('Join API: Email Data Payload:', JSON.stringify(emailData, null, 2));

        // Notify Master
        if (emailData.emailOrganizzatore) {
            console.log(`Join API: Attempting to notify Master: ${emailData.emailOrganizzatore}`);
            await inviaEmailPrenotazioneTavolo(emailData);
        } else {
            console.warn('Join API: No Master email found, skipping Master notification');
        }

        // Notify Player (if email exists)
        if (player.email) {
            console.log(`Join API: Attempting to notify Player: ${player.email}`);
            await inviaEmailConfermaGiocatore(emailData);
        } else {
            console.warn('Join API: No Player email found, skipping Player notification');
        }

        console.log('Join API: Email notifications process finished');
    } catch (error) {
        console.error('Join API: Critical Failure in Email Notifications:', error);
    }

    return NextResponse.json(session);
}
