import { Source } from './common';

export interface ClassOption {
    name: string;
    hitDie: number;
    suboptions?: {
        name: string;
        abilityBonuses?: Record<string, number>;
        source?: Source;
        description?: string;
        features?: any[];
    }[];
    equipment?: string[];
    proficiencies: {
        armor: string[];
        weapons: string[];
        tools: string[];
        savingThrows: string[];
        skills: string[];
    };
    source?: Source;
    features?: any[];
}

const ALL_SKILLS = [
    "Acrobazia", "Addestrare Animali", "Arcana", "Atletica", "Furtività", "Indagare",
    "Inganno", "Intimidire", "Intrattenere", "Intuizione", "Medicina", "Natura",
    "Percezione", "Persuasione", "Rapidità di Mano", "Religione", "Sopravvivenza", "Storia"
];

export const CLASSES: ClassOption[] = [
    {
        name: 'Barbaro',
        source: 'PHB',
        hitDie: 12,
        equipment: ["Ascia Bipenne", "Due Asce da lancio", "Zaino da Esploratore", "4 Giavellotti"],
        proficiencies: {
            armor: ["Leggera", "Media", "Scudi"],
            weapons: ["Semplici", "Marziali"],
            tools: [],
            savingThrows: ["STR", "CON"],
            skills: ["Addestrare Animali", "Atletica", "Intimidire", "Natura", "Percezione", "Sopravvivenza"]
        },
        features: [
            { name: "Ira", description: "Vantaggio prove STR, bonus danni, resistenza danni contundenti/taglienti/perforanti.", level: 1, source: "PHB" },
            { name: "Difesa Senza Armatura", description: "AC = 10 + DEX + CON (se senza armatura).", level: 1, source: "PHB" },
            { name: "Attacco Irruento", description: "Vantaggio attacchi STR, ma attacchi contro di te hanno vantaggio.", level: 2, source: "PHB" },
            { name: "Percepire Pericolo", description: "Vantaggio TS DEX contro effetti visibili.", level: 2, source: "PHB" },
            { name: "Cammino Primordiale", description: "Scegli un cammino (sottoclasse).", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" },
            { name: "Attacco Extra", description: "Due attacchi per azione.", level: 5, source: "PHB" },
            { name: "Movimento Veloce", description: "+3m velocità se non indossi armatura pesante.", level: 5, source: "PHB" }
        ],
        suboptions: [
            { name: "Cammino del Berserker", source: 'PHB' },
            { name: "Cammino del Guerriero Totemico", source: 'PHB' },
            { name: "Cammino del Guardiano Ancestrale", source: 'XGE' },
            { name: "Cammino della Furia della Tempesta", source: 'XGE' },
            { name: "Cammino dello Zelota", source: 'XGE' },
            { name: "Cammino della Bestia", source: 'TCE' },
            { name: "Cammino della Magia Selvaggia", source: 'TCE' },
            { name: "Cammino del Combattente Furioso (Battlerager)", source: 'SCAG' }
        ]
    },
    {
        name: 'Bardo',
        source: 'PHB',
        hitDie: 8,
        equipment: ["Stocco", "Liuto", "Armatura di Cuoio", "Daga", "Zaino da Intrattenitore"],
        proficiencies: {
            armor: ["Leggera"],
            weapons: ["Semplici", "Balestra a mano", "Spada lunga", "Stocco", "Spada corta"],
            tools: ["Tre strumenti musicali"],
            savingThrows: ["DEX", "CHA"],
            skills: ALL_SKILLS
        },
        features: [
            { name: "Incantesimi", description: "Lanci incantesimi da bardo.", level: 1, source: "PHB" },
            { name: "Ispirazione Bardica", description: "Dai un dado bonus (d6) a un alleato.", level: 1, source: "PHB" },
            { name: "Tuttofare", description: "Aggiungi metà competenza alle prove non competenti.", level: 2, source: "PHB" },
            { name: "Canto di Riposo", description: "Alleati recuperano hp extra (1d6) durante riposo breve.", level: 2, source: "PHB" },
            { name: "Collegio Bardico", description: "Scegli un collegio (sottoclasse).", level: 3, source: "PHB" },
            { name: "Maestria", description: "Raddoppi competenza in due abilità.", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" },
            { name: "Fonte di Ispirazione", description: "Recuperi ispirazione a riposo breve.", level: 5, source: "PHB" }
        ],
        suboptions: [
            { name: "Collegio della Sapienza", source: 'PHB' },
            { name: "Collegio del Valore", source: 'PHB' },
            { name: "Collegio del Fascino", source: 'XGE' },
            { name: "Collegio delle Spade", source: 'XGE' },
            { name: "Collegio dei Sussurri", source: 'XGE' },
            { name: "Collegio della Creazione", source: 'TCE' },
            { name: "Collegio dell'Eloquenza", source: 'TCE' },
            { name: "Collegio degli Spiriti", source: 'VRGR' }
        ]
    },
    {
        name: 'Chierico',
        source: 'PHB',
        hitDie: 8,
        equipment: ["Mazza", "Corazza a Scaglie", "Balestra Leggera", "Simbolo Sacro", "Zaino da Sacerdote"],
        proficiencies: {
            armor: ["Leggera", "Media", "Scudi"],
            weapons: ["Semplici"],
            tools: [],
            savingThrows: ["WIS", "CHA"],
            skills: ["Storia", "Intuizione", "Medicina", "Persuasione", "Religione"]
        },
        features: [
            { name: "Incantesimi", description: "Lanci incantesimi da chierico.", level: 1, source: "PHB" },
            { name: "Dominio Divino", description: "Scegli un dominio (sottoclasse).", level: 1, source: "PHB" },
            { name: "Incanalare Divinità", description: "Effetto sacro (1/riposo).", level: 2, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" },
            { name: "Distruggere Non Morti", description: "Incanalare Divinità distrugge non morti deboli.", level: 5, source: "PHB" }
        ],
        suboptions: [
            { name: "Dominio della Conoscenza", source: 'PHB' },
            { name: "Dominio della Guerra", source: 'PHB' },
            { name: "Dominio della Luce", source: 'PHB' },
            { name: "Dominio della Natura", source: 'PHB' },
            { name: "Dominio della Tempesta", source: 'PHB' },
            { name: "Dominio dell'Inganno", source: 'PHB' },
            { name: "Dominio della Vita", source: 'PHB' },
            { name: "Dominio Arcano", source: 'SCAG' },
            { name: "Dominio della Forgia", source: 'XGE' },
            { name: "Dominio della Tomba", source: 'XGE' },
            { name: "Dominio dell'Ordine", source: 'TCE' },
            { name: "Dominio della Pace", source: 'TCE' },
            { name: "Dominio del Crepuscolo", source: 'TCE' },
            { name: "Dominio della Morte", source: 'PHB' } // DMG actually
        ]
    },
    {
        name: 'Druido',
        source: 'PHB',
        hitDie: 8,
        equipment: ["Scimitarra", "Scudo di Legno", "Armatura di Pelle", "Focus Druidico", "Zaino da Esploratore"],
        proficiencies: {
            armor: ["Leggera", "Media", "Scudi (no metallo)"],
            weapons: ["Semplici (druidiche)"],
            tools: ["Borsa da Erborista"],
            savingThrows: ["INT", "WIS"],
            skills: ["Addestrare Animali", "Arcana", "Intuizione", "Medicina", "Natura", "Percezione", "Religione", "Sopravvivenza"]
        },
        features: [
            { name: "Druidico", description: "Conosci il linguaggio segreto dei druidi.", level: 1, source: "PHB" },
            { name: "Incantesimi", description: "Lanci incantesimi da druido.", level: 1, source: "PHB" },
            { name: "Forma Selvatica", description: "Trasformati in bestia.", level: 2, source: "PHB" },
            { name: "Circolo Druidico", description: "Scegli un circolo (sottoclasse).", level: 2, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" }
        ],
        suboptions: [
            { name: "Circolo della Terra", source: 'PHB' },
            { name: "Circolo della Luna", source: 'PHB' },
            { name: "Circolo dei Sogni", source: 'XGE' },
            { name: "Circolo del Pastore", source: 'XGE' },
            { name: "Circolo delle Spore", source: 'TCE' },
            { name: "Circolo delle Stelle", source: 'TCE' },
            { name: "Circolo del Fuoco Selvaggio", source: 'TCE' }
        ]
    },
    {
        name: 'Guerriero',
        source: 'PHB',
        hitDie: 10,
        equipment: ["Cotta di Maglia", "Spada Lunga", "Scudo", "Balestra Leggera", "Zaino da Esploratore"],
        proficiencies: {
            armor: ["Leggera", "Media", "Pesante", "Scudi"],
            weapons: ["Semplici", "Marziali"],
            tools: [],
            savingThrows: ["STR", "CON"],
            skills: ["Acrobazia", "Addestrare Animali", "Atletica", "Storia", "Intuizione", "Intimidire", "Percezione", "Sopravvivenza"]
        },
        features: [
            { name: "Stile di Combattimento", description: "Scegli uno stile (Difesa, Duellare, etc.).", level: 1, source: "PHB" },
            { name: "Recuperare Energie", description: "Recuperi 1d10+Lv hp come azione bonus.", level: 1, source: "PHB" },
            { name: "Azione Impetuosa", description: "Una azione extra (1/riposo).", level: 2, source: "PHB" },
            { name: "Archetipo Marziale", description: "Scegli un archetipo (sottoclasse).", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" },
            { name: "Attacco Extra", description: "Due attacchi per azione.", level: 5, source: "PHB" }
        ],
        suboptions: [
            { name: "Campione", source: 'PHB' },
            { name: "Maestro di Battaglia", source: 'PHB' },
            { name: "Cavaliere Mistico", source: 'PHB' },
            { name: "Arciere Arcano", source: 'XGE' },
            { name: "Cavaliere", source: 'XGE' },
            { name: "Samurai", source: 'XGE' },
            { name: "Cavaliere del Drago Purpureo", source: 'SCAG' },
            { name: "Psi Warrior", source: 'TCE' },
            { name: "Rune Knight", source: 'TCE' },
            { name: "Echo Knight", source: 'EGW' }
        ]
    },
    {
        name: 'Monaco',
        source: 'PHB',
        hitDie: 8,
        equipment: ["Spada Corta", "Zaino da Esploratore", "10 Dardi"],
        proficiencies: {
            armor: [],
            weapons: ["Semplici", "Spada corta"],
            tools: ["Uno strumento o set artigiano"],
            savingThrows: ["STR", "DEX"],
            skills: ["Acrobazia", "Atletica", "Storia", "Intuizione", "Religione", "Furtività"]
        },
        features: [
            { name: "Difesa Senza Armatura", description: "AC = 10 + DEX + WIS.", level: 1, source: "PHB" },
            { name: "Arti Marziali", description: "Usi DEX attacchi disarmati/monaco, danno d4, bonus action colpo.", level: 1, source: "PHB" },
            { name: "Ki", description: "Punti Ki per abilità speciali (Raffica, Difesa Paziente, Passo del Vento).", level: 2, source: "PHB" },
            { name: "Movimento Senza Armatura", description: "+3m velocità.", level: 2, source: "PHB" },
            { name: "Tradizione Monastica", description: "Scegli una via (sottoclasse).", level: 3, source: "PHB" },
            { name: "Deviare Missili", description: "Riduci danno proiettili.", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" },
            { name: "Caduta Lenta", description: "Riduci danno caduta.", level: 4, source: "PHB" },
            { name: "Attacco Extra", description: "Due attacchi per azione.", level: 5, source: "PHB" },
            { name: "Colpo Stordente", description: "Spendi Ki per stordire nemico.", level: 5, source: "PHB" }
        ],
        suboptions: [
            { name: "Via della Mano Aperta", source: 'PHB' },
            { name: "Via dell'Ombra", source: 'PHB' },
            { name: "Via dei Quattro Elementi", source: 'PHB' },
            { name: "Via dell'Anima Solare", source: 'XGE' }, // Also SCAG
            { name: "Via della Lunga Morte", source: 'SCAG' }, // Reprint
            { name: "Via del Kensei", source: 'XGE' },
            { name: "Via del Maestro Ubriaco", source: 'XGE' },
            { name: "Via della Misericordia", source: 'TCE' },
            { name: "Via del Sé Astrale", source: 'TCE' },
            { name: "Via del Drago Ascendente", source: 'FTD' }
        ]
    },
    {
        name: 'Paladino',
        source: 'PHB',
        hitDie: 10,
        equipment: ["Spada Lunga", "Scudo", "Cotta di Maglia", "Simbolo Sacro", "Zaino da Esploratore"],
        proficiencies: {
            armor: ["Leggera", "Media", "Pesante", "Scudi"],
            weapons: ["Semplici", "Marziali"],
            tools: [],
            savingThrows: ["WIS", "CHA"],
            skills: ["Atletica", "Intuizione", "Intimidire", "Medicina", "Persuasione", "Religione"]
        },
        features: [
            { name: "Percepire il Divino", description: "Individui celestiali, immondi, non morti.", level: 1, source: "PHB" },
            { name: "Imposizione delle Mani", description: "Pool di cura pari a Lv x 5.", level: 1, source: "PHB" },
            { name: "Stile di Combattimento", description: "Scegli uno stile.", level: 2, source: "PHB" },
            { name: "Incantesimi", description: "Lanci incantesimi da paladino.", level: 2, source: "PHB" },
            { name: "Punizione Divina", description: "Spendi slot per danno radioso extra.", level: 2, source: "PHB" },
            { name: "Salute Divina", description: "Immune alle malattie.", level: 3, source: "PHB" },
            { name: "Giuramento Sacro", description: "Scegli un giuramento (sottoclasse).", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" },
            { name: "Attacco Extra", description: "Due attacchi per azione.", level: 5, source: "PHB" }
        ],
        suboptions: [
            { name: "Giuramento di Devozione", source: 'PHB' },
            { name: "Giuramento degli Antichi", source: 'PHB' },
            { name: "Giuramento di Vendetta", source: 'PHB' },
            { name: "Giuramento della Corona", source: 'SCAG' },
            { name: "Giuramento di Conquista", source: 'XGE' },
            { name: "Giuramento di Redenzione", source: 'XGE' },
            { name: "Giuramento di Gloria", source: 'TCE' }, // Theros
            { name: "Giuramento degli Osservatori", source: 'TCE' },
            { name: "Giuramento Infranto", source: 'PHB' } // DMG
        ]
    },
    {
        name: 'Ranger',
        source: 'PHB',
        hitDie: 10,
        equipment: ["Arco Lungo", "Due Spade Corte", "Armatura di Cuoio Borchiato", "Zaino da Esploratore"],
        proficiencies: {
            armor: ["Leggera", "Media", "Scudi"],
            weapons: ["Semplici", "Marziali"],
            tools: [],
            savingThrows: ["STR", "DEX"],
            skills: ["Addestrare Animali", "Atletica", "Intuizione", "Indagare", "Natura", "Percezione", "Furtività", "Sopravvivenza"]
        },
        features: [
            { name: "Nemico Prescelto", description: "Vantaggio vs tipo nemico.", level: 1, source: "PHB" },
            { name: "Esploratore Nato", description: "Vantaggi in terreno prescelto.", level: 1, source: "PHB" },
            { name: "Stile di Combattimento", description: "Scegli uno stile.", level: 2, source: "PHB" },
            { name: "Incantesimi", description: "Lanci incantesimi da ranger.", level: 2, source: "PHB" },
            { name: "Archetipo Ranger", description: "Scegli un archetipo (sottoclasse).", level: 3, source: "PHB" },
            { name: "Consapevolezza Primordiale", description: "Scovi aberrazioni, bestie, ecc.", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" },
            { name: "Attacco Extra", description: "Due attacchi per azione.", level: 5, source: "PHB" }
        ],
        suboptions: [
            { name: "Cacciatore", source: 'PHB' },
            { name: "Signore delle Bestie", source: 'PHB' },
            { name: "Uccisore di Mostri", source: 'XGE' },
            { name: "Viandante dell'Orizzonte", source: 'XGE' },
            { name: "Cacciatore delle Tenebre", source: 'XGE' },
            { name: "Custode dello Sciame", source: 'TCE' },
            { name: "Viandante Fatato", source: 'TCE' },
            { name: "Guardiano dei Draghi", source: 'FTD' }
        ]
    },
    {
        name: 'Ladro',
        source: 'PHB',
        hitDie: 8,
        equipment: ["Stocco", "Arco Corto", "Armatura di Cuoio", "Due Daghe", "Strumenti da Scasso", "Zaino da Scassinatore"],
        proficiencies: {
            armor: ["Leggera"],
            weapons: ["Semplici", "Balestra a mano", "Spada lunga", "Stocco", "Spada corta"],
            tools: ["Strumenti da Scasso"],
            savingThrows: ["DEX", "INT"],
            skills: ["Acrobazia", "Atletica", "Inganno", "Intuizione", "Intimidire", "Indagare", "Percezione", "Intrattenere", "Persuasione", "Rapidità di Mano", "Furtività"]
        },
        features: [
            { name: "Maestria", description: "Raddoppi competenza in due abilità.", level: 1, source: "PHB" },
            { name: "Attacco Furtivo", description: "Danno extra se hai vantaggio.", level: 1, source: "PHB" },
            { name: "Gergo Ladresco", description: "Linguaggio segreto.", level: 1, source: "PHB" },
            { name: "Azione Cunning", description: "Azione bonus per scattare, disimpegnarsi, nascondersi.", level: 2, source: "PHB" },
            { name: "Archetipo Ladresco", description: "Scegli un archetipo (sottoclasse).", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" },
            { name: "Schivata Prodigiosa", description: "Dimezzi danno reazione.", level: 5, source: "PHB" }
        ],
        suboptions: [
            { name: "Furfante", source: 'PHB' },
            { name: "Assassino", source: 'PHB' },
            { name: "Mistificatore Arcano", source: 'PHB' },
            { name: "Inquisitore", source: 'XGE' },
            { name: "Mastermind", source: 'XGE' }, // SCAG
            { name: "Spadaccino", source: 'XGE' }, // SCAG
            { name: "Scout", source: 'XGE' },
            { name: "Fantasma", source: 'TCE' },
            { name: "Soulknife", source: 'TCE' }
        ]
    },
    {
        name: 'Stregone',
        source: 'PHB',
        hitDie: 6,
        equipment: ["Balestra Leggera", "Focus Arcano", "Daga", "Due Daghe", "Zaino da Esploratore"],
        proficiencies: {
            armor: [],
            weapons: ["Daghe", "Dardi", "Fionde", "Bastoni ferrati", "Balestre leggere"],
            tools: [],
            savingThrows: ["CON", "CHA"],
            skills: ["Arcana", "Inganno", "Intuizione", "Intimidire", "Persuasione", "Religione"]
        },
        features: [
            { name: "Incantesimi", description: "Lanci incantesimi da stregone.", level: 1, source: "PHB" },
            { name: "Origine Stregonesca", description: "Scegli un'origine (sottoclasse).", level: 1, source: "PHB" },
            { name: "Fonte di Magia", description: "Punti stregoneria.", level: 2, source: "PHB" },
            { name: "Metamagia", description: "Modifichi incantesimi (2 opzioni).", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" }
        ],
        suboptions: [
            { name: "Discendenza Draconica", source: 'PHB' },
            { name: "Magia Selvaggia", source: 'PHB' },
            { name: "Anima Divina", source: 'XGE' },
            { name: "Magia dell'Ombra", source: 'XGE' },
            { name: "Stregoneria della Tempesta", source: 'XGE' }, // SCAG
            { name: "Mente Aberrante", source: 'TCE' },
            { name: "Anima Meccanica", source: 'TCE' }
        ]
    },
    {
        name: 'Warlock',
        source: 'PHB',
        hitDie: 8,
        equipment: ["Balestra Leggera", "Focus Arcano", "Armatura di Cuoio", "Daga", "Zaino da Studioso"],
        proficiencies: {
            armor: ["Leggera"],
            weapons: ["Semplici"],
            tools: [],
            savingThrows: ["WIS", "CHA"],
            skills: ["Arcana", "Inganno", "Storia", "Intimidire", "Indagare", "Natura", "Religione"]
        },
        features: [
            { name: "Patrono Ultraterreno", description: "Scegli un patrono (sottoclasse).", level: 1, source: "PHB" },
            { name: "Magia del Patto", description: "Incantesimi warlock (slot ricarica breve).", level: 1, source: "PHB" },
            { name: "Suppliche Occulte", description: "2 suppliche (poteri passivi).", level: 2, source: "PHB" },
            { name: "Patto", description: "Scegli il Patto della Catena, Lama o Tomo.", level: 3, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" }
        ],
        suboptions: [
            { name: "L'Immondo", source: 'PHB' },
            { name: "L'Arcifata", source: 'PHB' },
            { name: "Il Grande Antico", source: 'PHB' },
            { name: "Il Celestiale", source: 'XGE' },
            { name: "La Lama del Malocchio", source: 'XGE' },
            { name: "L'Immortale (Undying)", source: 'SCAG' },
            { name: "L'Insondabile", source: 'TCE' },
            { name: "Il Genio", source: 'TCE' },
            { name: "Il Non Morto (Undead)", source: 'VRGR' }
        ]
    },
    {
        name: 'Mago',
        source: 'PHB',
        hitDie: 6,
        equipment: ["Bastone Ferrato", "Focus Arcano", "Libro degli Incantesimi", "Zaino da Studioso"],
        proficiencies: {
            armor: [],
            weapons: ["Daghe", "Dardi", "Fionde", "Bastoni ferrati", "Balestre leggere"],
            tools: [],
            savingThrows: ["INT", "WIS"],
            skills: ["Arcana", "Storia", "Intuizione", "Indagare", "Medicina", "Religione"]
        },
        features: [
            { name: "Incantesimi", description: "Lanci incantesimi da mago, libro.", level: 1, source: "PHB" },
            { name: "Recupero Arcano", description: "Recuperi slot con riposo breve.", level: 1, source: "PHB" },
            { name: "Tradizione Arcana", description: "Scegli una scuola (sottoclasse).", level: 2, source: "PHB" },
            { name: "Incremento Caratteristica", description: "+2 a una stat o talento.", level: 4, source: "PHB" }
        ],
        suboptions: [
            { name: "Scuola di Abiurazione", source: 'PHB' },
            { name: "Scuola di Evocazione", source: 'PHB' },
            { name: "Scuola di Divinazione", source: 'PHB' },
            { name: "Scuola di Ammaliamento", source: 'PHB' },
            { name: "Scuola di Invocazione", source: 'PHB' },
            { name: "Scuola di Illusione", source: 'PHB' },
            { name: "Scuola di Negromanzia", source: 'PHB' },
            { name: "Scuola di Trasmutazione", source: 'PHB' },
            { name: "Magia della Guerra", source: 'XGE' },
            { name: "Cantore della Lama", source: 'TCE' }, // SCAG original
            { name: "Ordine degli Scribi", source: 'TCE' },
            { name: "Cronurgia", source: 'EGW' },
            { name: "Graviturgia", source: 'EGW' }
        ]
    },
    {
        name: 'Artefice',
        source: 'TCE',
        hitDie: 8,
        equipment: ["Balestra Leggera", "Armatura di Cuoio Borchiato", "Strumenti da Ladro", "Strumenti da Tinker", "Zaino da Esploratore"],
        proficiencies: {
            armor: ["Leggera", "Media", "Scudi"],
            weapons: ["Semplici"],
            tools: ["Strumenti da Ladro", "Strumenti da Tinker", "Strumenti da Artigiano a scelta"],
            savingThrows: ["CON", "INT"],
            skills: ["Arcana", "Storia", "Indagare", "Medicina", "Natura", "Percezione", "Rapidità di Mano"]
        },
        features: [
            { name: "Tinkering Magico", description: "Crei piccoli oggetti magici.", level: 1, source: "TCE" },
            { name: "Incantesimi", description: "Lanci incantesimi da artefice.", level: 1, source: "TCE" },
            { name: "Infondere Oggetto", description: "Potenzi oggetti.", level: 2, source: "TCE" },
            { name: "Specialista Artefice", description: "Scegli una specialità (sottoclasse).", level: 3, source: "TCE" },
            { name: "Strumento Giusto per il Lavoro", description: "Crei strumenti artigiani.", level: 3, source: "TCE" },
            { name: "Incremento Caratteristica", description: "+2 a una stat.", level: 4, source: "TCE" }
        ],
        suboptions: [
            { name: "Alchimista", source: 'TCE' },
            { name: "Armaiolo", source: 'TCE' },
            { name: "Artigliere", source: 'TCE' },
            { name: "Fabbro da Battaglia", source: 'TCE' }
        ]
    }
];
