import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/db-delete';
import { updateSession, getSessionById } from '@/lib/db';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await deleteSession(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        const existingSession = await getSessionById(id);

        if (!existingSession) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Merge existing session with updates
        // We ensure players and sensitive fields are preserved if not explicitly updated
        // Use a safe merge strategy
        const updatedSession = {
            ...existingSession,
            ...body,
            id: existingSession.id, // ID cannot be changed
            currentPlayers: existingSession.currentPlayers // Prevent players overwrite if not intended (though body shouldn't have it usually for this edit)
        };

        // If the body EXPLICITLY contains currentPlayers (unlikely for basic edit info), allow it? 
        // For now, let's assume we are editing meta-data (Title, Master, Date, etc.)
        // But if we want to support full edit, we should allow everything. 
        // Let's rely on ...body overwriting ...existingSession, EXCEPT ID.
        // But wait, if we edit meta data, we don't want to lose players.
        // The frontend edit form likely won't send players array.
        // If body doesn't have currentPlayers, ...body won't overwrite it. 
        // So the simple spread works.

        await updateSession(updatedSession);
        return NextResponse.json({ success: true, session: updatedSession });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }
}
