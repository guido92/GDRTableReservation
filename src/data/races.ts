import { Source, Feature } from './common';

export interface RaceOption {
    name: string;
    suboptions?: {
        name: string;
        abilityBonuses?: Record<string, number>;
        source?: Source;
        description?: string;
        features?: Feature[];
    }[];
    abilityBonuses?: Record<string, number>;
    source?: Source;
    features?: Feature[];
}

export const RACES: RaceOption[] = [
    {
        name: 'Umano',
        abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
        features: [{ name: "Versatile", description: "+1 a tutte le caratteristiche.", level: 1, source: "PHB" }],
        source: 'PHB',
        suboptions: [
            { name: "Standard", abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 }, source: 'PHB' },
            { name: "Variante", abilityBonuses: { STR: 1, DEX: 1 }, source: 'PHB' }
        ]
    },
    {
        name: 'Elfo',
        abilityBonuses: { DEX: 2 },
        features: [
            { name: "Scurovisione", description: "Vedi al buio fino a 18m.", level: 1 },
            { name: "Sensi Acuti", description: "Competenza in Percezione.", level: 1 },
            { name: "Retaggio Fatato", description: "Vantaggio contro Charme, immune al sonno magico.", level: 1 },
            { name: "Trance", description: "Mediti 4 ore invece di dormire 8.", level: 1 }
        ],
        source: 'PHB',
        suboptions: [
            { name: "Alto Elfo", abilityBonuses: { INT: 1 }, source: 'PHB' },
            { name: "Elfo dei Boschi", abilityBonuses: { WIS: 1 }, source: 'PHB' },
            { name: "Drow (Elfo Oscuro)", abilityBonuses: { CHA: 1 }, source: 'PHB' },
            { name: "Eladrin", abilityBonuses: { CHA: 1 }, source: 'MTOF' },
            { name: "Shadar-Kai", abilityBonuses: { CON: 1 }, source: 'MTOF' },
            { name: "Elfo Marino", abilityBonuses: { CON: 1 }, source: 'MTOF' }
        ]
    },
    {
        name: 'Nano',
        abilityBonuses: { CON: 2 },
        features: [
            { name: "Scurovisione", description: "Vedi al buio fino a 18m.", level: 1 },
            { name: "Resilienza Nanica", description: "Vantaggio contro veleno e resistenza ai danni da veleno.", level: 1 },
            { name: "Competenza negli Strumenti", description: "Competenza in uno strumento da artigiano.", level: 1 }
        ],
        source: 'PHB',
        suboptions: [
            { name: "Nano delle Colline", abilityBonuses: { WIS: 1 }, source: 'PHB' },
            { name: "Nano delle Montagne", abilityBonuses: { STR: 2 }, source: 'PHB' },
            { name: "Duergar (Nano Grigio)", abilityBonuses: { STR: 1 }, source: 'SCAG' }
        ]
    },
    {
        name: 'Halfling',
        abilityBonuses: { DEX: 2 },
        features: [
            { name: "Fortunato", description: "Ritira 1 al d20.", level: 1 },
            { name: "Coraggioso", description: "Vantaggio contro paura.", level: 1 },
            { name: "Agilità Halfling", description: "Puoi muoverti attraverso creature più grandi.", level: 1 }
        ],
        source: 'PHB',
        suboptions: [
            { name: "Piedelesto", abilityBonuses: { CHA: 1 }, source: 'PHB' },
            { name: "Tozzo", abilityBonuses: { CON: 1 }, source: 'PHB' },
            { name: "Spettro (Ghostwise)", abilityBonuses: { WIS: 1 }, source: 'SCAG' }
        ]
    },
    {
        name: 'Dragonide',
        abilityBonuses: { STR: 2, CHA: 1 },
        features: [
            { name: "Ascendenza Draconica", description: "Scegli un tipo di drago. Ottieni resistenza e soffio.", level: 1 },
            { name: "Arma a Soffio", description: "Soffio elementale.", level: 1 },
            { name: "Resistenza ai Danni", description: "Resistenza all'elemento scelto.", level: 1 }
        ],
        source: 'PHB',
        suboptions: [
            { name: "Antenato Rosso (Fuoco)", source: 'PHB' },
            { name: "Antenato Blu (Fulmine)", source: 'PHB' },
            { name: "Antenato Verde (Veleno)", source: 'PHB' },
            { name: "Antenato Nero (Acido)", source: 'PHB' },
            { name: "Antenato Bianco (Freddo)", source: 'PHB' },
            { name: "Antenato Oro (Fuoco)", source: 'PHB' },
            { name: "Antenato Argento (Freddo)", source: 'PHB' },
            { name: "Antenato Bronzo (Fulmine)", source: 'PHB' },
            { name: "Antenato Rame (Acido)", source: 'PHB' },
            { name: "Antenato Ottone (Fuoco)", source: 'PHB' },
            { name: "Gemma (Gem Dragonborn)", source: 'FTD' }
        ]
    },
    {
        name: 'Gnomo',
        abilityBonuses: { INT: 2 },
        features: [
            { name: "Scurovisione", description: "Vedi al buio fino a 18m.", level: 1 },
            { name: "Astuzia Gnomesca", description: "Vantaggio su TS INT/WIS/CHA contro magia.", level: 1 }
        ],
        source: 'PHB',
        suboptions: [
            { name: "Gnomo delle Foreste", abilityBonuses: { DEX: 1 }, source: 'PHB' },
            { name: "Gnomo delle Rocce", abilityBonuses: { CON: 1 }, source: 'PHB' },
            { name: "Gnomo delle Profondità (Svirfneblin)", abilityBonuses: { DEX: 1 }, source: 'SCAG' }
        ]
    },
    {
        name: 'Mezzelfo',
        abilityBonuses: { CHA: 2, DEX: 1, CON: 1 },
        features: [
            { name: "Scurovisione", description: "Vedi al buio fino a 18m.", level: 1 },
            { name: "Retaggio Fatato", description: "Vantaggio contro Charme, immune al sonno magico.", level: 1 },
            { name: "Versatilità nelle Abilità", description: "Competenza in 2 abilità a scelta.", level: 1 }
        ],
        source: 'PHB',
        suboptions: [
            { name: "Standard", source: 'PHB' },
            { name: "Disendenza Acquatica", source: 'SCAG' },
            { name: "Disendenza Drow", source: 'SCAG' },
            { name: "Disendenza Silvana", source: 'SCAG' }
        ]
    },
    {
        name: 'Mezzorco',
        abilityBonuses: { STR: 2, CON: 1 },
        features: [
            { name: "Scurovisione", description: "Vedi al buio fino a 18m.", level: 1 },
            { name: "Minaccioso", description: "Competenza in Intimidire.", level: 1 },
            { name: "Tenacia Implacabile", description: "Quando scendi a 0 hp, scendi a 1 hp (1/riposo).", level: 1 },
            { name: "Attacchi Selvaggi", description: "Critici infliggono un dado extra.", level: 1 }
        ],
        source: 'PHB'
    },
    {
        name: 'Tiefling',
        abilityBonuses: { CHA: 2, INT: 1 },
        features: [
            { name: "Scurovisione", description: "Vedi al buio fino a 18m.", level: 1 },
            { name: "Resistenza Infernale", description: "Resistenza ai danni da fuoco.", level: 1 },
            { name: "Eredità Infernale", description: "Conosci Thaumaturgy. Al 3 Hellish Rebuke. Al 5 Darkness.", level: 1 }
        ],
        source: 'PHB',
        suboptions: [
            { name: "Asmodeus (Standard)", source: 'PHB' },
            { name: "Baalzebul", abilityBonuses: { INT: 1 }, source: 'MTOF' },
            { name: "Dispater", abilityBonuses: { DEX: 1 }, source: 'MTOF' },
            { name: "Fierna", abilityBonuses: { WIS: 1 }, source: 'MTOF' },
            { name: "Glasya", abilityBonuses: { DEX: 1 }, source: 'MTOF' },
            { name: "Levistus", abilityBonuses: { CON: 1 }, source: 'MTOF' },
            { name: "Mammon", abilityBonuses: { INT: 1 }, source: 'MTOF' },
            { name: "Mephistopheles", abilityBonuses: { INT: 1 }, source: 'MTOF' },
            { name: "Zariel", abilityBonuses: { STR: 1 }, source: 'MTOF' },
            { name: "Alato", source: 'SCAG' }
        ]
    },
    {
        name: 'Aasimar',
        abilityBonuses: { CHA: 2 },
        features: [
            { name: "Scurovisione", description: "Vedi al buio.", level: 1 },
            { name: "Mani Guaritrici", description: "Curi pari al tuo livello.", level: 1 },
            { name: "Portatore di Luce", description: "Conosci il trucchetto Luce.", level: 1 },
            { name: "Resistenza Celestiale", description: "Resistenza necrotico e radioso.", level: 1 }
        ],
        source: 'VGTM',
        suboptions: [
            { name: "Protettore", abilityBonuses: { WIS: 1 }, source: 'VGTM' },
            { name: "Flagello", abilityBonuses: { CON: 1 }, source: 'VGTM' },
            { name: "Caduto", abilityBonuses: { STR: 1 }, source: 'VGTM' }
        ]
    },
    {
        name: 'Goliath',
        abilityBonuses: { STR: 2, CON: 1 },
        features: [
            { name: "Atleta Naturale", description: "Competenza in Atletica.", level: 1 },
            { name: "Resistenza della Pietra", description: "Riduci danni di 1d12+CON come reazione.", level: 1 },
            { name: "Corporatura Possente", description: "Conti come taglia grande per carico.", level: 1 },
            { name: "Nato dalle Montagne", description: "Adatto a climi freddi.", level: 1 }
        ],
        source: 'VGTM'
    },
    {
        name: 'Tabaxi',
        abilityBonuses: { DEX: 2, CHA: 1 },
        features: [
            { name: "Scurovisione", description: "Vedi al buio.", level: 1 },
            { name: "Agilità Felina", description: "Raddoppi velocità per un turno (ricarica 0 movimento).", level: 1 },
            { name: "Artigli del Gatto", description: "Scalare 6m. Danni 1d4+STR.", level: 1 },
            { name: "Abilità del Gatto", description: "Competenza Percezione e Furtività.", level: 1 }
        ],
        source: 'VGTM'
    },
    {
        name: 'Tritone',
        abilityBonuses: { STR: 1, CON: 1, CHA: 1 },
        features: [
            { name: "Anfibio", description: "Respiri aria e acqua.", level: 1 },
            { name: "Controllo Aria e Acqua", description: "Lanci Fog Cloud, Gust of Wind, Wall of Water.", level: 1 },
            { name: "Emissario del Mare", description: "Parli con creature marine.", level: 1 },
            { name: "Guardiano delle Profondità", description: "Resistenza al freddo.", level: 1 }
        ],
        source: 'VGTM' // Also MOT, but VGTM matches stats
    },
    {
        name: 'Kenku',
        abilityBonuses: { DEX: 2, WIS: 1 },
        features: [
            { name: "Esperto nella Falsificazione", description: "Vantaggio per falsificare.", level: 1 },
            { name: "Addestramento Kenku", description: "2 abilità a scelta tra 4.", level: 1 },
            { name: "Mimica", description: "Puoi imitare qualsiasi suono.", level: 1 }
        ],
        source: 'VGTM'
    },
    {
        name: 'Tortle',
        abilityBonuses: { STR: 2, WIS: 1 },
        features: [
            { name: "Artigli", description: "1d4+STR.", level: 1 },
            { name: "Trattenere il Respiro", description: "1 ora.", level: 1 },
            { name: "Armatura Naturale", description: "AC base 17. Non puoi indossare armature.", level: 1 },
            { name: "Ritirata nel Guscio", description: "+4 AC, prono.", level: 1 },
            { name: "Istinto di Sopravvivenza", description: "Competenza Sopravvivenza.", level: 1 }
        ],
        source: 'XGE' // Originally Tortle Package, then MPMM. I'll stick to XGE/MPMM logic. It's often bundled with XGE in tools. I'll use XGE or add 'TTP'? XGE is fine for now as it's common.
    },
    {
        name: 'Warforged',
        abilityBonuses: { CON: 2, INT: 1 },
        features: [
            { name: "Resilienza Costruita", description: "Vantaggio veleno, immune malattie, no sonno/cibo/respiro.", level: 1 },
            { name: "Riposo della Sentinella", description: "Vedi/senti mentre riposi 6h.", level: 1 },
            { name: "Protezione Integrata", description: "+1 AC.", level: 1 },
            { name: "Design Specializzato", description: "1 abilità, 1 strumento.", level: 1 }
        ],
        source: 'ERLW'
    },
    {
        name: 'Genasi',
        abilityBonuses: { CON: 2 },
        features: [
            { name: "Costituzione Genasi", description: "+2 CON.", level: 1 }
        ],
        source: 'XGE', // EEPC -> XGE fallback
        suboptions: [
            { name: "Aria", abilityBonuses: { DEX: 1 }, source: 'XGE' },
            { name: "Terra", abilityBonuses: { STR: 1 }, source: 'XGE' },
            { name: "Fuoco", abilityBonuses: { INT: 1 }, source: 'XGE' },
            { name: "Acqua", abilityBonuses: { WIS: 1 }, source: 'XGE' }
        ]
    }
];
