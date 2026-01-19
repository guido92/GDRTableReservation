import { getSessions } from '@/lib/db';
import { Scroll } from 'lucide-react';
import Link from 'next/link';
import SessionCard from '@/components/SessionCard';
import Navbar from '@/components/Navbar';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allSessions = await getSessions();

  // Filter expired sessions (keep today's sessions)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessions = allSessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= today;
  });

  sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '3rem 1rem', flex: 1 }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
            Prossime Giocate
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Prenota il tuo posto al tavolo. Scegli la tua avventura e unisciti alla community.
          </p>


          <div style={{ marginTop: '3rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
            {/* Banner removed as per user request */}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--foreground-muted)' }}>
            <p>Nessuna giocata in programma al momento.</p>
          </div>
        )}
      </div>

    </main>
  );
}
