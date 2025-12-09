import { getSessionById } from '@/lib/db';
import Navbar from '@/components/Navbar';
import JoinSessionForm from '@/components/JoinSessionForm';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSessionById(id);

    if (!session) {
        notFound();
    }

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '3rem 1rem', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

                    {/* Left Column: Details */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ position: 'relative', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem' }}>
                            {session.imageUrl ? (
                                <Image src={session.imageUrl} alt={session.title} fill style={{ objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'var(--surface)' }} />
                            )}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)' }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{session.system}</span>
                                <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1 }}>{session.title}</h1>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Dettagli Sessione</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <div style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>Master</div>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{session.masterName}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>Data & Ora</div>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                                        {formatDate(session.date)} alle {session.time}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>Luogo</div>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{session.location}</div>
                                </div>
                            </div>

                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Descrizione</h3>
                            <p style={{ lineHeight: 1.7, color: 'var(--foreground-muted)' }}>{session.description}</p>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '300px' }}>
                        <JoinSessionForm session={session} />

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Partecipanti ({session.currentPlayers.length}/{session.maxPlayers})</h3>
                            {session.currentPlayers.length > 0 ? (
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {session.currentPlayers.map((player, idx) => (
                                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                {player.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{player.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: 'var(--foreground-muted)', fontStyle: 'italic' }}>Nessun partecipante ancora.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
