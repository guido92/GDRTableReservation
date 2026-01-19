import { Source, Feature } from './common';

export interface Background {
    name: string;
    skillProficiencies: string[];
    toolProficiencies?: string[];
    languages?: string[];
    equipment?: string[];
    features: Feature[]; // Array of feature objects
    source?: Source;
}

export const BACKGROUNDS: Background[] = [
    {
        name: "Accolito",
        skillProficiencies: ["Intuizione", "Religione"],
        languages: ["Due a scelta"],
        features: [{ name: "Rifugio del Fedele", description: "Ottieni cure e supporto dal tuo tempio.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Artigiano di Gilda",
        skillProficiencies: ["Intuizione", "Persuasione"],
        toolProficiencies: ["Uno strumento da artigiano"],
        languages: ["Uno a scelta"],
        features: [{ name: "Iscrizione alla Gilda", description: "Supporto dalla gilda, accesso a politici.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Artista (Intrattenitore)",
        skillProficiencies: ["Acrobazia", "Intrattenere"],
        toolProficiencies: ["Kit per il trucco", "Uno strumento musicale"],
        features: [{ name: "A Richiesta", description: "Puoi trovare sempre vitto e alloggio esibendoti.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Ciarlatano",
        skillProficiencies: ["Inganno", "Rapidità di Mano"],
        toolProficiencies: ["Kit per il trucco", "Kit per falsificare"],
        features: [{ name: "Falsa Identità", description: "Hai una seconda identità con documenti falsi.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Criminale",
        skillProficiencies: ["Furtività", "Inganno"],
        toolProficiencies: ["Strumenti da ladro", "Un gioco"],
        features: [{ name: "Contatto Criminale", description: "Hai un contatto affidabile nel mondo criminale.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Eremita",
        skillProficiencies: ["Medicina", "Religione"],
        toolProficiencies: ["Borsa da erborista"],
        languages: ["Uno a scelta"],
        features: [{ name: "Scoperta", description: "Conosci un segreto importante sull'universo.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Eroe Popolare",
        skillProficiencies: ["Addestrare Animali", "Sopravvivenza"],
        toolProficiencies: ["Uno strumento da artigiano", "Veicoli terrestri"],
        features: [{ name: "Ospitalità Rurale", description: "La gente comune ti nasconde e ti aiuta.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Forestiero",
        skillProficiencies: ["Atletica", "Sopravvivenza"],
        toolProficiencies: ["Uno strumento musicale"],
        languages: ["Uno a scelta"],
        features: [{ name: "Viandante", description: "Ricordi mappe e geografia, trovi cibo per 6 persone.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Giullare",
        skillProficiencies: ["Acrobazia", "Intrattenere"],
        features: [{ name: "Satira Tagliente", description: "Puoi dire insulti come fossero scherzi.", level: 1 }],
        source: 'PHB' // Actually expansion, but marking PHB for ease
    },
    {
        name: "Gladiatore",
        skillProficiencies: ["Acrobazia", "Intrattenere"],
        features: [{ name: "Fama dell'Arena", description: "Sei famoso e temuto.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Marinaio",
        skillProficiencies: ["Atletica", "Percezione"],
        toolProficiencies: ["Strumenti da navigatore", "Veicoli acquatici"],
        features: [{ name: "Passaggio Nave", description: "Puoi ottenere un passaggio su navi per te e il gruppo.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Nobile",
        skillProficiencies: ["Persuasione", "Storia"],
        toolProficiencies: ["Un gioco"],
        languages: ["Uno a scelta"],
        features: [{ name: "Posizione di Privilegio", description: "Sei benvenuto nell'alta società.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Riccio (Urchin)",
        skillProficiencies: ["Furtività", "Rapidità di Mano"],
        toolProficiencies: ["Kit per il trucco", "Strumenti da ladro"],
        features: [{ name: "Segreti Cittadini", description: "Conosci le vie e i passaggi segreti della città.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Sapiente (Sage)",
        skillProficiencies: ["Arcana", "Storia"],
        languages: ["Due a scelta"],
        features: [{ name: "Ricercatore", description: "Sai dove trovare le informazioni che non conosci.", level: 1 }],
        source: 'PHB'
    },
    {
        name: "Soldato",
        skillProficiencies: ["Atletica", "Intimidire"],
        toolProficiencies: ["Un gioco", "Veicoli terrestri"],
        features: [{ name: "Grado Militare", description: "I soldati ti riconoscono e puoi accedere accampamenti.", level: 1 }],
        source: 'PHB'
    }
];

export const PERSONALITY_TRAITS = [
    "Sono sempre educato e rispettoso.",
    "Non mi fido di nessuno.",
    "Bevo per dimenticare.",
    "Vedo presagi ovunque.",
    "Sono un inguaribile ottimista.",
    "Dico sempre quello che penso.",
    "Ho un tic nervoso quando mento.",
    "Colleziono trofei dai miei nemici.",
    "Parlo con gli animali (o credo di farlo).",
    "Sono guidato da una voce nella mia testa."
];

export const IDEALS = [
    "Giustizia: I cattivi devono pagare.",
    "Libertà: Le catene sono fatte per essere spezzate.",
    "Conoscenza: Il sapere è potere.",
    "Gloria: Voglio che il mio nome sia leggenda.",
    "Natura: Il mondo naturale va protetto.",
    "Potere: Solo i forti sopravvivono.",
    "Carità: Aiuto sempre chi ha bisogno.",
    "Lealtà: Non tradisco mai i miei amici.",
    "Caos: Il cambiamento è l'unica costante.",
    "Logica: Le emozioni offuscano il giudizio."
];

export const BONDS = [
    "Farei di tutto per proteggere la mia famiglia.",
    "Cerco vendetta per la distruzione del mio villaggio.",
    "Il mio onore è la mia vita.",
    "Ho un debito con un potente benefattore.",
    "Proteggo un antico segreto.",
    "Cerco l'illuminazione spirituale.",
    "Voglio ritrovare una persona scomparsa.",
    "Sono fedele al mio sovrano.",
    "Il mio tempio è la mia casa.",
    "Il mio compagno animale è il mio unico amico."
];

export const FLAWS = [
    "Non so resistere all'oro.",
    "Ho paura del buio.",
    "Sono arrogante e presuntuoso.",
    "Non riesco a mantenere un segreto.",
    "Ho un debito di gioco enorme.",
    "Sono ricercato per un crimine che non ho commesso (o forse sì).",
    "Mi fido troppo facilmente.",
    "Sono irascibile e violento.",
    "Ho una fobia dei ragni.",
    "Mangio quando sono nervoso."
];
