import { Feature } from '@/types/dnd';
export type { Feature };

export type Source =
    | 'PHB' | 'PHB24'
    | 'XGE' | 'TCE'
    | 'SCAG' | 'VGTM' | 'MTOF' | 'MPMM'
    | 'FTD' | 'VRGR' | 'EGW' | 'MOT' | 'SJA' | 'ERLW';

export interface Option {
    name: string;
    source?: Source;
    description?: string;
    features?: Feature[];
    suboptions?: Option[];
    abilityBonuses?: Record<string, number>;
    equipment?: string[];
}

export const SOURCES_CONFIG: { id: Source; name: string }[] = [
    { id: 'PHB', name: 'Manuale del Giocatore (2014)' },
    { id: 'PHB24', name: 'Manuale del Giocatore (2024)' },
    { id: 'XGE', name: 'Guida di Xanathar (XGE)' },
    { id: 'TCE', name: 'Calderone di Tasha (TCE)' },
    { id: 'SCAG', name: 'Guida degli Avventurieri alla Costa della Spada (SCAG)' },
    { id: 'VGTM', name: 'Volo\'s Guide to Monsters (VGTM)' },
    { id: 'MTOF', name: 'Mordenkainen\'s Tome of Foes (MTOF)' },
    { id: 'MPMM', name: 'Mordenkainen: Monsters of the Multiverse (MPMM)' },
    { id: 'FTD', name: 'Fizban\'s Treasury of Dragons (FTD)' },
    { id: 'VRGR', name: 'Van Richten\'s Guide to Ravenloft (VRGR)' },
    { id: 'EGW', name: 'Explorer\'s Guide to Wildemount (EGW)' },
    { id: 'MOT', name: 'Mythic Odysseys of Theros (MOT)' },
    { id: 'SJA', name: 'Spelljammer: Adventures in Space (SJA)' },
    { id: 'ERLW', name: 'Eberron: Rising from the Last War (ERLW)' }
];

export const ALIGNMENTS = [
    "Legale Buono", "Neutrale Buono", "Caotico Buono",
    "Legale Neutrale", "Neutrale Puro", "Caotico Neutrale",
    "Legale Malvagio", "Neutrale Malvagio", "Caotico Malvagio"
];
