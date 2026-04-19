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
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <div className="about-icon" style={{ margin: '0 auto 1.5rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h3 className="gold-text" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Iscrizione Confermata!</h3>
                <p style={{ color: 'var(--foreground-muted)', marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.6 }}>
                    Benvenuto al tavolo, {name}! <br />
                    Riceverai un&apos;email di conferma tra pochi istanti.
                </p>

                <div style={{ padding: '1.5rem', background: 'rgba(207, 170, 67, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(207, 170, 67, 0.1)', marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'white' }}>Ti serve una scheda?</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)', marginBottom: '1.25rem' }}>
                        Usa il nostro generatore AI per creare un personaggio D&D 5e in pochi secondi.
                    </p>
                    <Link href="/dnd/create" className="btn btn-primary" style={{ width: '100%', fontSize: '0.75rem' }}>
                        Crea Personaggio (D&D 5e)
                    </Link>
                </div>

                <button
                    onClick={() => setJoined(false)}
                    style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem', textDecoration: 'underline', opacity: 0.6 }}
                >
                    Torna ai dettagli della serata
                </button>
            </div>
        );
    }

    if (isFull) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
                <h3 style={{ color: '#ec4899', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tavolo Completo</h3>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>
                    Spiacenti, tutti i posti sono stati occupati. <br />
                    Controlla le altre giocate disponibili!
                </p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="gold-text" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Prenota Posto</h3>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {error && (
                    <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}

                <div className="form-group">
                    <label>Il Tuo Nome</label>
                    <input
                        type="text"
                        placeholder="Es. Mario Rossi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email (per conferma)</label>
                    <input
                        type="email"
                        placeholder="mario@esempio.it"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contatto Rapido (WA/IG)</label>
                    <input
                        type="text"
                        placeholder="@username o cellulare"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Note per il Master (Opzionale)</label>
                    <textarea
                        placeholder="Link alla scheda, razza/classe, allergie..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                    {loading ? 'Elaborazione...' : 'Conferma Presenza'}
                </button>
                <p style={{ fontSize: '0.7rem', color: 'var(--foreground-muted)', textAlign: 'center', opacity: 0.6, lineHeight: 1.4 }}>
                    Prenotando accetti di partecipare alla sessione dal vivo al Dama Cafè. In caso di impedimenti, avvisa il master!
                </p>
            </form>
        </div>
    );
}
