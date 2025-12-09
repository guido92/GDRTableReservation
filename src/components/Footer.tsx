'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border)',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ padding: '3rem 1rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {/* Logo & Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                                <Image src="/logo.jpg" alt="Dama Cafè Logo" fill style={{ objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '1.25rem' }} className="text-gradient">Tavoli GDR</span>
                        </div>
                        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                            La piattaforma per gestire le tue serate di gioco di ruolo e da tavolo al Dama Cafè.
                        </p>
                    </div>

                    {/* Contatti */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontWeight: 600, color: 'var(--foreground)' }}>Dove Siamo</h3>
                        <address style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', fontStyle: 'normal', lineHeight: '1.6' }}>
                            <strong>Dama Cafè</strong><br />
                            Via Antonio Gramsci 7<br />
                            47035 Gambettola (FC)
                        </address>
                    </div>

                    {/* Social */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontWeight: 600, color: 'var(--foreground)' }}>Seguici</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="https://www.facebook.com/profile.php?id=61572923820400" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#1877F2'} onMouseOut={e => e.currentTarget.style.color = 'var(--foreground-muted)'}>
                                Facebook
                            </a>
                            <a href="https://www.instagram.com/damacaffegambettola/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#E4405F'} onMouseOut={e => e.currentTarget.style.color = 'var(--foreground-muted)'}>
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '3rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border)',
                    textAlign: 'center',
                    color: 'var(--foreground-muted)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center'
                }}>
                    <div>
                        &copy; {new Date().getFullYear()} Tavoli GDR - Dama Cafè. Tutti i diritti riservati.
                    </div>
                    <Link href="/privacy" style={{ color: 'var(--foreground-muted)', textDecoration: 'underline' }}>
                        Privacy & Cookie Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
