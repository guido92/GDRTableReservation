import Navbar from '@/components/Navbar';
import CreateSessionForm from '@/components/CreateSessionForm';

export default function CreatePage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '3rem 1rem', flex: 1, maxWidth: '800px' }}>
                <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                        Organizza una Giocata
                    </h1>
                    <p style={{ color: 'var(--foreground-muted)' }}>
                        Compila il modulo per creare un nuovo tavolo e invitare giocatori.
                    </p>
                </header>
                <CreateSessionForm />
            </div>
        </main>
    );
}
