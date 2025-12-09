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
    if (session.currentPlayers.some(p => p.name === player.name)) {
        return NextResponse.json({ error: 'Player already joined' }, { status: 400 });
    }

    session.currentPlayers.push(player);
    await updateSession(session);

    return NextResponse.json(session);
}
