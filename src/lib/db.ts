import fs from 'fs/promises';
import path from 'path';
import { Session } from '@/types';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

export async function getSessions(): Promise<Session[]> {
    try {
        // Ensure directory exists
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

        try {
            await fs.access(DB_PATH);
        } catch {
            // File doesn't exist, create it
            await fs.writeFile(DB_PATH, JSON.stringify({ sessions: [] }, null, 2));
            return [];
        }

        const data = await fs.readFile(DB_PATH, 'utf-8');
        let sessions: Session[] = JSON.parse(data).sessions;

        // Auto-cleanup: Remove sessions older than 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const validSessions = sessions.filter(s => {
            const sessionDate = new Date(s.date);
            return sessionDate >= sevenDaysAgo;
        });

        if (validSessions.length !== sessions.length) {
            await fs.writeFile(DB_PATH, JSON.stringify({ sessions: validSessions }, null, 2));
            sessions = validSessions;
        }

        return sessions;
    } catch (error) {
        console.error("Error reading DB:", error);
        return [];
    }
}

export async function saveSession(session: Session): Promise<void> {
    const sessions = await getSessions();
    sessions.push(session);
    await fs.writeFile(DB_PATH, JSON.stringify({ sessions }, null, 2));
}

export async function updateSession(updatedSession: Session): Promise<void> {
    const sessions = await getSessions();
    const index = sessions.findIndex(s => s.id === updatedSession.id);
    if (index !== -1) {
        sessions[index] = updatedSession;
        await fs.writeFile(DB_PATH, JSON.stringify({ sessions }, null, 2));
    }
}

export async function getSessionById(id: string): Promise<Session | undefined> {
    const sessions = await getSessions();
    return sessions.find(s => s.id === id);
}
