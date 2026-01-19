export type Source = 'PHB14' | 'PHB24' | 'XGE' | 'TCE' | 'MTOF';

export interface Feature {
    name: string;
    description: string;
    level: number;
    source: Source;
}

export interface Option {
    name: string;
    source: Source;
    description?: string;
    suboptions?: Option[];
    features?: Feature[]; // Automatic features gained at level 1 (or specific levels)
    proficiencies?: {
        armor?: string[];
        weapons?: string[];
        tools?: string[];
        savingThrows?: string[];
        skills?: string[]; // Options to choose from
    };
    abilityBonuses?: { [key: string]: number }; // e.g. { STR: 2, CHA: 1 }
    hitDie?: string;
    equipment?: string[]; // Standard starting equipment
}

export const SOURCES_CONFIG = [
    { id: 'PHB14', name: "Player's Handbook (2014)", default: true },
    { id: 'PHB24', name: "Player's Handbook (2024)", default: true },
    { id: 'XGE', name: "Xanathar's Guide to Everything", default: false },
    { id: 'TCE', name: "Tasha's Cauldron of Everything", default: false },
    { id: 'MTOF', name: "Mordenkainen's Tome of Foes", default: false },
] as const;

export const PERSONALITY_TRAITS = [
    "Sono sempre gentile e cortese.", "Ho una battuta per ogni situazione.", "Mi fido poco degli sconosciuti.",
    "Credo che tutti meritino una seconda possibilità.", "Dormo con la spada in mano.", "Sono perseguitato dal mio passato."
];
export const IDEALS = [
    "Giustizia. (Legale)", "Libertà. (Caotico)", "Carità. (Buono)", "Potere. (Malvagio)", "Logica. (Neutrale)", "Gloria. (Qualsiasi)"
];
export const BONDS = [
    "Farei di tutto per proteggere i miei compagni.", "Devo ritrovare la mia famiglia perduta.",
    "Il mio onore è la mia vita.", "Ho un debito che non posso ripagare.", "Proteggo i deboli perché nessuno lo ha fatto con me."
];
export const FLAWS = [
    "Non resisto a un bel viso.", "Parlo senza pensare.", "Ho paura del buio.", "Sono avido d'oro.", "Non dimentico mai un torto subito."
];

// --- CLASSES ---

