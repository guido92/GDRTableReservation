import { NextResponse } from 'next/server';
import { getSessions, saveSession } from '@/lib/db';
import { Session } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const sessions = await getSessions();
    return NextResponse.json(sessions);
}

export async function POST(request: Request) {
    const body = await request.json();

    const newSession: Session = {
        id: uuidv4(),
        ...body,
        currentPlayers: []
    };

    await saveSession(newSession);
    return NextResponse.json(newSession);
}
