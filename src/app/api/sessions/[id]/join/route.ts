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

    // Send Email Notification to Master (if API Key exists)
    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = session.masterEmail || process.env.ADMIN_EMAIL;

    console.log('[DEBUG] Join Notification:', {
        hasApiKey: !!apiKey,
        recipient: recipientEmail,
        sessionTitle: session.title
    });

    if (apiKey && recipientEmail) {
        try {
            const { Resend } = await import('resend');
            const resend = new Resend(apiKey);

            await resend.emails.send({
                from: 'Prenotazione Tavoli <onboarding@resend.dev>', // Default Resend test sender
                to: recipientEmail,
                subject: `Nuova Iscrizione: ${session.title}`,
                html: `
                    <h1>Un nuovo giocatore si è unito!</h1>
                    <p><strong>Giocatore:</strong> ${player.name}</p>
                    <p><strong>Contatto:</strong> ${player.contactInfo || 'Non specificato'}</p>
                    <p><strong>Note:</strong> ${player.notes || 'Nessuna'}</p>
                    <hr />
                    <p><strong>Sessione:</strong> ${session.title}</p>
                    <p><strong>Giocatori:</strong> ${session.currentPlayers.length}/${session.maxPlayers}</p>
                `
            });
            console.log('Email notification sent');
        } catch (error) {
            console.error('Failed to send email notification:', error);
            // Don't fail the request, just log error
        }
    }

    return NextResponse.json(session);
}
