import Navbar from '@/components/Navbar';

export default function PrivacyPage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '3rem 1rem', flex: 1 }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                    Privacy & Cookie Policy
                </h1>

                <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>1. Titolare del Trattamento</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--foreground-muted)' }}>
                            Il titolare del trattamento dei dati è <strong>Dama Cafè</strong>, situato in Via Antonio Gramsci 7, 47035 Gambettola (FC).
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>2. Dati Raccolti</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--foreground-muted)' }}>
                            Raccogliamo esclusivamente i dati necessari per la prenotazione delle sessioni di gioco:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--foreground-muted)' }}>
                            <li>Nome o Nickname (fornito volontariamente dall'utente).</li>
                            <li>Eventuali note aggiuntive inserite in fase di prenotazione.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>3. Finalità e Conservazione</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--foreground-muted)' }}>
                            I dati vengono utilizzati al solo scopo di organizzare i tavoli da gioco.
                            <br /><br />
                            <strong>Cancellazione Automatica:</strong> I dati relativi alle sessioni e ai partecipanti vengono cancellati automaticamente dai nostri sistemi 7 giorni dopo la data dell'evento.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>4. Cookie</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--foreground-muted)' }}>
                            Questo sito utilizza:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--foreground-muted)' }}>
                            <li><strong>Cookie Tecnici:</strong> Necessari per il funzionamento del sito (es. preferenze di navigazione).</li>
                            <li><strong>Cookie di Terze Parti:</strong> Google Maps (per visualizzare la mappa nella pagina Contatti) potrebbe installare cookie di profilazione o statistica.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>5. Diritti dell'Utente</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--foreground-muted)' }}>
                            Gli utenti possono richiedere in qualsiasi momento la cancellazione dei propri dati contattando il Dama Cafè o tramite la pagina Contatti.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
