'use client';

import { Session } from '@/types';
import Navbar from '@/components/Navbar';
import JoinSessionForm from '@/components/JoinSessionForm';
import { formatDate } from '@/lib/utils';
import AddToCalendar from '@/components/AddToCalendar';
import ShareSession from '@/components/ShareSession';

export default function SessionContent({ session }: { session: Session }) {
    const fallbackImage = "/dama1.webp";
    const displayImage = session.imageUrl || fallbackImage;

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <div className="hero-compact">
                <div className="hero-bg" style={{ 
                    backgroundImage: `url('${displayImage}')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }} />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <span className="gold-text" style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        letterSpacing: '3px',
                        display: 'block',
                        marginBottom: '1rem'
                    }}>
                        {session.system}
                    </span>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                        {session.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📅 {formatDate(session.date)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            ⏰ {session.time}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📍 {session.location}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem 5rem', flex: 1 }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '3rem', 
                    alignItems: 'start' 
                }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2.5rem' }}>
                            <h2 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Informazioni</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                                <div>
                                    <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Master / Organizzatore</h4>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>{session.masterName}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Agenda</h4>
                                    <AddToCalendar session={session} />
                                </div>
                            </div>

                            <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Descrizione dell&apos;evento</h4>
                            <p style={{ lineHeight: 1.8, color: 'var(--foreground-muted)', fontWeight: 300, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                                {session.description}
                            </p>
                        </div>

                        <div className="glass-panel" style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                                <h2 className="gold-text" style={{ fontSize: '1.5rem' }}>Partecipanti</h2>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                                    {session.currentPlayers.length} / {session.maxPlayers} posti occupati
                                </span>
                            </div>

                            {session.currentPlayers.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                    {session.currentPlayers.map((player, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                {player.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{player.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed rgba(207,170,67,0.2)', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ color: 'var(--foreground-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>Ancora nessun avventuriero si è fatto avanti. Sii il primo!</p>
                                </div>
                            )}

                            {session.currentPlayers.length > 0 && (
                                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(
                                            `Ciao a tutti! Vi scrivo per la sessione "${session.title}" del ${formatDate(session.date)} alle ${session.time} al Dama Cafè. Ci siete tutti?`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                        style={{ width: '100%', fontSize: '0.8rem', gap: '0.75rem' }}
                                    >
                                        💬 Crea/Apri Chat di Coordinamento
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '100px' }}>
                        <JoinSessionForm session={session} />
                        
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Condividi</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', marginBottom: '1.5rem', fontWeight: 300 }}>
                                Invita altri giocatori a unirsi a questo tavolo!
                            </p>
                            <ShareSession session={session} />
                        </div>
                    </div>

                </div>
            </div>

        </main>
    );
}