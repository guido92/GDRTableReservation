import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function ContactsPage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '3rem 1rem', flex: 1 }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>
                    Contatti
                </h1>

                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>

                    {/* Logo & Intro */}
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--primary)' }}>
                            <Image src="/logo.jpg" alt="Dama Cafè Logo" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dama Cafè</h2>
                        <p style={{ color: 'var(--foreground-muted)', fontSize: '1.125rem' }}>
                            Il punto di ritrovo per gli appassionati di giochi di ruolo e da tavolo.
                        </p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'var(--border)' }}></div>

                    {/* Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                        {/* Indirizzo */}
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>Dove Siamo</h3>
                            <address style={{ fontStyle: 'normal', lineHeight: '1.6', color: 'var(--foreground)' }}>
                                <strong>Dama Cafè</strong><br />
                                Via Antonio Gramsci 7<br />
                                47035 Gambettola (FC)<br />
                                Italia
                            </address>
                        </div>

                        {/* Social */}
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--secondary)' }}>Seguici sui Social</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <a href="https://chat.whatsapp.com/KQZOoeLaVNWJh2HtXNJCKV" target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', textDecoration: 'none', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(37, 211, 102, 0.1)', transition: 'background 0.2s', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
                                    <span style={{ color: '#25D366', fontWeight: 'bold' }}>WA</span> Community WhatsApp
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61572923820400" target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', textDecoration: 'none', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                    <span style={{ color: '#1877F2', fontWeight: 'bold' }}>f</span> Facebook
                                </a>
                                <a href="https://www.instagram.com/damacaffegambettola/" target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', textDecoration: 'none', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                    <span style={{ color: '#E4405F', fontWeight: 'bold' }}>IG</span> Instagram
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Mappa */}
                    <div style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src="https://maps.google.com/maps?q=Dama+Cafe+Gambettola+Via+Antonio+Gramsci+7&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            style={{ filter: 'invert(90%) hue-rotate(180deg)' }} // Dark mode map hack
                        ></iframe>
                    </div>

                </div>
            </div>
        </main>
    );
}
