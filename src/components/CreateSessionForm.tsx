'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateSessionForm({ type }: { type: 'GDR' | 'BOARDGAME' }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        system: type === 'BOARDGAME' ? 'Board Game' : '',
        masterName: '',
        masterEmail: '',
        date: '',
        time: '',
        maxPlayers: 4,
        description: '',
        location: '',
        imageUrl: '',
        type: type
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(`[Form Change] ${name} = ${value}`);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) throw new Error('Upload failed');

            const { url } = await res.json();
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Errore durante il caricamento dell\'immagine');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.date || !formData.time) {
            alert('Per favore, seleziona una data e un orario validi.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/session/${data.id}`);
                router.refresh();
            } else {
                const errorData = await res.json().catch(() => ({ error: 'Errore sconosciuto' }));
                console.error('[CreateSessionForm] Errore creazione sessione:', errorData);
                alert(`Errore nella creazione della sessione: ${errorData.error || 'Errore sconosciuto'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Errore di connessione. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit} className="glass-panel" style={{ 
                padding: '3rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '2rem',
                background: 'rgba(10, 5, 3, 0.96)',
                border: '1px solid rgba(207, 170, 67, 0.3)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                borderRadius: '16px'
            }}>
                {/* Header Form */}
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    <h2 className="gold-text" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        {type === 'GDR' ? 'Nuova Sessione GDR' : 'Nuovo Tavolo Boardgame'}
                    </h2>
                    <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '400', opacity: 0.9 }}>
                        Compila i dettagli per pubblicare la tua partita al Bar Dama
                    </p>
                </div>

                {/* Grid Dati Principali */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '2rem' 
                }}>
                    <div className="form-group">
                        <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {type === 'GDR' ? 'Titolo Avventura' : 'Nome Gioco'}
                        </label>
                        <input 
                            name="title" 
                            required 
                            value={formData.title} 
                            onChange={handleChange} 
                            className="form-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px' }}
                            placeholder={type === 'GDR' ? "Es. La tomba degli orrori" : "Es. Catan, Ticket to Ride..."} 
                        />
                    </div>
                    {type === 'GDR' && (
                        <div className="form-group">
                            <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Sistema di Gioco</label>
                            <input 
                                name="system" 
                                required 
                                value={formData.system} 
                                onChange={handleChange} 
                                className="form-input"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px' }}
                                placeholder="Es. D&D 5e, Pathfinder" 
                            />
                        </div>
                    )}
                </div>

                {/* Grid Organizzazione */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '2rem' 
                }}>
                    <div className="form-group">
                        <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {type === 'GDR' ? 'Il Tuo Nome (Master)' : 'Organizzatore'}
                        </label>
                        <input 
                            name="masterName" 
                            required 
                            value={formData.masterName} 
                            onChange={handleChange} 
                            className="form-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px' }}
                            placeholder="Il tuo nome" 
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email di Contatto</label>
                        <input 
                            type="email" 
                            name="masterEmail" 
                            required 
                            value={formData.masterEmail || ''} 
                            onChange={handleChange} 
                            className="form-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px' }}
                            placeholder="tua@email.com" 
                        />
                    </div>
                </div>

                {/* Grid Logistica */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '2rem' 
                }}>
                    <div className="form-group">
                        <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Data</label>
                        <input 
                            type="date" 
                            name="date" 
                            required 
                            value={formData.date} 
                            onChange={handleChange} 
                            className="form-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Ora di Inizio</label>
                        <input 
                            type="time" 
                            name="time" 
                            required 
                            value={formData.time} 
                            onChange={handleChange} 
                            className="form-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Max Giocatori</label>
                        <input 
                            type="number" 
                            name="maxPlayers" 
                            min="1" 
                            max="10" 
                            required 
                            value={formData.maxPlayers} 
                            onChange={handleChange} 
                            className="form-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Luogo (Tavolo / Area)</label>
                    <input 
                        name="location" 
                        required 
                        value={formData.location} 
                        onChange={handleChange} 
                        className="form-input"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px' }}
                        placeholder="Es. Tavolo 1, Area Divanetti..." 
                    />
                </div>

                <div className="form-group">
                    <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Immagine di Copertina</label>
                    <div style={{ 
                        border: '2px dashed rgba(207, 170, 67, 0.3)', 
                        borderRadius: '8px',
                        padding: '2.5rem',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brand-gold)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(207, 170, 67, 0.3)'}
                    onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        <input 
                            id="file-upload"
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            disabled={uploading} 
                            style={{ display: 'none' }} 
                        />
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🖼️</div>
                        <p style={{ color: uploading ? 'var(--brand-gold)' : 'white', margin: 0, fontWeight: 500 }}>
                            {uploading ? 'Caricamento in corso...' : 'Trascina o clicca per caricare un\'immagine'}
                        </p>
                    </div>
                    {formData.imageUrl && (
                        <div style={{ 
                            marginTop: '1.5rem', 
                            position: 'relative', 
                            width: '100%', 
                            height: '300px', 
                            borderRadius: '12px', 
                            overflow: 'hidden',
                            border: '2px solid rgba(207, 170, 67, 0.5)'
                        }}>
                            <Image src={formData.imageUrl} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label style={{ color: 'var(--brand-gold)', fontWeight: 600, marginBottom: '0.6rem', display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Breve Descrizione</label>
                    <textarea 
                        name="description" 
                        required 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows={6} 
                        className="form-input"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(207, 170, 67, 0.2)', padding: '1rem', borderRadius: '4px', fontSize: '1rem' }}
                        placeholder={type === 'GDR' ? "Di cosa parla l'avventura? Serve portare qualcosa?" : "Descrivi il gioco e il tipo di serata..."} 
                    />
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading || uploading} 
                        style={{ width: '100%', padding: '1.4rem', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}
                    >
                        {loading ? 'CREAZIONE IN CORSO...' : (type === 'GDR' ? 'PUBBLICA SESSIONE GDR' : 'PUBBLICA TAVOLO GIOCO')}
                    </button>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '1.2rem' }}>
                        La partita sarà pubblicata immediatamente e apparirà nella homepage del Bar Dama.
                    </p>
                </div>
            </form>
        </div>
    );
}
