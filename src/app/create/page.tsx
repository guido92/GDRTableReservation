'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function CreatePage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <div className="hero-compact" style={{ paddingBottom: '2rem' }}>
                <div className="hero-bg" style={{ backgroundImage: "url('/sfondo.webp')", opacity: 0.2 }} />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        Crea un Tavolo
                    </h1>
                    <p style={{ color: 'var(--foreground-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', fontWeight: 300 }}>
                        Scegli il tipo di esperienza che vuoi organizzare al Dama Cafè.
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem 5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', maxWidth: '900px' }}>

                    {/* GDR Option */}
                    <Link href="/create/gdr" className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'var(--foreground)', transition: 'all 0.4s ease', overflow: 'hidden' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ height: '160px', position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/dama2.webp')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.4)' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,5,3,1), transparent)' }} />
                            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '3rem' }}>🐉</div>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }} className="gold-text">Sessione GDR</h2>
                            <p style={{ color: 'var(--foreground-muted)', lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 300 }}>
                                Dungeon & Dragons, Pathfinder, Call of Cthulhu... <br />
                                Prenota un tavolo per la tua campagna o una one-shot epica.
                            </p>
                            <div className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>Inizia a Creare</div>
                        </div>
                    </Link>

                    {/* Board Game Option */}
                    <Link href="/create/boardgame" className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'var(--foreground)', transition: 'all 0.4s ease', overflow: 'hidden' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ height: '160px', position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/dama3.webp')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.4)' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,5,3,1), transparent)' }} />
                            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '3rem' }}>🎲</div>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }} className="gold-text">Gioco da Tavolo</h2>
                            <p style={{ color: 'var(--foreground-muted)', lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 300 }}>
                                Serata party games, strategia o grandi classici. <br />
                                Organizza una sfida aperta a tutti o riserva un posto per il tuo gruppo.
                            </p>
                            <div className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>Inizia a Creare</div>
                        </div>
                    </Link>

                </div>
            </div>
        </main>
    );
}
