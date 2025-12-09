'use client';

import Navbar from '@/components/Navbar';
import CreateSessionForm from '@/components/CreateSessionForm';

export default function CreateBoardGamePage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '3rem 1rem', flex: 1 }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>
                    Nuovo Tavolo da Gioco
                </h1>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <CreateSessionForm type="BOARDGAME" />
                </div>
            </div>
        </main>
    );
}