export const CLASSES: Option[] = [
    {
        name: "Barbaro",
        source: "PHB14",
        hitDie: "d12",
        description: "Un feroce guerriero primitivo.",
        proficiencies: {
            savingThrows: ["Forza", "Costituzione"],
            armor: ["Leggera", "Media", "Scudi"],
            weapons: ["Semplici", "Marziali"],
            skills: ["Addestrare Animali", "Atletica", "Intimidire", "Natura", "Percezione", "Sopravvivenza"]
        },
        equipment: ["Ascia bipenne", "Due asce lanciabili", "Pacchetto da esploratore", "4 giavellotti"],
        features: [
            { name: "Ira", level: 1, source: "PHB14", description: "Vantaggio prove forza, bonus danni forza, resistenza danni contundenti/taglienti/perforanti." },
            { name: "Difesa Senza Armatura", level: 1, source: "PHB14", description: "Senza armatura, CA = 10 + Mod DES + Mod COS." },
            { name: "Attacco Irruento", level: 2, source: "PHB14", description: "Puoi attaccare con vantaggio ma i nemici hanno vantaggio su di te." },
            { name: "Percezione del Pericolo", level: 2, source: "PHB14", description: "Vantaggio ai TS su Destrezza contro effetti visibili." },
            { name: "Attacco Extra", level: 5, source: "PHB14", description: "Puoi attaccare due volte invece di una." },
            { name: "Movimento Veloce", level: 5, source: "PHB14", description: "+3m velocità se non indossi armatura pesante." },
            { name: "Istinto Ferino", level: 7, source: "PHB14", description: "Vantaggio iniziativa, non puoi essere sorpreso." },
            { name: "Critico Brutale", level: 9, source: "PHB14", description: "Tira dado arma extra su critico (2 dadi al 13°, 3 al 17°)." },
            { name: "Ira Implacabile", level: 11, source: "PHB14", description: "Se vai a 0 HP in ira, TS Costituzione (DC 10) per andare a 1." },
            { name: "Ira Persistente", level: 15, source: "PHB14", description: "L'ira termina solo se cadi privo di sensi o la termini tu." },
            { name: "Forza Indomita", level: 18, source: "PHB14", description: "Se il totale di una prova Forza è < punteggio Forza, usa il punteggio." },
            { name: "Campione Primordiale", level: 20, source: "PHB14", description: "+4 Forza e Costituzione. Max 24." }
        ],
        suboptions: [
            { name: "Cammino del Berserker", source: "PHB14", features: [{ name: "Frenesia", level: 3, source: "PHB14", description: "Puoi andare in frenesia quando entri in ira per fare un attacco bonus." }] },
            { name: "Cammino del Totem", source: "PHB14", features: [{ name: "Spirito Totemico", level: 3, source: "PHB14", description: "Scegli un animale totemico e ottieni i suoi benefici." }] },
        ]
    },
    {
        name: "Bardo",
        source: "PHB14",
        hitDie: "d8",
        description: "Un incantatore espiratore.",
        proficiencies: {
            savingThrows: ["Destrezza", "Carisma"],
            armor: ["Leggera"],
            weapons: ["Semplici", "Balestra a mano", "Spada lunga", "Stocco", "Spada corta"],
            skills: ["Acrobazia", "Addestrare Animali", "Arcano", "Atletica", "Inganno", "Storia", "Intuizione", "Intimidire", "Indagare", "Medicina", "Natura", "Percezione", "Intrattenere", "Persuasione", "Religione", "Rapidità di Mano", "Furtività", "Sopravvivenza"]
        },
        equipment: ["Stocco", "Pacchetto da intrattenitore", "Liuto", "Armatura di cuoio", "Daga"],
        features: [
            { name: "Ispirazione Bardica", level: 1, source: "PHB14", description: "Usa un'azione bonus per dare un dado ispirazione a un alleato." },
            { name: "Incantesimi", level: 1, source: "PHB14", description: "Puoi lanciare incantesimi da bardo." },
            { name: "Tuttofare", level: 2, source: "PHB14", description: "Aggiungi metà competenza alle prove in cui non sei competente." },
            { name: "Canto di Riposo", level: 2, source: "PHB14", description: "Aiuti a recuperare HP durante i riposi brevi." },
            { name: "Fonte di Ispirazione", level: 5, source: "PHB14", description: "Recuperi Ispirazione Bardica anche con riposo breve." },
            { name: "Controfascino", level: 6, source: "PHB14", description: "Azione per dare vantaggio contro paura/charme a 9m." },
            { name: "Segreti Magici", level: 10, source: "PHB14", description: "Impari 2 incantesimi da qualsiasi classe (anche al 14° e 18°)." },
            { name: "Ispirazione Superiore", level: 20, source: "PHB14", description: "Se tiri iniziativa senza ispirazioni, ne recuperi una." }
        ],
        suboptions: [
            { name: "Collegio della Sapienza", source: "PHB14", features: [{ name: "Parole Taglienti", level: 3, source: "PHB14", description: "Usa ispirazione per ridurre tiro per colpire o danni nemici." }] },
            { name: "Collegio del Valore", source: "PHB14", features: [{ name: "Ispirazione al Combattimento", level: 3, source: "PHB14", description: "L'ispirazione può essere usata per aumentare i danni o la CA." }] }
        ]
    },
    {
        name: "Chierico",
        source: "PHB14",
        hitDie: "d8",
        description: "Un campione sacerdotale divino.",
        proficiencies: {
            savingThrows: ["Saggezza", "Carisma"],
            armor: ["Leggera", "Media", "Scudi"],
            weapons: ["Semplici"],
            skills: ["Storia", "Intuizione", "Medicina", "Persuasione", "Religione"]
        },
        equipment: ["Mazza", "Armatura di scaglie", "Balestra leggera", "Pacchetto da sacerdote", "Scudo", "Simbolo sacro"],
        features: [
            { name: "Incantesimi", level: 1, source: "PHB14", description: "Puoi lanciare incantesimi da chierico." },
            { name: "Dominio Divino", level: 1, source: "PHB14", description: "Scegli un dominio che ti concede incantesimi e privilegi." },
            { name: "Incanalare Divinità", level: 2, source: "PHB14", description: "Usa energia divina per effetti speciali." },
            { name: "Distruggere Non Morti", level: 5, source: "PHB14", description: "Incanalare Divinità distrugge non morti di basso CR." },
            { name: "Intervento Divino", level: 10, source: "PHB14", description: "Chiedi aiuto al tuo dio. Successo con d100 <= livello." },
            { name: "Intervento Divino Migliorato", level: 20, source: "PHB14", description: "Il tuo Intervento Divino ha successo automatico." }
        ],
        suboptions: [
            { name: "Dominio della Guerra", source: "PHB14", features: [{ name: "Sacerdote di Guerra", level: 1, source: "PHB14", description: "Azione bonus per attaccare di nuovo." }] },
            { name: "Dominio della Vita", source: "PHB14", features: [{ name: "Discepolo della Vita", level: 1, source: "PHB14", description: "Bonus alle cure lanciate." }] },
            { name: "Dominio della Luce", source: "PHB14", features: [{ name: "Bagliore di Interdizione", level: 1, source: "PHB14", description: "Svantaggio agli attacchi nemici con la luce." }] },
            { name: "Dominio della Tempesta", source: "PHB14", features: [{ name: "Ira della Tempesta", level: 1, source: "PHB14", description: "Danni tuono/fulmine come reazione." }] }
        ]
    },
    {
        name: "Guerriero",
        source: "PHB14",
        hitDie: "d10",
        description: "Un maestro del combattimento.",
        proficiencies: {
            savingThrows: ["Forza", "Costituzione"],
            armor: ["Tutte le armature", "Scudi"],
            weapons: ["Semplici", "Marziali"],
            skills: ["Acrobazia", "Addestrare Animali", "Atletica", "Storia", "Intuizione", "Intimidire", "Percezione", "Sopravvivenza"]
        },
        equipment: ["Cotta di maglia", "Spada lunga", "Scudo", "Balestra leggera", "Pacchetto da esploratore"],
        features: [
            { name: "Stile di Combattimento", level: 1, source: "PHB14", description: "Scegli uno stile (es. Difesa, Duellare)." },
            { name: "Recuperare Energie", level: 1, source: "PHB14", description: "Azione bonus per recuperare 1d10 + livello HP." },
            { name: "Azione Impetuosa", level: 2, source: "PHB14", description: "Una volta per riposo, fai un'azione extra." },
            { name: "Attacco Extra", level: 5, source: "PHB14", description: "Due attacchi (3 all'11°, 4 al 20°)." },
            { name: "Indomito", level: 9, source: "PHB14", description: "Ritira un TS fallito (1 volta, poi 2 al 13°, 3 al 17°)." }
        ],
        suboptions: [
            { name: "Campione", source: "PHB14", features: [{ name: "Critico Migliorato", level: 3, source: "PHB14", description: "Critico con 19 o 20." }] },
            { name: "Maestro di Battaglia", source: "PHB14", features: [{ name: "Superiorità in Combattimento", level: 3, source: "PHB14", description: "Usa dadi di superiorità per manovre speciali." }] },
            { name: "Cavaliere Mistico", source: "PHB14", features: [{ name: "Incantesimi", level: 3, source: "PHB14", description: "Impari trucchetti e incantesimi da mago." }, { name: "Legame con l'Arma", level: 3, source: "PHB14", description: "Richiami l'arma nella tua mano." }] }
        ]
    },
    {
        name: "Ladro",
        source: "PHB14",
        hitDie: "d8",
        description: "Un furfante abile e furtivo.",
        proficiencies: {
            savingThrows: ["Destrezza", "Intelligenza"],
            armor: ["Leggera"],
            weapons: ["Semplici", "Balestra a mano", "Spada lunga", "Stocco", "Spada corta"],
            skills: ["Acrobazia", "Atletica", "Inganno", "Intuizione", "Intimidire", "Indagare", "Percezione", "Intrattenere", "Persuasione", "Rapidità di Mano", "Furtività"]
        },
        equipment: ["Stocco", "Arco corto", "Pacchetto da scassinatore", "Armatura di cuoio", "Due pugnali", "Arnesi da scasso"],
        features: [
            { name: "Maestria", level: 1, source: "PHB14", description: "Raddoppia competenza in 2 abilità." },
            { name: "Attacco Furtivo", level: 1, source: "PHB14", description: "Danni extra se hai vantaggio o alleato vicino." },
            { name: "Azione Scaltra", level: 2, source: "PHB14", description: "Azione bonus per Scattare, Disimpegnarsi o Nascondersi." },
            { name: "Schivata Prodigiosa", level: 5, source: "PHB14", description: "Reazione per dimezzare danni subiti." },
            { name: "Elusione", level: 7, source: "PHB14", description: "Danni dimezzati o nulli su TS Destrezza." },
            { name: "Talento Affidabile", level: 11, source: "PHB14", description: "Minimo 10 su d20 per abilità con competenza." },
            { name: "Vista Cieca", level: 14, source: "PHB14", description: "Senti creature nascoste entro 3m." },
            { name: "Mente Sfuggente", level: 15, source: "PHB14", description: "Competenza TS Saggezza." },
            { name: "Elusivo", level: 18, source: "PHB14", description: "Nessun nemico ha vantaggio contro di te." },
            { name: "Colpo di Fortuna", level: 20, source: "PHB14", description: "Trasforma fallimento in 20 naturale (1/riposo)." }
        ],
        suboptions: [
            { name: "Furfante", source: "PHB14", features: [{ name: "Mani Veloci", level: 3, source: "PHB14", description: "Migliora Azione Scaltra e uso oggetti." }] },
            { name: "Assassino", source: "PHB14", features: [{ name: "Assassinare", level: 3, source: "PHB14", description: "Vantaggio contro chi non ha agito. Critico automatico se sorpreso." }] },
            { name: "Mistificatore Arcano", source: "PHB14", features: [{ name: "Incantesimi", level: 3, source: "PHB14", description: "Impari trucchetti e incantesimi da mago." }, { name: "Mano Magica Migliorata", level: 3, source: "PHB14", description: "Mano magica invisibile e versatile." }] },
            { name: "Swashbuckler", source: "XGE", features: [{ name: "Gioco di Gambe", level: 3, source: "XGE", description: "Se attacchi in mischia, nemico non può fare OA. Attacco furtivo se solo, senza svantaggio." }, { name: "Audacia Irresistibile", level: 3, source: "XGE", description: "+Carisma all'iniziativa." }] }
        ]
    },
    {
        name: "Mago",
        source: "PHB14",
        hitDie: "d6",
        description: "Uno studioso di magia arcana.",
        proficiencies: {
            savingThrows: ["Intelligenza", "Saggezza"],
            armor: [],
            weapons: ["Daga", "Dardo", "Fionda", "Bastone ferrato", "Balestra leggera"],
        },
        equipment: ["Bastone ferrato", "Borsa componenti", "Libro degli incantesimi", "Pacchetto da studioso"],
        features: [
            { name: "Incantesimi", level: 1, source: "PHB14", description: "Lanci magie usando il libro degli incantesimi." },
            { name: "Recupero Arcano", level: 1, source: "PHB14", description: "Recuperi slot incantesimo durante riposo breve." },
            { name: "Tradizione Arcana", level: 2, source: "PHB14", description: "Scegli una scuola di magia." },
            { name: "Maestria negli Incantesimi", level: 18, source: "PHB14", description: "Lanciare a volontà un inc. di 1° e 2° livello." },
            { name: "Incantesimi Personali", level: 20, source: "PHB14", description: "Due inc. di 3° livello sempre preparati e gratis 1/riposo." }
        ],
        suboptions: [
            { name: "Scuola di Invocazione", source: "PHB14", features: [{ name: "Plasmare Incantesimi", level: 2, source: "PHB14", description: "Proteggi alleati dalle tue magie ad area." }] },
            { name: "Scuola di Necromanzia", source: "PHB14", features: [{ name: "Mietitura Macabra", level: 2, source: "PHB14", description: "Guadagni HP quando uccidi con incantesimi non trucchetto." }] },
            { name: "Scuola di Abiurazione", source: "PHB14", features: [{ name: "Interdizione Arcana", level: 2, source: "PHB14", description: "Lo scudo magico assorbe danni. Si ricarica lanciando abiurazioni." }] },
            { name: "Scuola di Divinazione", source: "PHB14", features: [{ name: "Portento", level: 2, source: "PHB14", description: "Tira 2d20 al mattino e usali per sostituire qualsiasi tiro." }] },
            { name: "Cantore della Lama", source: "TCE", features: [{ name: "Canto della Lama", level: 2, source: "TCE", description: "Azione bonus: +INT alla CA, +10m velocità, vantaggio acrobazia, bonus concentrazione." }, { name: "Addestramento in Guerra e Canto", level: 2, source: "TCE", description: "Competenza armature leggere e un'arma a una mano." }] }
        ]
    },
    {
        name: "Artefice",
        source: "TCE",
        hitDie: "d8",
        description: "Un maestro dell'invenzione che usa la magia per animare oggetti.",
        proficiencies: {
            savingThrows: ["Costituzione", "Intelligenza"],
            armor: ["Leggera", "Media", "Scudi"],
            weapons: ["Semplici"],
            tools: ["Attrezzi da scasso", "Attrezzi da inventore", "Strumenti da artigiano"],
            skills: ["Arcano", "Storia", "Indagare", "Medicina", "Natura", "Percezione", "Rapidità di Mano"]
        },
        equipment: ["Due armi semplici", "Balestra leggera", "Armatura di cuoio", "Attrezzi da scasso", "Attrezzi da inventore"],
        features: [
            { name: "Stile Magico", level: 1, source: "TCE", description: "Crea piccoli effetti magici negli oggetti." },
            { name: "Incantesimi", level: 1, source: "TCE", description: "Lanci magie attraverso i tuoi strumenti." },
            { name: "Infondere Oggetto", level: 2, source: "TCE", description: "Rendi magici oggetti comuni." },
            { name: "Speciaità Artefice", level: 3, source: "TCE", description: "Scegli una specializzazione (Alchimista, Armaiolo, Artigliere, Fabbro da Battaglia)." },
            { name: "Strumento Giusto per il Lavoro", level: 3, source: "TCE", description: "Crei attrezzi magici." },
            { name: "Competenza negli Strumenti", level: 6, source: "TCE", description: "Raddoppia competenza con strumenti." },
            { name: "Bagliore di Genio", level: 7, source: "TCE", description: "Usa reazione per aggiungere INT a una prova o TS." },
            { name: "Oggetto Custodito", level: 11, source: "TCE", description: "Immagazzina un incantesimo in un oggetto." },
            { name: "Sapiente dell'Oggetto Magico", level: 14, source: "TCE", description: "Ignori restrizioni di classe/razza su oggetti magici." },
            { name: "Anima dell'Artificio", level: 20, source: "TCE", description: "+1 ai TS per ogni oggetto armonizzato. Se vai a 0 HP, puoi terminare un'infusione per rimanere a 1." }
        ],
        suboptions: [
            { name: "Artigliere", source: "TCE", features: [{ name: "Cannone Occulto", level: 3, source: "TCE", description: "Crea un cannone magico che spara." }] },
            { name: "Fabbro da Battaglia", source: "TCE", features: [{ name: "Difensore d'Acciaio", level: 3, source: "TCE", description: "Costruisci un costrutto difensore." }] },
            { name: "Alchimista", source: "TCE", features: [{ name: "Elisir Sperimentale", level: 3, source: "TCE", description: "Crei pozioni casuali ogni mattina o spendendo slot." }] },
            { name: "Armaiolo", source: "TCE", features: [{ name: "Armatura Arcana", level: 3, source: "TCE", description: "La tua armatura diventa un'arma (Guardiano o infiltrato), no forza req." }] }
        ]
    }
];

