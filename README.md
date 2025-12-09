# Tavoli GDR - Piattaforma di Prenotazione

Questa è una web app per gestire le serate di giochi di ruolo e da tavolo.

## Funzionalità

- **Home Page**: Visualizza tutte le giocate in programma.
- **Dettagli Sessione**: Vedi i dettagli di una giocata (Master, Sistema, Orario, Partecipanti).
- **Prenotazione**: I giocatori possono registrarsi a una giocata (con nome e note opzionali).
- **Creazione Tavolo**: I master possono creare nuove giocate.
- **Mobile Friendly**: Ottimizzato per l'uso da smartphone.

## Tecnologie

- Next.js (App Router)
- TypeScript
- CSS Modules (Design personalizzato "Glassmorphism")
- Persistenza dati su file JSON locale (`src/data/db.json`)

## Come avviare il progetto

1. Installare le dipendenze:
   ```bash
   npm install
   ```

2. Avviare il server di sviluppo:
   ```bash
   npm run dev
   ```

3. Aprire il browser su [http://localhost:3000](http://localhost:3000).

## Note

- I dati vengono salvati nel file `src/data/db.json`. Questo file funge da database.
- Per resettare i dati, basta modificare o cancellare il contenuto di quel file (mantenendo la struttura JSON).
