'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route navigation
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink} onClick={closeMenu}>
                    <div className={styles.logoIcon} style={{ background: '#f5f0e8', borderRadius: '50%', padding: '2px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--brand-gold)' }}>
                        <Image
                            src="/damalogo.webp"
                            alt="Bar Dama"
                            width={32}
                            height={32}
                            className={styles.logoImg}
                            unoptimized
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={styles.logoText}>Dama Caffè</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--brand-gold)', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1, marginTop: '2px', fontWeight: 700 }}>Ritrovo GdR</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.desktopLinks}>
                    <Link href="/#giocate" className={styles.link}>Giocate</Link>
                    <Link href="/create" className={styles.link}>Organizza</Link>
                    <Link href="/dnd/create" className={styles.link}>Schede D&D</Link>
                    <Link href="/contacts" className={styles.link}>Contatti</Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Apri menu di navigazione"
                >
                    <span className={styles.hamburgerLine}></span>
                    <span className={styles.hamburgerLine}></span>
                    <span className={styles.hamburgerLine}></span>
                </button>
            </nav>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
                <Link href="/#giocate" className={styles.mobileLink} onClick={() => { closeMenu(); window.location.hash = 'giocate'; }}>
                    <svg className={styles.mobileLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Prossime Giocate
                </Link>
                <Link href="/create" className={styles.mobileLink} onClick={closeMenu}>
                    <svg className={styles.mobileLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Organizza Serata
                </Link>
                <Link href="/dnd/create" className={styles.mobileLink} onClick={closeMenu}>
                    <svg className={styles.mobileLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Schede D&D
                </Link>
                <Link href="/contacts" className={styles.mobileLink} onClick={closeMenu}>
                    <svg className={styles.mobileLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Contatti
                </Link>
                <div className={styles.mobileDivider}></div>
                <a
                    href="https://discord.gg/cXbKzYtFmP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mobileCta}
                    onClick={closeMenu}
                >
                    Entra nella Taverna
                </a>
            </div>
        </header>
    );
}