// --- RACES ---

export const RACES: Option[] = [
    {
        name: "Umano",
        source: "PHB14",
        description: "Versatili e ambiziosi.",
        abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
        features: [
            { name: "Incremento Punteggi", level: 1, source: "PHB14", description: "+1 a tutte le caratteristiche." },
            { name: "Linguaggi", level: 1, source: "PHB14", description: "Comune e un altro a scelta." }
        ]
    },
    {
        name: "Elfo",
        source: "PHB14",
        description: "Creature magiche dai tratti affinati.",
        abilityBonuses: { DEX: 2 },
        features: [
            { name: "Scurovisione", level: 1, source: "PHB14", description: "Vedi al buio fino a 18m." },
            { name: "Sensi Acuti", level: 1, source: "PHB14", description: "Competenza in Percezione." },
            { name: "Retaggio Fatato", level: 1, source: "PHB14", description: "Vantaggio contro charme, immune al sonno magico." },
            { name: "Trance", level: 1, source: "PHB14", description: "Non dormi, mediti 4 ore." }
        ],
        suboptions: [
            { name: "Alto Elfo", source: "PHB14", abilityBonuses: { INT: 1 }, features: [{ name: "Trucchetto", level: 1, source: "PHB14", description: "Un trucchetto da Mago." }] },
            { name: "Elfo dei Boschi", source: "PHB14", abilityBonuses: { WIS: 1 }, features: [{ name: "Piede Lesto", level: 1, source: "PHB14", description: "Velocità aumentata a 10.5m." }] }
        ]
    },
    {
        name: "Nano",
        source: "PHB14",
        description: "Robusti e resistenti.",
        abilityBonuses: { CON: 2 },
        features: [
            { name: "Scurovisione", level: 1, source: "PHB14", description: "Vedi al buio fino a 18m." },
            { name: "Resilienza Nanica", level: 1, source: "PHB14", description: "Vantaggio TS veleno e resistenza danni veleno." },
            { name: "Competenza Combattimento Nanico", level: 1, source: "PHB14", description: "Competenza asce e martelli." }
        ],
        suboptions: [
            { name: "Nano delle Colline", source: "PHB14", abilityBonuses: { WIS: 1 }, features: [{ name: "Robustezza Nanica", level: 1, source: "PHB14", description: "+1 HP per livello." }] },
            { name: "Nano delle Montagne", source: "PHB14", abilityBonuses: { STR: 2 }, features: [{ name: "Addestramento Armature", level: 1, source: "PHB14", description: "Competenza armature leggere e medie." }] }
        ]
    }
];

