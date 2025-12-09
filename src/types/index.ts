export interface Player {
    id: string;
    name: string;
    email?: string;
    notes?: string;
}

export interface Session {
    id: string;
    title: string;
    system: string;
    masterName: string;
    date: string;
    time: string;
    maxPlayers: number;
    currentPlayers: Player[];
    description: string;
    imageUrl?: string;
    location: string;
    type: 'GDR' | 'BOARDGAME';
}
