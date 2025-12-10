'use client';

import { useState } from 'react';
import { Session } from '@/types';
import { useRouter } from 'next/navigation';

export default function JoinSessionForm({ session }: { session: Session }) {
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
                body: JSON.stringify({ player: { id: crypto.randomUUID(), name, contactInfo, notes } }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to join');
            }

            router.refresh();
            setName('');
            setContactInfo('');
            setNotes('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
