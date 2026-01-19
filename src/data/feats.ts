export interface Feat {
    name: string;
    description: string;
    source?: string;
    prerequisite?: string;
}

export const FEATS: Feat[] = [
    { name: "Allerta", description: "+5 Iniziativa, non puoi essere sorpreso.", source: "PHB" },
    { name: "Atleta", description: "+1 STR/DEX, alzarsi costa meno, arrampicata veloce.", source: "PHB" },
    { name: "Attaccante Furioso", description: "Ritira dadi danno arma da mischia.", source: "PHB" },
    { name: "Attore", description: "+1 CHA, vantaggio Deception/Performance per fingere.", source: "PHB" },
    { name: "Cecchino", description: "Ignora copertura 1/2 e 3/4. Opzione -5 colpo / +10 danno con armi a distanza.", source: "PHB" },
    { name: "Combattente a Due Armi", description: "+1 AC con due armi. Puoi usare due armi non leggere.", source: "PHB" },
    { name: "Combattente in Sella", description: "Vantaggio contro creature più piccole mentre in sella.", source: "PHB" },
    { name: "Durevole", description: "+1 CON. Recuperi min 2xCON HP nei dadi vita.", source: "PHB" },
    { name: "Esperto di Balestre", description: "Ignora ricarica. No svantaggio in mischia. Attacco bonus con balestra a mano.", source: "PHB" },
    { name: "Fortunato", description: "3 Punti Fortuna per ritirare d20.", source: "PHB" },
    { name: "Guaritore", description: "Usa kit per curare 1d6+4+Liv HP.", source: "PHB" },
    { name: "Incantatore da Guerra", description: "Vantaggio COS per concentrazione. Lancia incantesimi come reazione. Lancia con armi in mano.", source: "PHB" },
    { name: "Incantatore Rituale", description: "Impara due rituali di una classe.", source: "PHB" },
    { name: "Iniziato alla Magia", description: "Impara 2 trucchetti e 1 incantesimo liv 1.", source: "PHB" },
    { name: "Ispiratore", description: "Trascorri 10 min per dare HP temporanei (Liv + CHA) a 6 alleati.", source: "PHB" },
    { name: "Lottatore da Taverna", description: "+1 STR/CON. Danno senz'armi d4. Azione bonus per lottare.", source: "PHB" },
    { name: "Maestro d'Armi", description: "+1 STR/DEX. Impara 2 Manovre da Guerriero.", source: "PHB" },
    { name: "Maestro degli Scudi", description: "Azione bonus spingere con scudo. Bonus DEX save. Reazione per 0 danni.", source: "PHB" },
    { name: "Maestro delle Armature Medie", description: "Nessuno svantaggio furtività. Max DEX +3.", source: "PHB" },
    { name: "Maestro delle Armature Pesanti", description: "+1 STR. Riduci danni taglienti/perforanti/contundenti di 3.", source: "PHB" },
    { name: "Maestro delle Armi su Asta", description: "Attacco bonus col manico (d4). Attacco opportunità quando entrano in portata.", source: "PHB" },
    { name: "Maestro delle Armi Pesanti", description: "Crit/Kill dà attacco bonus. Opzione -5 colpo / +10 danno.", source: "PHB" },
    { name: "Mente Acuta", description: "+1 INT. Sai sempre nord, ore, e ricordi tutto di un mese fa.", source: "PHB" },
    { name: "Mobile", description: "+3m velocità. Scatto ignora terreno difficile. Attacco evita opportunità.", source: "PHB" },
    { name: "Osservatore", description: "+1 INT/WIS. +5 Pecezione/Indagare passiva. Leggi labbra.", source: "PHB" },
    { name: "Resiliente", description: "+1 a una stats e competenza nel TS.", source: "PHB" },
    { name: "Robustezza", description: "+2 HP per livello.", source: "PHB" },
    { name: "Sentinella", description: "Colpisci chi disingaggia. Blocchi movimento. Colpisci chi attacca alleati.", source: "PHB" },
    { name: "Sterminatore di Maghi", description: "Reazione colpisce chi casta. Vantaggio save vs cast entro 1.5m.", source: "PHB" },
    { name: "Adepto Elementale", description: "Ignora resistenza elemento scelto. 1 diventa 2 nei danni.", source: "PHB" },
    { name: "Telecinetico", description: "+1 INT/WIS/CHA. Mano magica invisibile. Spinta bonus action.", source: "Tasha" },
    { name: "Telepatico", description: "+1 INT/WIS/CHA. Telepatia 18m. Individuazione pensieri.", source: "Tasha" },
    { name: "Toccato dalla Fate (Fey Touched)", description: "+1 INT/WIS/CHA. Passo Velato + 1 Incantesimo Div/Evo.", source: "Tasha" },
    { name: "Toccato dall'Ombra (Shadow Touched)", description: "+1 INT/WIS/CHA. Invisibilità + 1 Incantesimo Ill/Nec.", source: "Tasha" },
    { name: "Cuoco", description: "+1 CON/WIS. Cibo cura extra HP.", source: "Tasha" },
    { name: "Metamagia Adepta", description: "Impara 2 opzioni metamagia e 2 punti stregoneria.", source: "Tasha" },
    { name: "Maestro delle Armi da Lancio", description: "+1 STR/DEX. Estrai arma come parte attacco. +2 danni dist.", source: "Tasha" },
    { name: "Combattimento Cieco", description: "Vista cieca 3m.", source: "Tasha" }
];
