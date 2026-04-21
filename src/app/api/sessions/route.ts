import { NextResponse } from 'next/server';
import { getSessions, saveSession } from '@/lib/db';
import { Session } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const sessions = await getSessions();
    return NextResponse.json(sessions);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newSession: Session = {
            id: uuidv4(),
            title: body.title || 'Nuova Sessione',
            date: body.date || new Date().toISOString().split('T')[0],
            ...body,
            currentPlayers: []
        };

        await saveSession(newSession);
        return NextResponse.json(newSession);
    } catch (error) {
        console.error('[API Sessions] Error creating session:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Failed to create session', details: message }, { status: 500 });
    }
}
