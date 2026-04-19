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
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #150a06, #1a0f0a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(207,170,67,0.2)" strokeWidth="1">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                )}
            </div>
            <div className={styles.content}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div className={styles.system}>{session.system}</div>
                    <span className={`${styles.typeBadge} ${session.type === 'BOARDGAME' ? styles.typeBadgeBoard : styles.typeBadgeGdr}`}>
                        {session.type === 'BOARDGAME' ? '🎲 Board' : '🐉 GDR'}
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
                    <Link href={`/session/${session.id}`} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1.25rem', letterSpacing: '1px' }}>
                        {isFull ? 'Dettagli' : 'Partecipa'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
