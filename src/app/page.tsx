import { getSessions } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import SessionCard from '@/components/SessionCard';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allSessions = await getSessions();

  // Filter expired sessions (keep today's sessions)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessions = allSessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= today;
  });

  sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main>
      <Navbar />

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-logos" style={{ marginBottom: '1.5rem' }}>
            <Image
              src="/damalogo.webp"
              alt="Dama Cafè"
              width={80}
              height={80}
              className="hero-logo-img"
              style={{ background: '#f5f0e8', width: '80px', height: '80px', border: '3px solid var(--brand-gold)' }}
              unoptimized
            />
          </div>

          <p style={{
            color: '#cfaa43',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            🎲 Nuovo Ritrovo GdR a Gambettola 🐉
          </p>

          <h1 className="hero-title" style={{ fontSize: '4rem' }}>
            Bar <span className="text-gradient">Dama Caffè</span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize: '1.2rem', maxWidth: '750px' }}>
            Il Bar Dama apre le porte alla community dei giochi di ruolo! <br />
            Stiamo creando un punto di ritrovo stabile a Gambettola (FC) per tutti gli appassionati, dai veterani ai neofiti.
          </p>

          <div className="hero-cta-row">
            <Link href="#progetto" className="btn btn-primary" style={{ padding: '1.1rem 3rem' }}>
              L&apos;Avventura Ti Aspetta
            </Link>
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Powered by La Taverna di Guido
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ========================================
          🎯 IL PROGETTO
          ======================================== */}
      <ScrollReveal>
        <section id="progetto" className="section" style={{ background: 'var(--background)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="section-title">
              🎯 Il <span className="gold-text">Progetto</span>
            </h2>
            <p className="section-subtitle">
              Un ambiente accogliente e inclusivo per condividere storie ed epiche avventure.
            </p>
            <div className="section-divider" />

            <div className="about-grid">
              <div className="about-card glass-panel">
                <div className="about-icon">📅</div>
                <h3>Serate Regolari</h3>
                <p>Ogni <strong>Venerdì sera</strong> ci ritroviamo per giocare e definire insieme i prossimi passi.</p>
              </div>

              <div className="about-card glass-panel">
                <div className="about-icon">🧱</div>
                <h3>D&D 5e & Oltre</h3>
                <p>Partiamo con D&D 5e, ma l&apos;idea è espandersi verso altri sistemi in base ai vostri interessi.</p>
              </div>

              <div className="about-card glass-panel">
                <div className="about-icon">🛡️</div>
                <h3>Tutti i Livelli</h3>
                <p>Che tu sia alla prima esperienza o un veterano, qui troverai il tuo tavolo ideale.</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================
          👥 CHI CERCHIAMO
          ======================================== */}
      <ScrollReveal>
        <section className="section" style={{ background: 'rgba(10, 5, 3, 0.5)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="section-title">
              👥 Chi <span className="text-gradient">Cerchiamo</span>
            </h2>
            <div className="section-divider" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎮 Giocatori</h3>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--foreground-muted)', lineHeight: 1.8 }}>
                  <li>✨ Voglia di divertirsi e condividere storie</li>
                  <li>🤝 Rispetto e collaborazione verso il tavolo</li>
                  <li>⏳ Un minimo di costanza</li>
                  <li style={{ marginTop: '1rem', color: 'white', fontWeight: 600 }}>Offriamo: supporto ai principianti e ambiente friendly.</li>
                </ul>
              </div>

              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🧙 Master</h3>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--foreground-muted)', lineHeight: 1.8 }}>
                  <li>📖 Passione per la narrazione</li>
                  <li>⚔️ Disponibilità a guidare sessioni</li>
                  <li>⭐ Esperienza gradita ma non obbligatoria</li>
                  <li style={{ marginTop: '1rem', color: 'white', fontWeight: 600 }}>Offriamo: giocatori motivati e spazio dedicato al Bar.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================
          📍 INFORMAZIONI & FAQ
          ======================================== */}
      <ScrollReveal>
        <section className="section" style={{ background: 'var(--background)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
              
              <div>
                <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2rem' }}>📍 Info <span className="gold-text">Rapide</span></h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem' }}>🏢</div>
                    <div><strong>Dove:</strong> Bar Dama Caffè – Gambettola (FC)</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem' }}>📅</div>
                    <div><strong>Quando:</strong> Ogni venerdì sera</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem' }}>📖</div>
                    <div><strong>Sistema:</strong> D&D 5e (per iniziare)</div>
                  </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                  <h3 className="gold-text" style={{ marginBottom: '1.5rem' }}>📬 Come Partecipare</h3>
                  <p style={{ color: 'var(--foreground-muted)', marginBottom: '2rem' }}>
                    Scrivici indicando il tuo ruolo (giocatore/master) e il livello di esperienza per definire i gruppi.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <a href="https://t.me/guido_92" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}>
                      Telegram @guido_92
                    </a>
                    <a href="https://wa.me/393936205946" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}>
                      WhatsApp 393 6205946
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2rem' }}>💬 <span className="text-gradient">FAQ</span></h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
                  <div>
                    <h4 className="gold-text">Non ho mai giocato?</h4>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>Nessun problema, ti guidiamo noi passo dopo passo.</p>
                  </div>
                  <div>
                    <h4 className="gold-text">Serve materiale?</h4>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>No, pensiamo a tutto noi per farti iniziare subito.</p>
                  </div>
                  <div>
                    <h4 className="gold-text">Altri sistemi?</h4>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>Sì, l&apos;idea è crescere ed espandere i sistemi di gioco.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================
          GALLERY
          ======================================== */}
      <ScrollReveal>
        <section className="section" style={{ background: 'rgba(10, 5, 3, 0.4)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="section-title">
              Le Nostre <span className="gold-text">Serate</span>
            </h2>
            <div className="section-divider" style={{ marginBottom: '2rem' }} />

            <div className="gallery-grid">
              <Image src="/dama1.webp" alt="Serata GDR al Dama Cafè" width={400} height={250} className="gallery-img gallery-img-large" unoptimized style={{ width: '100%', height: '100%' }} />
              <Image src="/dama2.webp" alt="Giocatori al tavolo" width={400} height={180} className="gallery-img" unoptimized style={{ width: '100%', height: '100%' }} />
              <Image src="/dama3.webp" alt="Evento dal vivo" width={400} height={180} className="gallery-img" unoptimized style={{ width: '100%', height: '100%' }} />
              <Image src="/dama4.webp" alt="Community in azione" width={400} height={180} className="gallery-img" unoptimized style={{ width: '100%', height: '100%', display: 'block' }} />
              <Image src="/dama5.webp" alt="Avventurieri al Dama Cafè" width={400} height={180} className="gallery-img" unoptimized style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================
          PROSSIME GIOCATE
          ======================================== */}
      <ScrollReveal>
        <section id="giocate" className="section" style={{ background: 'rgba(10, 5, 3, 0.4)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="section-title">
              Prossime <span className="text-gradient">Giocate</span>
            </h2>
            <p className="section-subtitle">
              Prenota il tuo posto al tavolo. Scegli la tua avventura e unisciti alla community.
            </p>
            <div className="section-divider" />

            <div className="sessions-grid">
              {sessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>

            {sessions.length === 0 && (
              <div className="glass-panel" style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                color: 'var(--foreground-muted)',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(207,170,67,0.3)" strokeWidth="1" style={{ margin: '0 auto 1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p style={{ fontWeight: 300, marginBottom: '1rem' }}>Nessuna giocata in programma al momento.</p>
                <p style={{ fontSize: '0.85rem', color: '#887766' }}>
                  Controlla più tardi o unisciti al nostro
                  <a href="https://chat.whatsapp.com/KQZOoeLaVNWJh2HtXNJCKV" target="_blank" rel="noopener noreferrer" style={{ color: '#cfaa43', fontWeight: 600 }}> gruppo WhatsApp</a> per restare aggiornato!
                </p>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/create" className="btn btn-secondary" style={{ padding: '1rem 2.5rem' }}>
                Organizza una Serata
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </main>
  );
}
