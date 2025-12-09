import Link from 'next/link';
import Image from 'next/image';
import { Session } from '@/types';
import styles from './SessionCard.module.css';
import { formatDate } from '@/lib/utils';

interface SessionCardProps {
    session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
    const isFull = session.currentPlayers.length >= session.maxPlayers;
    const spotsLeft = session.maxPlayers - session.currentPlayers.length;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {session.imageUrl ? (
                    <Image
                        src={session.imageUrl}
                        alt={session.title}
                        fill
                        className={styles.image}
                        unoptimized
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--surface)' }} />
                )}
            </div>
            <div className={styles.content}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div className={styles.system}>{session.system}</div>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '999px',
                        background: session.type === 'BOARDGAME' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: session.type === 'BOARDGAME' ? '#f472b6' : '#60a5fa',
                        border: `1px solid ${session.type === 'BOARDGAME' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                    }}>
                        {session.type === 'BOARDGAME' ? '🎲 BOARD' : '🐉 GDR'}
                    </span>
                </div>
                <h3 className={styles.title}>{session.title}</h3>

                <div className={styles.details}>
                    <span className={styles.detailItem}>📅 {formatDate(session.date)}</span>
                    <span className={styles.detailItem}>⏰ {session.time}</span>
                    <span className={styles.detailItem}>📍 {session.location}</span>
                </div>

                <p className={styles.description}>{session.description}</p>

                <div className={styles.footer}>
                    <div className={`${styles.players} ${isFull ? styles.playersFull : styles.playersOpen}`}>
                        {isFull ? 'Tavolo Completo' : `${spotsLeft} posti liberi`}
                    </div>
                    <Link href={`/session/${session.id}`} className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        {isFull ? 'Dettagli' : 'Partecipa'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