// --- BACKGROUNDS ---

export const BACKGROUNDS: Option[] = [
    {
        name: "Accolito",
        source: "PHB14",
        features: [{ name: "Rifugio del Fedele", level: 1, source: "PHB14", description: "Ricevi aiuto dal tuo tempio." }],
        equipment: ["Simbolo sacro", "Libro di preghiere", "5 bastoncini incenso", "Vesti", "15 mo"]
    },
    {
        name: "Soldato",
        source: "PHB14",
        features: [{ name: "Grado Militare", level: 1, source: "PHB14", description: "Hai un grado e autorità sui soldati di grado inferiore." }],
        equipment: ["Simbolo del grado", "Trofeo di guerra", "Set di dadi", "Abiti comuni", "10 mo"]
    },
    {
        name: "Criminale",
        source: "PHB14",
        features: [{ name: "Contatto Criminale", level: 1, source: "PHB14", description: "Hai un contatto nella malavita." }],
        equipment: ["Piede di porco", "Abiti scuri con cappuccio", "15 mo"]
    },
    {
        name: "Sapiente",
        source: "PHB14",
        features: [{ name: "Ricercatore", level: 1, source: "PHB14", description: "Sai dove trovare informazioni che non conosci." }],
        equipment: ["Inchiostro", "Pennino", "Coltellino", "Lettera di un collega morto", "Abiti comuni", "10 mo"]
    },
    {
        name: "Nobile",
        source: "PHB14",
        features: [{ name: "Privilegio", level: 1, source: "PHB14", description: "Sei benvenuto nell'alta società." }],
        equipment: ["Abiti pregiati", "Anello con sigillo", "Pergamena di discendenza", "25 mo"]
    },
    {
        name: "Ciarlatano",
        source: "PHB14",
        features: [{ name: "Falsa Identità", level: 1, source: "PHB14", description: "Hai una seconda identità completa di documenti." }],
        equipment: ["Abiti raffinati", "Kit per il trucco", "Strumenti per il falso", "15 mo"]
    },
    {
        name: "Artigiano di Gilda",
        source: "PHB14",
        features: [{ name: "Affari di Gilda", level: 1, source: "PHB14", description: "Supporto e alloggio dalla tua gilda." }],
        equipment: ["Attrezzi da artigiano", "Lettera di raccomandazione", "Abiti da viaggiatore", "15 mo"]
    },
    {
        name: "Marinaio",
        source: "PHB14",
        features: [{ name: "Passaggio Nave", level: 1, source: "PHB14", description: "Puoi ottenere passaggio gratuito su navi." }],
        equipment: ["Corda di seta", "Bastone", "Amuleto portafortuna", "Abiti comuni", "10 mo"]
    },
    {
        name: "Monello",
        source: "PHB14",
        features: [{ name: "Segreti Cittadini", level: 1, source: "PHB14", description: "Conosci passaggi segreti e vie urbane veloci." }],
        equipment: ["Coltellino", "Mappa della città", "Topolino domestico", "Abiti comuni", "10 mo"]
    },
    {
        name: "Intrattenitore",
        source: "PHB14",
        features: [{ name: "A Richiesta", level: 1, source: "PHB14", description: "Puoi trovare vitto e alloggio esibendoti." }],
        equipment: ["Strumento musicale", "Costume", "15 mo"]
    },
    {
        name: "Eroe Popolare",
        source: "PHB14",
        features: [{ name: "Ospitalità Rurale", level: 1, source: "PHB14", description: "La gente comune ti aiuta e ti nasconde." }],
        equipment: ["Attrezzi da artigiano", "Pala", "Vaso di ferro", "Abiti comuni", "10 mo"]
    },
    {
        name: "Eremita",
        source: "PHB14",
        features: [{ name: "Scoperta", level: 1, source: "PHB14", description: "Conosci un segreto importante e unico." }],
        equipment: ["Custodia per pergamene", "Coperta invernale", "Abiti comuni", "Kit erborista", "5 mo"]
    },
    {
        name: "Forestiero",
        source: "PHB14",
        features: [{ name: "Vagabondo", level: 1, source: "PHB14", description: "Puoi trovare cibo e acqua per te e 5 persone." }],
        equipment: ["Bastone", "Trappola", "Trofeo di caccia", "Abiti da viaggiatore", "10 mo"]
    }
];

