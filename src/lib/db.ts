import fs from 'fs-extra';
import path from 'path';
import { Session } from '@/types';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

console.log('[db] DB_PATH:', DB_PATH);
console.log('[db] CWD:', process.cwd());

export async function getSessions(): Promise<Session[]> {
    try {
        let data = await fs.readFile(DB_PATH, 'utf-8');
        data = data.replace(/^\uFEFF/, '');
        const sessions: Session[] = JSON.parse(data).sessions;
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const limitDateStr = sevenDaysAgo.toISOString().split('T')[0];

        // Ensure we only return sessions that are either upcoming OR recently expired (within 7 days)
        // Sessions with missing dates are PRESERVED to avoid 404 errors during data entry glitches.
        const validSessions = sessions.filter(s => {
            if (!s.date) return true; // Keep it if date is missing
            return s.date >= limitDateStr;
        });

        return validSessions;
    } catch (error) {
        console.error("Error reading sessions:", error);
        return [];
    }
}

async function cleanupExpiredSessions(sessions: Session[]): Promise<Session[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const limitDateStr = sevenDaysAgo.toISOString().split('T')[0];

    const validSessions = sessions.filter(s => {
        // Only remove if it HAS a date and it's truly OLDER than 7 days
        if (!s.date) return true;
        return s.date >= limitDateStr;
    });

    const expiredSessions = sessions.filter(s => !validSessions.includes(s));
    for (const session of expiredSessions) {
        if (session.imageUrl) {
            try {
                const filename = session.imageUrl.split('/').pop();
                if (filename) {
                    const imagePath = path.join(process.cwd(), 'public/uploads', filename);
                    await fs.unlink(imagePath).catch(() => {});
                }
            } catch (e) {
                console.error("Error deleting expired image:", e);
            }
        }
    }

    return validSessions;
}

export async function getSessionById(id: string): Promise<Session | undefined> {
    try {
        let data = await fs.readFile(DB_PATH, 'utf-8');
        data = data.replace(/^\uFEFF/, '');
        const sessions: Session[] = JSON.parse(data).sessions;
        return sessions.find(s => s.id === id);
    } catch (error) {
        console.error("Error reading session by ID:", error);
        return undefined;
    }
}

export async function saveSession(session: Session): Promise<void> {
    try {
        let rawData = await fs.readFile(DB_PATH, 'utf-8');
        rawData = rawData.replace(/^\uFEFF/, '');
        
        let sessions: Session[] = JSON.parse(rawData).sessions;
        
        sessions.push(session);
        sessions = await cleanupExpiredSessions(sessions);
        
        await fs.writeFile(DB_PATH, JSON.stringify({ sessions }, null, 2));
    } catch (error) {
        console.error("[saveSession] Error:", error);
        throw error;
    }
}

export async function updateSession(updatedSession: Session): Promise<void> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        let sessions: Session[] = JSON.parse(data).sessions;
        
        const index = sessions.findIndex(s => s.id === updatedSession.id);
        if (index !== -1) {
            sessions[index] = updatedSession;
            await fs.writeFile(DB_PATH, JSON.stringify({ sessions }, null, 2));
        }
    } catch (error) {
        console.error("Error updating session:", error);
        throw error;
    }
}
