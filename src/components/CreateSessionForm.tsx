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

        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                    <label>{type === 'GDR' ? 'Titolo Avventura' : 'Nome Gioco'}</label>
                    <input name="title" required value={formData.title} onChange={handleChange} placeholder={type === 'GDR' ? "Es. La tomba degli orrori" : "Es. Catan, Ticket to Ride..."} />
                </div>
                {type === 'GDR' && (
                    <div className="form-group">
                        <label>Sistema di Gioco</label>
                        <input name="system" required value={formData.system} onChange={handleChange} placeholder="Es. D&D 5e" />
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                    <label>{type === 'GDR' ? 'Master' : 'Organizzatore'}</label>
                    <input name="masterName" required value={formData.masterName} onChange={handleChange} placeholder="Il tuo nome" />
                </div>
                <div className="form-group">
                    <label>Luogo</label>
                    <input name="location" required value={formData.location} onChange={handleChange} placeholder="Es. Tavolo 1" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                    <label>Data</label>
                    <input type="date" name="date" required value={formData.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Ora</label>
                    <input type="time" name="time" required value={formData.time} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Max Giocatori</label>
                    <input type="number" name="maxPlayers" min="1" max="10" required value={formData.maxPlayers} onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label>Immagine</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ flex: 1 }} />
                    {uploading && <span style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>Caricamento...</span>}
                </div>
                {formData.imageUrl && (
                    <div style={{ marginTop: '0.5rem', position: 'relative', width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <Image src={formData.imageUrl} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                )}
                <input type="hidden" name="imageUrl" value={formData.imageUrl} />
            </div>

            <div className="form-group">
                <label>Descrizione</label>
                <textarea name="description" required value={formData.description} onChange={handleChange} rows={5} placeholder={type === 'GDR' ? "Descrivi l'avventura..." : "Descrivi il gioco e il tipo di serata..."} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
                {loading ? 'Creazione...' : (type === 'GDR' ? 'Crea Sessione GDR' : 'Crea Tavolo Gioco')}
            </button>

            <style jsx>{`
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        label {
          font-size: 0.875rem;
          color: var(--foreground-muted);
        }
        input, textarea, select {
          padding: 0.75rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: rgba(0,0,0,0.2);
          color: var(--foreground);
          outline: none;
          font-family: inherit;
        }
        input:focus, textarea:focus {
          border-color: var(--primary);
        }
      `}</style>
        </form>
    );
}