export const ALIGNMENTS = [
    "Legale Buono", "Neutrale Buono", "Caotico Buono",
    "Legale Neutrale", "Neutrale Puro", "Caotico Neutrale",
    "Legale Malvagio", "Neutrale Malvagio", "Caotico Malvagio"
];

// --- MISSING CLASSES ---

CLASSES.push(
    {
        name: "Druido",
        source: "PHB14",
        hitDie: "d8",
        description: "Un sacerdote della Vecchia Fede che brandisce poteri naturali.",
        proficiencies: {
            savingThrows: ["Intelligenza", "Saggezza"],
            armor: ["Leggera", "Media", "Scudi (non di metallo)"],
            weapons: ["Bastone ferrato", "Scimitarra", "Falce", "Dardo"],
            skills: ["Arcano", "Addestrare Animali", "Intuizione", "Medicina", "Natura", "Percezione", "Religione", "Sopravvivenza"]
        },
        equipment: ["Scudo di legno", "Scimitarra", "Armatura di cuoio", "Focus druidico", "Pacchetto da esploratore"],
        features: [
            { name: "Druidico", level: 1, source: "PHB14", description: "Conosci il linguaggio segreto dei druidi." },
            { name: "Incantesimi", level: 1, source: "PHB14", description: "Lanci magie divine della natura." },
            { name: "Forma Selvatica", level: 2, source: "PHB14", description: "Puoi trasformarti in bestie (CR 1/4, poi 1/2 al 4°, 1 all'8°)." },
            { name: "Circolo Druidico", level: 2, source: "PHB14", description: "Scegli un circolo di appartenenza." },
            { name: "Corpo Senza Tempo", level: 18, source: "PHB14", description: "Invecchi 1 anno ogni 10." },
            { name: "Incantesimi Bestiali", level: 18, source: "PHB14", description: "Lanci incantesimi in Forma Selvatica." },
            { name: "Arcidruido", level: 20, source: "PHB14", description: "Forma Selvatica illimitata." }
        ],
        suboptions: [
            { name: "Circolo della Terra", source: "PHB14", features: [{ name: "Recupero Naturale", level: 2, source: "PHB14", description: "Recuperi slot incantesimo con un riposo breve." }] },
            { name: "Circolo della Luna", source: "PHB14", features: [{ name: "Forma Selvatica da Combattimento", level: 2, source: "PHB14", description: "Trasformarsi è un'azione bonus e puoi diventare bestie più forti." }] }
        ]
    },
    {
        name: "Monaco",
        source: "PHB14",
        hitDie: "d8",
        description: "Un maestro delle arti marziali che imbriglia il potere del corpo.",
        proficiencies: {
            savingThrows: ["Forza", "Destrezza"],
            armor: [],
            weapons: ["Semplici", "Spada corta"],
            skills: ["Acrobazia", "Atletica", "Storia", "Intuizione", "Religione", "Furtività"]
        },
        equipment: ["Lancia", "Pacchetto da esploratore", "10 dardi"],
        features: [
            { name: "Difesa Senza Armatura", level: 1, source: "PHB14", description: "AC = 10 + DES + SAG." },
            { name: "Arti Marziali", level: 1, source: "PHB14", description: "Usi DES per attacchi disarmati/armi da monaco, colpo disarmato bonus." },
            { name: "Ki", level: 2, source: "PHB14", description: "Punti Ki per abilità speciali (Raffica, Difesa Paziente, Passo del Vento)." },
            { name: "Movimento Senza Armatura", level: 2, source: "PHB14", description: "Velocità aumentata (+3m, aumenta coi livelli)." },
            { name: "Deviare Missili", level: 3, source: "PHB14", description: "Riduci danni proiettili come reazione." },
            { name: "Caduta Lenta", level: 4, source: "PHB14", description: "Riduci danni da caduta." },
            { name: "Attacco Extra", level: 5, source: "PHB14", description: "Due attacchi per azione." },
            { name: "Colpo Stordente", level: 5, source: "PHB14", description: "1 Ki per stordire nemico colpito." },
            { name: "Colpi Ki Potenziati", level: 6, source: "PHB14", description: "Attacchi disarmati sono magici." },
            { name: "Elusione", level: 7, source: "PHB14", description: "Danni dimezzati o nulli su TS Destrezza." },
            { name: "Anima Diamantina", level: 14, source: "PHB14", description: "Competenza in tutti i TS." },
            { name: "Corpo Vuoto", level: 18, source: "PHB14", description: "4 Ki per invisibilità e resistenza danni (tranne forza)." },
            { name: "Perfezione Personale", level: 20, source: "PHB14", description: "Recuperi 4 Ki se inizi scontro a 0." }
        ],
        suboptions: [
            { name: "Via della Mano Aperta", source: "PHB14", features: [{ name: "Tecnica della Mano Aperta", level: 3, source: "PHB14", description: "Effetti aggiuntivi alla Raffica di Colpi." }] },
            { name: "Via dell'Ombra", source: "PHB14", features: [{ name: "Arti dell'Ombra", level: 3, source: "PHB14", description: "Usa Ki per lanciare Oscurità, Passare Senza Tracce, ecc." }] }
        ]
    },
    {
        name: "Paladino",
        source: "PHB14",
        hitDie: "d10",
        description: "Un guerriero sacro vincolato a un giuramento sacro.",
        proficiencies: {
            savingThrows: ["Saggezza", "Carisma"],
            armor: ["Tutte", "Scudi"],
            weapons: ["Semplici", "Marziali"],
            skills: ["Atletica", "Intuizione", "Intimidire", "Medicina", "Persuasione", "Religione"]
        },
        equipment: ["Spada lunga", "Scudo", "Giavellotti", "Pacchetto da sacerdote", "Cotta di maglia", "Simbolo sacro"],
        features: [
            { name: "Percepire il Divino", level: 1, source: "PHB14", description: "Individui celestiali, immondi, non morti." },
            { name: "Imposizione delle Mani", level: 1, source: "PHB14", description: "Riserva di HP per curare." },
            { name: "Stile di Combattimento", level: 2, source: "PHB14", description: "Scegli uno stile." },
            { name: "Incantesimi", level: 2, source: "PHB14", description: "Magia divina da paladino." },
            { name: "Punizione Divina", level: 2, source: "PHB14", description: "Spendi slot per danni radiosi extra." },
            { name: "Salute Divina", level: 3, source: "PHB14", description: "Immunità alle malattie." },
            { name: "Attacco Extra", level: 5, source: "PHB14", description: "Due attacchi per azione." },
            { name: "Aura di Protezione", level: 6, source: "PHB14", description: "+Carisma ai TS tuoi e degli alleati vicini." },
            { name: "Aura di Coraggio", level: 10, source: "PHB14", description: "Non puoi essere spaventato." },
            { name: "Punizione Divina Migliorata", level: 11, source: "PHB14", description: "+1d8 radioso a tutti gli attacchi." },
            { name: "Tocco Purificatore", level: 14, source: "PHB14", description: "Termini incantesimi su creatura toccata." }
        ],
        suboptions: [
            { name: "Giuramento di Devozione", source: "PHB14", features: [{ name: "Arma Sacra", level: 3, source: "PHB14", description: "Canalizza Divinità per bonus al tiro per colpire." }] },
            { name: "Giuramento degli Antichi", source: "PHB14", features: [{ name: "Ira della Natura", level: 3, source: "PHB14", description: "Imprigiona nemici con viticci." }] },
            { name: "Giuramento della Vendetta", source: "PHB14", features: [{ name: "Giuramento di Inimicizia", level: 3, source: "PHB14", description: "Vantaggio ai tiri per colpire contro un nemico." }] }
        ]
    },
    {
        name: "Ranger",
        source: "PHB14",
        hitDie: "d10",
        description: "Un guerriero che usa abilità marziali e magia della natura.",
        proficiencies: {
            savingThrows: ["Forza", "Destrezza"],
            armor: ["Leggera", "Media", "Scudi"],
            weapons: ["Semplici", "Marziali"],
            skills: ["Addestrare Animali", "Atletica", "Furtività", "Indagare", "Intuizione", "Natura", "Percezione", "Sopravvivenza"]
        },
        equipment: ["Arco lungo", "Due spade corte", "Pacchetto da esploratore", "Armatura di cuoio"],
        features: [
            { name: "Nemico Prescelto", level: 1, source: "PHB14", description: "Vantaggio sopravvivenza contro un tipo di nemico." },
            { name: "Esploratore Nato", level: 1, source: "PHB14", description: "Bonus in un tipo di terreno." },
            { name: "Stile di Combattimento", level: 2, source: "PHB14", description: "Scegli uno stile." },
            { name: "Incantesimi", level: 2, source: "PHB14", description: "Magia da ranger." },
            { name: "Attacco Extra", level: 5, source: "PHB14", description: "Due attacchi per azione." },
            { name: "Passo sulla Terra", level: 8, source: "PHB14", description: "Ignori terreno difficile non magico, vantaggio TS contro piante magiche." },
            { name: "Nascondersi in Piena Vista", level: 10, source: "PHB14", description: "+10 Furtività se immobile." },
            { name: "Svanire", level: 14, source: "PHB14", description: "Nascondersi come azione bonus." },
            { name: "Sensi Ferini", level: 18, source: "PHB14", description: "Non hai svantaggio attaccando creature invisibili." },
            { name: "Sterminatore di Nemici", level: 20, source: "PHB14", description: "Aggiungi SAG a colpire o danni contro nemico prescelto." }
        ],
        suboptions: [
            { name: "Cacciatore", source: "PHB14", features: [{ name: "Preda del Cacciatore", level: 3, source: "PHB14", description: "Scegli un bonus offensivo (es. Colosso)." }] },
            { name: "Signore delle Bestie", source: "PHB14", features: [{ name: "Compagno Animale", level: 3, source: "PHB14", description: "Ottieni un compagno animale fedele." }] },
            { name: "Gloom Stalker", source: "XGE", features: [{ name: "Assalitore del Terrore", level: 3, source: "XGE", description: "Iniziativa +SAG. Primo turno: attacco extra e +1d8 danni." }, { name: "Vista dell'Ombra", level: 3, source: "XGE", description: "Scurovisione 18m, invisibile a scurovisione nemica." }] }
        ]
    },
    {
        name: "Stregone",
        source: "PHB14",
        hitDie: "d6",
        description: "Un incantatore con magia innata offerta da un dono o una linea di sangue.",
        proficiencies: {
            savingThrows: ["Costituzione", "Carisma"],
            armor: [],
            weapons: ["Daga", "Dardo", "Fionda", "Bastone ferrato", "Balestra leggera"],
            skills: ["Arcano", "Inganno", "Intuizione", "Intimidire", "Persuasione", "Religione"]
        },
        equipment: ["Balestra leggera", "Borsa componenti", "Pacchetto da studioso", "Due pugnali"],
        features: [
            { name: "Incantesimi", level: 1, source: "PHB14", description: "Magia innata." },
            { name: "Origine Stregonesca", level: 1, source: "PHB14", description: "La fonte del tuo potere." },
            { name: "Fonte di Magia", level: 2, source: "PHB14", description: "Punti stregoneria per creare slot." },
            { name: "Metamagia", level: 3, source: "PHB14", description: "Modifica i tuoi incantesimi (altre opzioni al 10° e 17°)." },
            { name: "Restaurazione Stregonesca", level: 20, source: "PHB14", description: "Recuperi 4 Punti Stregoneria con riposo breve." }
        ],
        suboptions: [
            { name: "Discendenza Draconica", source: "PHB14", features: [{ name: "Resilienza Draconica", level: 1, source: "PHB14", description: "AC 13+DES base, +1 HP/livello." }] },
            { name: "Magia Selvaggia", source: "PHB14", features: [{ name: "Impulso di Magia Selvaggia", level: 1, source: "PHB14", description: "Possibili effetti casuali al lancio di incantesimi." }] },
            { name: "Anima Divina", source: "XGE", features: [{ name: "Magia Divina", level: 1, source: "XGE", description: "Accedi alla lista incantesimi da Chierico." }, { name: "Favorito dagli Dei", level: 1, source: "XGE", description: "+2d4 a un TS o tiro per colpire fallito (1/riposo)." }] }
        ]
    },
    {
        name: "Warlock",
        source: "PHB14",
        hitDie: "d8",
        description: "Un emissario di poteri oscuri.",
        proficiencies: {
            savingThrows: ["Saggezza", "Carisma"],
            armor: ["Leggera"],
            weapons: ["Semplici"],
            skills: ["Arcano", "Inganno", "Storia", "Intimidire", "Indagare", "Natura", "Religione"]
        },
        equipment: ["Balestra leggera", "Focus arcano", "Pacchetto da studioso", "Armatura di cuoio", "Due pugnali", "Mazza"],
        features: [
            { name: "Patrono Ultraterreno", level: 1, source: "PHB14", description: "L'entità che ti concede potere." },
            { name: "Magia del Patrono", level: 1, source: "PHB14", description: "Slot incantesimi che si ricaricano al riposo breve." },
            { name: "Invocazioni Esterne", level: 2, source: "PHB14", description: "Poteri magici unici." },
            { name: "Patto", level: 3, source: "PHB14", description: "Dono del patrono (Catena, Lama, Tomo)." },
            { name: "Arcana Mistico", level: 11, source: "PHB14", description: "Lancia inc. 6° liv (poi 7° al 13°, 8° al 15°, 9° al 17°)." },
            { name: "Maestro dell'Occulto", level: 20, source: "PHB14", description: "Recupera slot spendendo 1 minuto." }
        ],
        suboptions: [
            { name: "L'Immondo", source: "PHB14", features: [{ name: "Benedizione dell'Oscuro", level: 1, source: "PHB14", description: "Ottieni HP temporanei uccidendo nemici." }] },
            { name: "Il Grande Antico", source: "PHB14", features: [{ name: "Mente Risvegliata", level: 1, source: "PHB14", description: "Telepatia a raggio corto." }] },
            { name: "L'Arcifata", source: "PHB14", features: [{ name: "Presenza Fatata", level: 1, source: "PHB14", description: "Azione per spaventare o affascinare creature in un cubo di 3m." }] },
            { name: "Hexblade", source: "XGE", features: [{ name: "Guerriero Hex", level: 1, source: "XGE", description: "Usi Carisma per attaccare. Hai competenza armature medie e scudi." }, { name: "Maledizione della Lama", level: 1, source: "XGE", description: "Bonus danni e critico al 19." }] }
        ]
    }
);

