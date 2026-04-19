'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid rgba(207, 170, 67, 0.15)',
            background: '#000',
            position: 'relative',
            zIndex: 10,
        }}>
            {/* Top gold line glow */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '600px',
                height: '1px',
                background: 'rgba(207, 170, 67, 0.3)',
                boxShadow: '0 0 60px 20px rgba(207, 170, 67, 0.08)',
            }} />

            <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '2.5rem',
                    alignItems: 'start'
                }}>
                    {/* Logo & Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', filter: 'drop-shadow(0 0 10px rgba(207,170,67,0.4))', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--brand-gold)' }}>
                                <Image src="/damalogo.webp" alt="Bar Dama" width={32} height={32} unoptimized />
                            </div>
                            <div>
                                <span style={{
                                    fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    color: 'white',
                                    letterSpacing: '1px'
                                }}>Dama Caffè</span>
                                <div style={{
                                    fontSize: '0.6rem',
                                    color: 'rgba(207,170,67,0.5)',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                }}>Powered by La Taverna di Guido</div>
                            </div>
                        </div>
                        <p style={{
                            color: '#887766',
                            fontSize: '0.85rem',
                            lineHeight: '1.7',
                            fontWeight: 300,
                            maxWidth: '300px'
                        }}>
                            Serate di giochi di ruolo e da tavolo dal vivo al Dama Cafè di Gambettola. Un progetto nato dalla passione per il GDR.
                        </p>
                    </div>

                    {/* Dove siamo */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h3 style={{
                            fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                            fontWeight: 700,
                            color: 'white',
                            fontSize: '0.9rem',
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}>Dove Siamo</h3>
                        <address style={{
                            color: '#bbaa99',
                            fontSize: '0.85rem',
                            fontStyle: 'normal',
                            lineHeight: '1.7',
                            fontWeight: 300,
                        }}>
                            <strong style={{ color: '#cfaa43' }}>Dama Cafè</strong><br />
                            Via Antonio Gramsci 7<br />
                            47035 Gambettola (FC)
                        </address>
                    </div>

                    {/* Social & Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h3 style={{
                            fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                            fontWeight: 700,
                            color: 'white',
                            fontSize: '0.9rem',
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}>Seguici</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { href: 'https://chat.whatsapp.com/KQZOoeLaVNWJh2HtXNJCKV', label: 'WhatsApp', icon: '💬' },
                                { href: 'https://www.facebook.com/profile.php?id=61572923820400', label: 'Facebook', icon: '📘' },
                                { href: 'https://www.instagram.com/damacaffegambettola/', label: 'Instagram', icon: '📷' },
                                { href: 'https://discord.gg/cXbKzYtFmP', label: 'Discord — La Taverna', icon: '🎮' },
                            ].map(({ href, label, icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: '#887766',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s ease',
                                        fontSize: '0.85rem',
                                        fontWeight: 400,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                    }}
                                    onMouseOver={e => (e.currentTarget.style.color = '#cfaa43')}
                                    onMouseOut={e => (e.currentTarget.style.color = '#887766')}
                                >
                                    <span>{icon}</span> {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{
                    marginTop: '2.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(207, 170, 67, 0.08)',
                    textAlign: 'center',
                    color: '#554433',
                    fontSize: '0.7rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center',
                    letterSpacing: '1px',
                }}>
                    <div>
                        © {new Date().getFullYear()} Dama Cafè × La Taverna di Guido. Un progetto di passione.
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/privacy" style={{ color: '#554433', textDecoration: 'underline', transition: 'color 0.3s' }}>
                            Privacy & Cookie
                        </Link>
                        <a href="https://latavernadiguido.it" target="_blank" rel="noopener noreferrer" style={{ color: '#554433', textDecoration: 'underline', transition: 'color 0.3s' }}>
                            latavernadiguido.it
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
