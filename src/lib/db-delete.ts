import fs from 'fs/promises';
import path from 'path';
import { Session } from '@/types';
import { getSessions } from './db';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

export async function deleteSession(id: string): Promise<void> {
    const sessions = await getSessions();
    const filteredSessions = sessions.filter(s => s.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify({ sessions: filteredSessions }, null, 2));
}