// --- MISSING RACES ---

RACES.push(
    {
        name: "Halfling",
        source: "PHB14",
        description: "Piccoli, agili e fortunati.",
        abilityBonuses: { DEX: 2 },
        features: [
            { name: "Fortunato", level: 1, source: "PHB14", description: "Ritira 1 su d20." },
            { name: "Coraggioso", level: 1, source: "PHB14", description: "Vantaggio TS paura." },
            { name: "Agilità Halfling", level: 1, source: "PHB14", description: "Muoversi attraverso creature più grandi." }
        ],
        suboptions: [
            { name: "Piedelesto", source: "PHB14", abilityBonuses: { CHA: 1 }, features: [{ name: "Furtività Naturale", level: 1, source: "PHB14", description: "Nascondersi dietro creature medie." }] },
            { name: "Tozzo", source: "PHB14", abilityBonuses: { CON: 1 }, features: [{ name: "Resilienza dei tozzi", level: 1, source: "PHB14", description: "Vantaggio/Resistenza veleno." }] }
        ]
    },
    {
        name: "Dragonide",
        source: "PHB14",
        description: "Fieri discendenti dei draghi.",
        abilityBonuses: { STR: 2, CHA: 1 },
        features: [
            { name: "Ascendenza Draconica", level: 1, source: "PHB14", description: "Scegli un tipo di drago. Determina soffio e resistenza." },
            { name: "Arma a Soffio", level: 1, source: "PHB14", description: "Soffio elementale ad area." },
            { name: "Resistenza ai Danni", level: 1, source: "PHB14", description: "Resistenza al tipo del tuo drago." }
        ],
        suboptions: [
            { name: "Nero (Acido)", source: "PHB14", features: [{ name: "Soffio di Acido", level: 1, source: "PHB14", description: "Linea 1.5x9m, TS DES." }] },
            { name: "Blu (Fulmine)", source: "PHB14", features: [{ name: "Soffio di Fulmine", level: 1, source: "PHB14", description: "Linea 1.5x9m, TS DES." }] },
            { name: "Ottone (Fuoco)", source: "PHB14", features: [{ name: "Soffio di Fuoco", level: 1, source: "PHB14", description: "Linea 1.5x9m, TS DES." }] },
            { name: "Bronzo (Fulmine)", source: "PHB14", features: [{ name: "Soffio di Fulmine", level: 1, source: "PHB14", description: "Linea 1.5x9m, TS DES." }] },
            { name: "Rame (Acido)", source: "PHB14", features: [{ name: "Soffio di Acido", level: 1, source: "PHB14", description: "Linea 1.5x9m, TS DES." }] },
            { name: "Oro (Fuoco)", source: "PHB14", features: [{ name: "Soffio di Fuoco", level: 1, source: "PHB14", description: "Cono 4.5m, TS DES." }] },
            { name: "Verde (Veleno)", source: "PHB14", features: [{ name: "Soffio di Veleno", level: 1, source: "PHB14", description: "Cono 4.5m, TS COS." }] },
            { name: "Rosso (Fuoco)", source: "PHB14", features: [{ name: "Soffio di Fuoco", level: 1, source: "PHB14", description: "Cono 4.5m, TS DES." }] },
            { name: "Argento (Freddo)", source: "PHB14", features: [{ name: "Soffio di Freddo", level: 1, source: "PHB14", description: "Cono 4.5m, TS COS." }] },
            { name: "Bianco (Freddo)", source: "PHB14", features: [{ name: "Soffio di Freddo", level: 1, source: "PHB14", description: "Cono 4.5m, TS COS." }] }
        ]
    },
    {
        name: "Gnomo",
        source: "PHB14",
        description: "Inventori curiosi ed eccentrici.",
        features: [
            { name: "Astuzia Gnomesca", level: 1, source: "PHB14", description: "Vantaggio TS Int/Sag/Car contro magia." },
            { name: "Scurovisione", level: 1, source: "PHB14", description: "18m." }
        ],
        suboptions: [
            { name: "Gnomo delle Foreste", source: "PHB14", abilityBonuses: { DEX: 1 }, features: [{ name: "Illusionista Nato", level: 1, source: "PHB14", description: "Conosci trucchetto Illusione Minore." }] },
            { name: "Gnomo delle Rocce", source: "PHB14", abilityBonuses: { CON: 1 }, features: [{ name: "Conoscenze da Artigiano", level: 1, source: "PHB14", description: "Competenza e raddoppio storia su oggetti magici/tecnologici." }] }
        ]
    },
    {
        name: "Mezzelfo",
        source: "PHB14",
        description: "Carismatici e versatili, uniscono il meglio di due mondi.",
        abilityBonuses: { CHA: 2, DEX: 1, CON: 1 }, // Simplification: +1 to two others. Taking Dex/Con as defaults for manual wizard V2
        features: [
            { name: "Retaggio Fatato", level: 1, source: "PHB14", description: "Vantaggio contro charme, immune al sonno magico." },
            { name: "Versatilità nelle Abilità", level: 1, source: "PHB14", description: "Competenza in 2 abilità a scelta." }
        ]
    },
    {
        name: "Mezzorco",
        source: "PHB14",
        description: "Fieri guerrieri con sangue orchesco.",
        abilityBonuses: { STR: 2, CON: 1 },
        features: [
            { name: "Minacciare", level: 1, source: "PHB14", description: "Competenza in Intimidire." },
            { name: "Tenacia Implacabile", level: 1, source: "PHB14", description: "Se vai a 0 HP ma non muori, vai a 1 HP (1/riposo)." },
            { name: "Attacchi Selvaggi", level: 1, source: "PHB14", description: "Tira un dado in più sui critici in mischia." }
        ]
    },
    {
        name: "Tiefling",
        source: "PHB14",
        description: "Eredi di una stirpe infernale.",
        abilityBonuses: { CHA: 2 },
        features: [
            { name: "Scurovisione", level: 1, source: "PHB14", description: "Vedi al buio 18m." },
            { name: "Resistenza Infernale", level: 1, source: "PHB14", description: "Resistenza ai danni da fuoco." },
            { name: "Eredità Infernale", level: 1, source: "PHB14", description: "Conosci il trucchetto Thaumaturgia." }
        ],
        suboptions: [
            { name: "Stirpe di Asmodeus", source: "PHB14", abilityBonuses: { INT: 1 }, features: [{ name: "Eredità di Asmodeus", level: 1, source: "PHB14", description: "Standard PHB. +1 INT." }] },
            { name: "Stirpe di Mephistopheles", source: "MTOF", abilityBonuses: { INT: 1 }, features: [{ name: "Eredità di Mephistopheles", level: 1, source: "MTOF", description: "Mano Magica invece di Taumaturgia." }] },
            { name: "Stirpe di Zariel", source: "MTOF", abilityBonuses: { STR: 1 }, features: [{ name: "Eredità di Zariel", level: 1, source: "MTOF", description: "+1 FOR. Punizione Rovente invece di Repulsione Infernale." }] },
            { name: "Stirpe di Levistus", source: "MTOF", abilityBonuses: { CON: 1 }, features: [{ name: "Eredità di Levistus", level: 1, source: "MTOF", description: "+1 COS. Raggio di Gelo invece di Taumaturgia." }] }
        ]
    }
);

