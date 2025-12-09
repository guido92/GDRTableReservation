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
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--surface)' }} />
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.system}>{session.system}</div>
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
