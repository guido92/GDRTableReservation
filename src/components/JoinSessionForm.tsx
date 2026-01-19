'use client';

import { useState } from 'react';
import { Session } from '@/types';
import { useRouter } from 'next/navigation';

export default function JoinSessionForm({ session }: { session: Session }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [joined, setJoined] = useState(false);
    const router = useRouter();

    const isFull = session.currentPlayers.length >= session.maxPlayers;

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/sessions/${session.id}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player: { id: crypto.randomUUID(), name, email, contactInfo, notes } }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to join');
            }

            router.refresh();
            setJoined(true); // Switch to success view
            setName('');
            setEmail('');
            setContactInfo('');
            setNotes('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (joined) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Iscrizione Confermata!</h3>
                <p style={{ color: 'var(--foreground-muted)', marginBottom: '2rem' }}>
                    Ti sei unito al tavolo con successo.
                </p>

                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Ti serve una scheda?</h4>
                <a
                    href="/dnd/create"
                    className="btn btn-primary"
                    style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                    Crea Personaggio (D&D 5e)
                </a>
                <button
                    onClick={() => setJoined(false)}
                    style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', textDecoration: 'underline' }}
                >
                    Torna ai dettagli
                </button>
            </div>
        );
    }

    if (isFull) {
        return (
            <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--secondary)', color: 'var(--secondary)', textAlign: 'center' }}>
                Tavolo Completo
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Prenota il tuo posto</h3>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {error && <div style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>{error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>Nome Giocatore</label>
                    <input
                        type="text"
                        placeholder="Inserisci il tuo nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--foreground)',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>Email Giocatore (per conferme)</label>
                    <input
                        type="email"
                        placeholder="tua@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--foreground)',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>Contatto (Cellulare/Instagram/Email)</label>
                    <input
                        type="text"
                        placeholder="Per avvisarti in caso di problemi"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                        style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--foreground)',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>Note / Link Scheda (Opzionale)</label>
                    <textarea
                        placeholder="Preferenze, link alla scheda, ecc."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--foreground)',
                            outline: 'none',
                            width: '100%',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Registrazione...' : 'Conferma Presenza'}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', textAlign: 'center' }}>
                    Prenotando accetti di partecipare alla sessione.
                </p>
            </form>
        </div>
    );
}
