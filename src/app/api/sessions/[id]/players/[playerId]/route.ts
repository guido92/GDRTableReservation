import { NextResponse } from 'next/server';
import { getSessionById, updateSession } from '@/lib/db';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; playerId: string }> }
) {
    const { id, playerId } = await params;

    const session = await getSessionById(id);

    if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const initialLength = session.currentPlayers.length;
    session.currentPlayers = session.currentPlayers.filter(p => p.id !== playerId);

    if (session.currentPlayers.length === initialLength) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    await updateSession(session);

    return NextResponse.json(session);
}
