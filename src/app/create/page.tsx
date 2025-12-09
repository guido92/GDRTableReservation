import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function CreatePage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '3rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem', textAlign: 'center' }}>
                    Cosa vuoi organizzare?
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '900px' }}>

                    {/* GDR Option */}
                    <Link href="/create/gdr" className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', color: 'var(--foreground)', transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '4rem' }}>🐉</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Sessione GDR</h2>
                        <p style={{ textAlign: 'center', color: 'var(--foreground-muted)', lineHeight: '1.6' }}>
                            Organizza una sessione di D&D, Pathfinder, o qualsiasi altro gioco di ruolo.
                        </p>
                        <div className="btn btn-primary" style={{ marginTop: '1rem' }}>Crea Sessione</div>
                    </Link>

                    {/* Board Game Option */}
                    <Link href="/create/boardgame" className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', color: 'var(--foreground)', transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '4rem' }}>🎲</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Gioco da Tavolo</h2>
                        <p style={{ textAlign: 'center', color: 'var(--foreground-muted)', lineHeight: '1.6' }}>
                            Organizza una serata giochi in scatola, party game o carte.
                        </p>
                        <div className="btn btn-primary" style={{ marginTop: '1rem' }}>Crea Tavolo</div>
                    </Link>

                </div>
            </div>
        </main>
    );
}
