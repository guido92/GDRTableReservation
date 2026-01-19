import { Session, Player } from '@/types';

// Use the API Key from environment (currently stored in SMTP_PASSWORD or we can ask to rename)
const BREVO_API_KEY = process.env.SMTP_PASSWORD || process.env.BREVO_API_KEY;

interface DatiEmail {
    emailOrganizzatore?: string;
    nomeOrganizzatore: string;
    nomeGiocatore: string;
    emailGiocatore?: string;
    telefonoGiocatore?: string;
    nomeTavolo: string;
    descrizioneGioco: string;
    data: string;
    ora: string;
    numeroPostiPrenotati: number;
    note?: string;
}

// Helper for Brevo API
async function sendBrevoEmail(to: string, subject: string, htmlContent: string) {
    if (!BREVO_API_KEY) {
        console.error('Brevo API Key missing');
        return;
    }

    try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'Prenotazione Tavoli', email: 'prenotazione-tavoli@latavernadiguido.it' },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        if (!res.ok) {
            const err = await res.json();
            console.error('Brevo API Error:', err);
            throw new Error('Email send failed');
        }

        const data = await res.json();
        console.log('Email sent via Brevo API:', data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function inviaEmailPrenotazioneTavolo(dati: DatiEmail) {
    if (!dati.emailOrganizzatore) return;

    const html = `
    <h1>Nuova Prenotazione Tavolo</h1>
    <p>Ciao <strong>${dati.nomeOrganizzatore}</strong>,</p>
    <p>Un nuovo giocatore si è iscritto al tuo tavolo: <strong>${dati.nomeTavolo}</strong>.</p>
    <hr />
    <h3>Dettagli Giocatore:</h3>
    <ul>
        <li><strong>Nome:</strong> ${dati.nomeGiocatore}</li>
        <li><strong>Email:</strong> ${dati.emailGiocatore || 'N/A'}</li>
        <li><strong>Telefono:</strong> ${dati.telefonoGiocatore || 'N/A'}</li>
        <li><strong>Note:</strong> ${dati.note || 'Nessuna'}</li>
    </ul>
    `;

    await sendBrevoEmail(dati.emailOrganizzatore, `Nuova Iscrizione: ${dati.nomeTavolo}`, html);
}

export async function inviaEmailConfermaGiocatore(dati: DatiEmail) {
    if (!dati.emailGiocatore) return;

    const html = `
    <h1>Conferma Iscrizione</h1>
    <p>Ciao <strong>${dati.nomeGiocatore}</strong>,</p>
    <p>La tua iscrizione al tavolo <strong>${dati.nomeTavolo}</strong> è confermata!</p>
    <hr />
    <h3>Dettagli Sessione:</h3>
    <ul>
        <li><strong>Master:</strong> ${dati.nomeOrganizzatore}</li>
        <li><strong>Data:</strong> ${dati.data}</li>
        <li><strong>Ora:</strong> ${dati.ora}</li>
        <li><strong>Gioco:</strong> ${dati.descrizioneGioco}</li>
    </ul>
    `;

    await sendBrevoEmail(dati.emailGiocatore, `Conferma Iscrizione: ${dati.nomeTavolo}`, html);
}
