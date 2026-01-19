'use client';

import { useState, useEffect, Suspense } from 'react';
import { Session } from '@/types';
import Navbar from '@/components/Navbar';
import { formatDate } from '@/lib/utils';
import { Edit, X } from 'lucide-react';

function AdminContent() {
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);

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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSession) return;

        try {
            const res = await fetch(`/api/sessions/${editingSession.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingSession)
            });

            if (res.ok) {
                alert('Sessione aggiornata con successo!');
                setEditingSession(null);
                fetchSessions(); // Refresh list
            } else {
                alert('Errore durante l\'aggiornamento');
            }
        } catch (error) {
            console.error(error);
            alert('Errore di rete');
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
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setEditingSession(session)}
                                            className="btn"
                                            style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.5rem' }}
                                            title="Modifica"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(session.id)}
                                            className="btn"
                                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem' }}
                                            title="Elimina"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Player List */}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground-muted)' }}>
                                        Giocatori ({session.currentPlayers.length}/{session.maxPlayers})
                                    </h4>
                                    {session.currentPlayers.length > 0 ? (
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {session.currentPlayers.map(player => (
                                                <li key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '4px' }}>
                                                    <div>
                                                        <span style={{ fontWeight: 600, display: 'block' }}>{player.name}</span>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: '0.25rem' }}>
                                                            {player.contactInfo ? (
                                                                <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>📞 {player.contactInfo}</span>
                                                            ) : (
                                                                <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>Nessun contatto</span>
                                                            )}
                                                            {player.notes && <span style={{ fontStyle: 'italic' }}>📝 {player.notes}</span>}
                                                        </div>
                                                    </div>
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

            {/* Edit Modal */}
            {editingSession && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 50,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
                }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Modifica Sessione</h2>
                            <button onClick={() => setEditingSession(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Titolo</label>
                                <input
                                    type="text"
                                    value={editingSession.title}
                                    onChange={e => setEditingSession({ ...editingSession, title: e.target.value })}
                                    className="input-field"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Master</label>
                                    <input
                                        type="text"
                                        value={editingSession.masterName}
                                        onChange={e => setEditingSession({ ...editingSession, masterName: e.target.value })}
                                        className="input-field"
                                        required
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Sistema</label>
                                    <input
                                        type="text"
                                        value={editingSession.system}
                                        onChange={e => setEditingSession({ ...editingSession, system: e.target.value })}
                                        className="input-field"
                                        required
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Data</label>
                                    <input
                                        type="date"
                                        value={editingSession.date}
                                        onChange={e => setEditingSession({ ...editingSession, date: e.target.value })}
                                        className="input-field"
                                        required
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Ora</label>
                                    <input
                                        type="time"
                                        value={editingSession.time}
                                        onChange={e => setEditingSession({ ...editingSession, time: e.target.value })}
                                        className="input-field"
                                        required
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Luogo</label>
                                    <input
                                        type="text"
                                        value={editingSession.location}
                                        onChange={e => setEditingSession({ ...editingSession, location: e.target.value })}
                                        className="input-field"
                                        required
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Max Giocatori</label>
                                    <input
                                        type="number"
                                        value={editingSession.maxPlayers}
                                        onChange={e => setEditingSession({ ...editingSession, maxPlayers: parseInt(e.target.value) })}
                                        className="input-field"
                                        required
                                        min={1}
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Descrizione</label>
                                <textarea
                                    value={editingSession.description}
                                    onChange={e => setEditingSession({ ...editingSession, description: e.target.value })}
                                    className="input-field"
                                    required
                                    rows={4}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                                Salva Modifiche
                            </button>
                        </form>
                    </div>
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
