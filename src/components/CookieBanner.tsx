'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--border)',
            padding: '1rem',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
        }}>
            <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', width: '100%' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: 0, flex: 1 }}>
                    Questo sito utilizza cookie tecnici e di terze parti (Google Maps) per migliorare l'esperienza.
                    Continuando a navigare accetti l'uso dei cookie.
                    <Link href="/privacy" style={{ color: 'var(--primary)', marginLeft: '0.5rem', textDecoration: 'underline' }}>
                        Leggi la Privacy Policy
                    </Link>
                </p>
                <button
                    onClick={acceptCookies}
                    className="button-primary"
                    style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
                >
                    Accetto
                </button>
            </div>
        </div>
    );
}
