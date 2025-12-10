export interface Player {
    id: string;
    name: string;
    email?: string;
    notes?: string;
    contactInfo?: string; // WhatsApp/Phone/Email for notifications
}

export interface Session {
    id: string;
    title: string;
    system: string;
    masterName: string;
    masterEmail?: string; // For notifications
    date: string;
    time: string;
    maxPlayers: number;
    currentPlayers: Player[];
    description: string;
    imageUrl?: string;
    location: string;
    type: 'GDR' | 'BOARDGAME';
}
