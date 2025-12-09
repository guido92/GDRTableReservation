import fs from 'fs/promises';
import path from 'path';
import { Session } from '@/types';
import { getSessions } from './db';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

export async function deleteSession(id: string): Promise<void> {
    const sessions = await getSessions();
    const sessionToDelete = sessions.find(s => s.id === id);

    if (sessionToDelete && sessionToDelete.imageUrl) {
        try {
            // Extract filename from URL (e.g., /uploads/filename.webp -> filename.webp)
            const filename = sessionToDelete.imageUrl.split('/').pop();
            if (filename) {
                const imagePath = path.join(process.cwd(), 'public/uploads', filename);
                await fs.unlink(imagePath).catch(() => console.log(`Failed to delete image: ${imagePath}`));
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }

    const filteredSessions = sessions.filter(s => s.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify({ sessions: filteredSessions }, null, 2));
}
