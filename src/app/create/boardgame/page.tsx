'use client';

import Navbar from '@/components/Navbar';
import CreateSessionForm from '@/components/CreateSessionForm';

export default function CreateBoardgamePage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <div className="hero-compact" style={{ paddingBottom: '2rem' }}>
                <div className="hero-bg" style={{ backgroundImage: "url('/dama3.webp')", opacity: 0.2 }} />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Nuovo Tavolo Boardgame
                    </h1>
                    <p style={{ color: 'var(--foreground-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', fontWeight: 300 }}>
                        Trova compagni di gioco per la tua serata al Dama Cafè.
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '0 1rem 5rem', flex: 1 }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <CreateSessionForm type="BOARDGAME" />
                </div>
            </div>
        </main>
    );
}
