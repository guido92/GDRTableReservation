import { getSessionById } from '@/lib/db';
import { notFound } from 'next/navigation';
import SessionContent from './SessionContent';

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSessionById(id);

    if (!session) {
        notFound();
    }

    return <SessionContent session={session} />;
}