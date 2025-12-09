'use client';

import { useState, useEffect, Suspense } from 'react';
import { Session } from '@/types';
import Navbar from '@/components/Navbar';
import { formatDate } from '@/lib/utils';

function AdminContent() {
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded PIN for MVP
        if (pin === '1234') {
            setIsAuthenticated(true);
            fetchSessions();
        } else {
            alert('PIN errato');
        }
    };

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sessions');
            const data = await res.json();
            // Sort by date descending (newest first)
            data.sort((a: Session, b: Session) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setSessions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Sei sicuro di voler eliminare questa giocata?')) return;

        try {
            const res = await fetch(`/api/sessions/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setSessions(sessions.filter(s => s.id !== id));
            } else {
                alert('Errore durante l\'eliminazione');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '3rem 1rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h1>
                    <input
                        type="password"
                        placeholder="Inserisci PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--foreground)',
                            marginBottom: '1rem'
                        }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Accedi</button>
                </form>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '3rem 1rem', flex: 1 }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
                Gestione Sessioni
            </h1>

            {loading ? (
                <p>Caricamento...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sessions.map(session => {
                        const isExpired = new Date(session.date) < new Date(new Date().setHours(0, 0, 0, 0));
                        return (
                            <div key={session.id} className="glass-panel" style={{ padding: '1.5rem', opacity: isExpired ? 0.7 : 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{session.title}</h3>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>
                                            {formatDate(session.date)} - {session.masterName} {isExpired && <span style={{ color: 'var(--secondary)', fontWeight: 'bold', marginLeft: '0.5rem' }}>(SCADUTA)</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(session.id)}
                                        className="btn"
                                        style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                    >
                                        Elimina Sessione
                                    </button>
                                </div>

                                {/* Player List */}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground-muted)' }}>
                                        Giocatori ({session.currentPlayers.length}/{session.maxPlayers})
                                    </h4>
                                    {session.currentPlayers.length > 0 ? (
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {session.currentPlayers.map(player => (
                                                <li key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                                                    <span>{player.name} {player.notes && <span style={{ opacity: 0.7 }}>({player.notes})</span>}</span>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm(`Rimuovere ${player.name}?`)) return;
                                                            try {
                                                                const res = await fetch(`/api/sessions/${session.id}/players/${player.id}`, { method: 'DELETE' });
                                                                if (res.ok) {
                                                                    setSessions(sessions.map(s => s.id === session.id ? { ...s, currentPlayers: s.currentPlayers.filter(p => p.id !== player.id) } : s));
                                                                } else {
                                                                    alert('Errore durante la rimozione');
                                                                }
                                                            } catch (e) {
                                                                console.error(e);
                                                            }
                                                        }}
                                                        style={{ color: '#fca5a5', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
                                                    >
                                                        Rimuovi
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>Nessun giocatore iscritto.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {sessions.length === 0 && <p>Nessuna sessione trovata.</p>}
                </div>
            )}
        </div>
    );
}

export default function AdminPage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Suspense fallback={<div className="container" style={{ padding: '3rem' }}>Caricamento...</div>}>
                <AdminContent />
            </Suspense>
        </main>
    );
}
