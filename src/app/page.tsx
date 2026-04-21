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
    if (!session.date) return false; // Skip sessions with missing dates on home
    const sessionDate = new Date(session.date);
    if (isNaN(sessionDate.getTime())) return false;
    return sessionDate >= today;
  });

  sessions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateA - dateB;
  });

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
          <div className="hero-logos" style={{ marginBottom: '2.5rem' }}>
            <a 
              href="https://www.instagram.com/damacaffegambettola/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hero-logo-link"
              style={{ display: 'inline-block' }}
            >
              <Image
                src="/damalogo.webp"
                alt="Dama Cafè Instagram"
                width={110}
                height={110}
                className="hero-logo-img"
                style={{ 
                  background: 'rgba(207, 170, 67, 0.05)', 
                  width: '110px', 
                  height: '110px', 
                  border: '3px solid var(--brand-gold)',
                  filter: 'drop-shadow(0 0 20px var(--brand-gold-glow))',
                  transition: 'transform 0.3s ease'
                }}
                unoptimized
              />
            </a>
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
            🎲 GdR & Board Games a Gambettola 🐉
          </p>

          <h1 className="hero-title" style={{ fontSize: '4rem' }}>
            Bar <span className="text-gradient">Dama Caffè</span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize: '1.2rem', maxWidth: '750px' }}>
            Il tuo nuovo punto di riferimento per il gioco a Gambettola. <br />
            Unisciti a una community crescente di appassionati di GdR e Board Games: ogni venerdì ci troviamo per socializzare e far partire nuovi tavoli.
          </p>

          <div className="hero-cta-row">
            <Link href="#giocate" className="btn btn-primary" style={{ padding: '1.1rem 3rem' }}>
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
                  Controlla più tardi o scrivici per organizzare una nuova serata!
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
              Uno spazio aperto dove i giochi di ruolo e da tavolo diventano un&apos;occasione per incontrarsi e condividere passioni.
            </p>
            <div className="section-divider" />

            <div className="about-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="about-card glass-panel">
                <div className="about-icon">📅</div>
                <h3>Serate Regolari</h3>
                <p>Nessun impegno fisso, solo voglia di giocare. Ogni venerdì è l&apos;occasione giusta per trovare un tavolo o proporre qualcosa di nuovo.</p>
              </div>

              <div className="about-card glass-panel">
                <div className="about-icon">⚔️</div>
                <h3>GdR & D&D</h3>
                <p>Dalle sessioni di D&D alle ultime novità indie. Una community di giocatori e master sempre pronta ad accogliere nuovi partecipanti.</p>
              </div>

              <div className="about-card glass-panel">
                <div className="about-icon">♟️</div>
                <h3>Board Games</h3>
                <p>Strategia, party games o classici intramontabili. Puoi portare i tuoi titoli da casa o unirti alle partite già aperte.</p>
              </div>

              <div className="about-card glass-panel">
                <div className="about-icon">🤝</div>
                <h3>Area Aperta</h3>
                <p>L&apos;atmosfera è informale e aperta a tutti. Non importa se sei un esperto o alla prima partita: qui l&apos;importante è divertirsi.</p>
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

            <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '3rem', 
                    alignItems: 'start' 
                }}>
              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎮 Giocatori</h3>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--foreground-muted)', lineHeight: 1.8 }}>
                  <li>✨ Voglia di staccare la spina e socializzare</li>
                  <li>🤝 Curiosità e spirito di gruppo al tavolo</li>
                  <li>⏳ Nessuna esperienza pregressa richiesta</li>
                  <li style={{ marginTop: '1rem', color: 'white', fontWeight: 600 }}>Chiunque abbia voglia di passare una serata diversa è il benvenuto.</li>
                </ul>
              </div>

              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <h3 className="gold-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🧙 Iniziativa</h3>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--foreground-muted)', lineHeight: 1.8 }}>
                  <li>📖 Passione per proporre titoli nuovi</li>
                  <li>⚔️ Voglia di spiegare regole o masterizzare</li>
                  <li>⭐ Disponibilità a portare i propri giochi</li>
                  <li style={{ marginTop: '1rem', color: 'white', fontWeight: 600 }}>Il Dama mette lo spazio e il supporto, tu ci metti l&apos;idea.</li>
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
                    <div><strong>Dove:</strong> Bar Dama Caffè – Via Antonio Gramsci 7, Gambettola (FC)</div>
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

                {/* Google Maps Snippet */}
                <div className="glass-panel" style={{ marginTop: '2rem', padding: '0.5rem', overflow: 'hidden', height: '220px' }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2864.280900428393!2d12.338899900000001!3d44.1188279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132cbb001c641bcd%3A0x371eb0486400d262!2sDama%20caff%C3%A8!5e0!3m2!1sit!2sit!4v1776671048810!5m2!1sit!2sit" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, borderRadius: '8px', filter: 'invert(90%) hue-rotate(180deg) opacity(0.8)' }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                <div style={{ marginTop: '3rem' }}>
                  <h3 className="gold-text" style={{ marginBottom: '1.5rem' }}>📬 Come Partecipare</h3>
                  <p style={{ color: 'var(--foreground-muted)', marginBottom: '2rem' }}>
                    Scrivici indicando il tuo ruolo (giocatore/master) e il livello di esperienza per definire i gruppi.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <a href="https://t.me/guido_92" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.7rem 1.25rem', fontSize: '0.75rem', flex: 1, whiteSpace: 'nowrap' }}>
                      Telegram
                    </a>
                    <a href="https://chat.whatsapp.com/KQZOoeLaVNWJh2HtXNJCKV" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.7rem 1.25rem', fontSize: '0.75rem', flex: 1, whiteSpace: 'nowrap' }}>
                      WhatsApp
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
                    <h4 className="gold-text">Posso portare i miei giochi?</h4>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>Assolutamente sì! Anzi, ti incoraggiamo a proporre i tuoi titoli preferiti.</p>
                  </div>
                  <div>
                    <h4 className="gold-text">Organizzate voi tutto?</h4>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>Noi diamo lo spazio e il supporto, ma chiunque può farsi avanti per masterizzare o spiegare un gioco.</p>
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

    </main>
  );
}