// --- FEATS ---

export const FEATS: Option[] = [
    { name: "Attore", source: "PHB14", description: "+1 Carisma. Vantaggio su Decezione/Performance quando fingi." },
    { name: "Allerta", source: "PHB14", description: "+5 Iniziativa. Non puoi essere sorpreso." },
    { name: "Atleta", source: "PHB14", description: "+1 For/Des. Ti rialzi con 1.5m. Scalare non costa extra." },
    { name: "Carica Possente", source: "PHB14", description: "Se ti muovi 3m, azione bonus per spintonare." },
    { name: "Cecchino", source: "PHB14", description: "Sharpshooter: Ignori copertura 1/2 e 3/4. Can apply -5/+10." },
    { name: "Combattente a Due Armi", source: "PHB14", description: "+1 CA con due armi. Puoi usare armi non leggere." },
    { name: "Difensore", source: "PHB14", description: "Reazione per dare svantaggio a attacco su alleato vicino." },
    { name: "Esperto di Balestre", source: "PHB14", description: "Ignori ricarica. No svantaggio in mischia. Attacco bonus con balestra a mano." },
    { name: "Fortunato", source: "PHB14", description: "Lucky: 3 punti fortuna per ritirare d20 o far ritirare nemico." },
    { name: "Guaritore", source: "PHB14", description: "Usa kit guarigione per curare 1d6+4+Lv HP." },
    { name: "Incantatore da Guerra", source: "PHB14", description: "War Caster: Vantaggio TS conc. Incantesimi come OA. Mani piene ok." },
    { name: "Iniziato alla Magia", source: "PHB14", description: "2 Trucchetti e 1 Incantesimo di 1° livello da una classe." },
    { name: "Lottatore da Taverna", source: "PHB14", description: "+1 For/Cos. Competenza armi improvvisate. Azione bonus lotta." },
    { name: "Maestro d'Armi", source: "PHB14", description: "Ottieni 3 manovre da Guerriero e dadi superiorità." },
    { name: "Maestro delle Armature Pesanti", source: "PHB14", description: "+1 For. Riduci danni taglienti/contundenti/perforanti di 3." },
    { name: "Maestro delle Armi su Asta", source: "PHB14", description: "PAM: Attacco bonus con picca/alabarda. OA quando entrano in portata." },
    { name: "Maestro delle Armi Possenti", source: "PHB14", description: "GWM: Critico/Kill da attacco bonus. Can apply -5/+10." },
    { name: "Maestro degli Scudi", source: "PHB14", description: "Bonus action spinta. +CA a TS Des. Reazione per 0 danni." },
    { name: "Mobilità", source: "PHB14", description: "+3m velocità. Scatto su terreno difficile. Se attacchi, non subisci OA." },
    { name: "Osservatore", source: "PHB14", description: "+1 Int/Sag. +5 Percezione/Indagare passiva. Leggi labiale." },
    { name: "Resiliente", source: "PHB14", description: "+1 a una stat. Competenza nei TS di quella stat." },
    { name: "Robustezza", source: "PHB14", description: "2 HP extra per livello." },
    { name: "Sentinella", source: "PHB14", description: "Sentinel: OA azzera velocità. OA anche se disimpegna. Reazione se attacca alleato." },
    { name: "Uccisore di Maghi", source: "PHB14", description: "Reazione attacco su chi lancia incantesimo. Vantaggio ai TS." }
];
