import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <Link href="/" className={styles.logo}>
                    Dama Cafè
                </Link>
                <div className={styles.links}>
                    <Link href="/" className={styles.link}>
                        Giocate
                    </Link>
                    <Link href="/create" className={styles.link}>
                        Organizza
                    </Link>
                    <Link href="/contacts" className={styles.link}>
                        Contatti
                    </Link>
                </div>
            </div>
        </nav>
    );
}
