export interface Invocation {
    name: string;
    source: string;
    description: string;
    prerequisite?: string;
    level?: number;
}

export const INVOCATIONS: Invocation[] = [
    // --- PHB ---
    { name: "Armatura di Ombre", source: "PHB", description: "Lanci Armatura Magica su te stesso a volontà, senza spendere slot incantesimo o componenti materiali." },
    { name: "Ascendente Celestiale", source: "XGE", description: "Puoi lanciare Saltare su te stesso a volontà. (Richiede Lv 9)" },
    { name: "Benedizione del Tessitore di Inganni", source: "XGE", description: "Puoi lanciare Benedizione usando uno slot incantesimo da Warlock. (Richiede Patto Lama/Tomo/Catena? No, solo Tessitore)" },
    { name: "Catene di Carceri", source: "PHB", description: "Puoi lanciare Blocca Mostri a volontà se il bersaglio è un celestiale, immondo o elementale. Devi finire un riposo lungo prima di riusarlo. (Richiede Lv 15, Patto della Catena)" },
    { name: "Deflagrazione Agonizzante", source: "PHB", description: "Aggiungi il modificatore di Carisma ai danni di Deflagrazione Occulta." },
    { name: "Deflagrazione Respingente", source: "PHB", description: "Quando colpisci con Deflagrazione Occulta, puoi spingere la creatura di 3 metri." },
    { name: "Dono degli Abissi", source: "XGE", description: "Puoi respirare sott'acqua e hai velocità di nuotare." },
    { name: "Dono dei Protettori", source: "TCE", description: "Una nuova pagina appare nel Tomo delle Ombre. Puoi scrivere il nome di creature..." },
    { name: "Fuga del Tessitore di Inganni", source: "XGE", description: "Puoi lanciare Libertà di Movimento su te stesso una volta per riposo lungo. (Richiede Lv 7)" },
    { name: "Lama Assetata", source: "PHB", description: "Puoi attaccare due volte invece di una quando usi l'azione di Attacco con l'arma del patto. (Richiede Lv 5, Patto della Lama)" },
    { name: "Lancio Stregato", source: "PHB", description: "La gittata di Deflagrazione Occulta diventa 90 metri." },
    { name: "Ladro dei Cinque Fati", source: "PHB", description: "Puoi lanciare Anatema una volta usando uno slot incantesimo da Warlock. Devi finire un riposo lungo prima di riusarlo." },
    { name: "Libro degli Antichi Segreti", source: "PHB", description: "Incidi rituali nel tuo Libro delle Ombre. (Richiede Patto del Tomo)" },
    { name: "Lingua della Bestia", source: "PHB", description: "Puoi lanciare Parlare con gli Animali a volontà." },
    { name: "Maestro delle Forme Mutevoli", source: "PHB", description: "Puoi lanciare Alterare Se Stesso a volontà. (Richiede Lv 15)" },
    { name: "Mente Occulta", source: "XGE", description: "Vantaggio ai TS su Costituzione per mantenere la concentrazione." },
    { name: "Migliaia di Forme", source: "PHB", description: "Puoi lanciare Alterare Se Stesso a volontà. (Errata: questo è Maestro delle Forme Mutevoli. Migliaia di Forme richiede Lv 14? No, c'è confusione. Verifico: Master of Myriad Forms = Alter Self at will, Lv 15. Sculptor of Flesh = Polymorph once, Lv 7.)" },
    { name: "Occhi del Custode delle Rune", source: "PHB", description: "Puoi leggere tutte le scritte." },
    { name: "Occhi della Bestia", source: "PHB", description: "Vedi nelle tenebre magiche e non magiche fino a 36m (Vista del Diavolo)." },
    { name: "Passo dell'Asceta", source: "PHB", description: "Puoi lanciare Saltare su te stesso a volontà. (Otherworldly Leap)." },
    { name: "Parola del Terrore", source: "PHB", description: "Puoi lanciare Scagliare Maledizione una volta usando uno slot. (Sign of Ill Omen)." },
    { name: "Presenza Terrificante", source: "PHB", description: "Competenza in Inganno e Persuasione. (Beguiling Influence)." },
    { name: "Prigione di Ghiaccio", source: "XGE", description: "Puoi lanciare Tomba di Ghiaccio una volta per riposo lungo. (Tomb of Levistus)." },
    { name: "Punizione Migliorata", source: "XGE", description: "Eldritch Smite: spendi slot per danni extra e atterrare." },
    { name: "Scultore della Carne", source: "PHB", description: "Puoi lanciare Metamorfosi una volta usando uno slot da Warlock. (Richiede Lv 7)." },
    { name: "Sguardo Spettrale", source: "XGE", description: "Vedi attraverso oggetti solidi fino a 9m. (Ghostly Gaze, Lv 7)." },
    { name: "Sussurri della Tomba", source: "PHB", description: "Puoi lanciare Parlare con i Morti a volontà. (Richiede Lv 9)." },
    { name: "Vigore Demoniaco", source: "PHB", description: "Puoi lanciare Vita Falsata su te stesso a volontà come incantesimo di 1° livello." },
    { name: "Visioni di Regni Lontani", source: "PHB", description: "Puoi lanciare Occhio Arcano a volontà. (Richiede Lv 15)." },
    { name: "Visioni Nebbiose", source: "PHB", description: "Puoi lanciare Immagine Silenziosa a volontà." },
    { name: "Vista del Diavolo", source: "PHB", description: "Vedi nell'oscurità, anche magica, fino a 36 metri." },
    { name: "Voce del Padrone della Catena", source: "PHB", description: "Puoi comunicare telepaticamente col tuo famiglio e percepire attraverso i suoi sensi. (Richiede Patto della Catena)." },
    { name: "Volto di Mille Forme", source: "PHB", description: "Puoi lanciare Alterare Se Stesso a volontà. (Livello 15)." }
];
