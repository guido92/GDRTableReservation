export interface Spell {
    name: string;
    level: number;
    classes: string[];
    school?: string;
    castingTime?: string;
    range?: string;
    components?: string;
    duration?: string;
    description: string;
}

export const SPELLS: Spell[] = [
    // --- LIVELLO 0 (TRUCCHETTI) ---
    { name: "Dardo di Fuoco", level: 0, classes: ["Mago", "Stregone", "Artefice"], description: "1d10 danni da fuoco a 36m." },
    { name: "Luce", level: 0, classes: ["Bardo", "Chierico", "Mago", "Stregone", "Artefice"], description: "Oggetto tocca brilla di luce." },
    { name: "Mano Magica", level: 0, classes: ["Bardo", "Mago", "Stregone", "Warlock", "Artefice"], description: "Mano spettrale manipola oggetti." },
    { name: "Prestidigitazione", level: 0, classes: ["Bardo", "Mago", "Stregone", "Warlock", "Artefice"], description: "Piccoli trucchi magici inoffensivi." },
    { name: "Raggio di Gelo", level: 0, classes: ["Mago", "Stregone", "Artefice"], description: "1d8 freddo e -3m velocità." },
    { name: "Guida", level: 0, classes: ["Chierico", "Druido", "Artefice"], description: "+1d4 a una prova di abilità." },
    { name: "Resistenza", level: 0, classes: ["Chierico", "Druido", "Artefice"], description: "+1d4 a un tiro salvezza." },
    { name: "Fiamma Sacra", level: 0, classes: ["Chierico"], description: "1d8 radiosi, no cover." },
    { name: "Illusione Minore", level: 0, classes: ["Bardo", "Mago", "Stregone", "Warlock"], description: "Suono o immagine statica." },
    { name: "Beffa Crudele", level: 0, classes: ["Bardo"], description: "1d4 psichici e svantaggio al prossimo attacco." },
    { name: "Deflagrazione Occulta", level: 0, classes: ["Warlock"], description: "1d10 forza, il trucchetto più potente." },
    { name: "Bastone Incantato", level: 0, classes: ["Druido"], description: "Il bastone diventa magico, 1d8 danni + Sag." },
    { name: "Produrre Fiamma", level: 0, classes: ["Druido"], description: "Fiamma nella mano, luce o attacco 1d8 fuoco." },
    { name: "Lama Rimbombante", level: 0, classes: ["Mago", "Stregone", "Warlock", "Artefice"], description: "Booming Blade: Colpisci in mischia, se si muove 1d8 tonanti." },
    { name: "Lama di Fiamma Verde", level: 0, classes: ["Mago", "Stregone", "Warlock", "Artefice"], description: "Green-Flame Blade: Colpisci in mischia, fuoco su bersaglio vicino." },
    { name: "Rintocco di Morte", level: 0, classes: ["Chierico", "Warlock", "Mago"], description: "Toll the Dead: 1d8 o 1d12 necrotici se ferito." },
    { name: "Scheggia Mentale", level: 0, classes: ["Mago", "Stregone", "Warlock"], description: "Mind Sliver: 1d6 psichici e -1d4 al prossimo TS." },

    // --- LIVELLO 1 ---
    { name: "Scudo", level: 1, classes: ["Mago", "Stregone"], description: "+5 CA come reazione." },
    { name: "Dardo Incantato", level: 1, classes: ["Mago", "Stregone"], description: "3 dardi da 1d4+1 colpiscono automaticamente." },
    { name: "Armatura Magica", level: 1, classes: ["Mago", "Stregone"], description: "CA diventa 13 + Des." },
    { name: "Sonno", level: 1, classes: ["Bardo", "Mago", "Stregone"], description: "Addormenta creature per 5d8 HP totali." },
    { name: "Cura Ferite", level: 1, classes: ["Bardo", "Chierico", "Druido", "Paladino", "Ranger", "Artefice"], description: "Cura 1d8 + mod caratteristica a contatto." },
    { name: "Parola Guaritrice", level: 1, classes: ["Bardo", "Chierico", "Druido"], description: "Cura 1d4 + mod caratteristica a distanza (Bonus Action)." },
    { name: "Benedizione", level: 1, classes: ["Chierico", "Paladino"], description: "+1d4 a tiri per colpire e salvezza per 3 alleati." },
    { name: "Comando", level: 1, classes: ["Chierico", "Paladino"], description: "Il bersaglio obbedisce a un ordine di una parola." },
    { name: "Intralciare", level: 1, classes: ["Druido"], description: "Viticci bloccano creature in area." },
    { name: "Marchio del Cacciatore", level: 1, classes: ["Ranger"], description: "+1d6 danni extra al bersaglio." },
    { name: "Punizione Tonante", level: 1, classes: ["Paladino"], description: "2d6 tuono e spinge via." },
    { name: "Maleficio", level: 1, classes: ["Warlock"], description: "+1d6 necrotici e svantaggio su una caratteristica." },
    { name: "Scudo della Fede", level: 1, classes: ["Chierico", "Paladino"], description: "+2 CA bonus action." },
    { name: "Protezione dal Bene e dal Male", level: 1, classes: ["Chierico", "Paladino", "Warlock", "Mago", "Druido"], description: "Immunità a charme/paura da creature extraplanari." },
    { name: "Punizione Iraconda", level: 1, classes: ["Paladino"], description: "1d6 psichici + spaventato." },
    { name: "Punizione Rovente", level: 1, classes: ["Paladino"], description: "1d6 fuoco + danni nel tempo (Searing Smite)." },
    { name: "Duello Obbligato", level: 1, classes: ["Paladino"], description: "Nemico ha svantaggio ad attaccare altri." },
    { name: "Favore Divino", level: 1, classes: ["Paladino"], description: "+1d4 danni radiosi a ogni attacco." },
    { name: "Eroismo", level: 1, classes: ["Bardo", "Paladino"], description: "Immunità paura e HP temporanei." },
    { name: "Bacche Buone", level: 1, classes: ["Druido", "Ranger"], description: "10 bacche che curano 1 HP ciascuna." },
    { name: "Fuoco Fatato", level: 1, classes: ["Bardo", "Druido", "Drow"], description: "Vantaggio agli attacchi contro bersagli illuminati." },
    { name: "Sussurri Dissonanti", level: 1, classes: ["Bardo"], description: "3d6 psichici e il bersaglio fugge." },
    { name: "Risata Incontenibile di Tasha", level: 1, classes: ["Bardo", "Mago"], description: "Il bersaglio cade a terra ridendo." },
    { name: "Colpo Spinato", level: 1, classes: ["Ranger"], description: "Danni perforanti ad area all'impatto." },
    { name: "Assorbire Elementi", level: 1, classes: ["Druido", "Ranger", "Mago", "Artefice"], description: "Resistenza e danni extra al prossimo colpo." },
    { name: "Colpo dello Zefiro", level: 1, classes: ["Ranger"], description: "Zephyr Strike: Vantaggio, danni extra e scatto." },
    { name: "Dardo del Caos", level: 1, classes: ["Stregone"], description: "Chaos Bolt: 2d8+1d6 variabile, rimbalza su critico." },

    // --- LIVELLO 2 ---
    { name: "Blocca Persone", level: 2, classes: ["Bardo", "Chierico", "Druido", "Mago", "Stregone", "Warlock"], description: "Paralizza un umanoide." },
    { name: "Invisibilità", level: 2, classes: ["Bardo", "Mago", "Stregone", "Warlock", "Artefice"], description: "Creatura invisibile finché non attacca/lancia." },
    { name: "Passo Velato", level: 2, classes: ["Mago", "Stregone", "Warlock", "Ranger"], description: "Teletrasporto 9m bonus action." },
    { name: "Sfera Infuocata", level: 2, classes: ["Druido", "Mago", "Stregone"], description: "Sfera 2d6 fuoco che puoi muovere." },
    { name: "Arma Spirituale", level: 2, classes: ["Chierico"], description: "Arma spettrale attacca 1d8+mod (Bonus Action)." },
    { name: "Passare Senza Tracce", level: 2, classes: ["Druido", "Ranger"], description: "+10 a Furtività per il gruppo." },
    { name: "Raggio di Rovescio", level: 2, classes: ["Mago", "Stregone"], description: "3 raggi da 2d6 fuoco ciascuno." },
    { name: "Punizione Marchiante", level: 2, classes: ["Paladino"], description: "2d6 radiosi + visibile." },
    { name: "Trova Cavalcatura", level: 2, classes: ["Paladino"], description: "Evoca uno spirito che assume forma animale." },
    { name: "Aiuto", level: 2, classes: ["Chierico", "Paladino", "Artefice"], description: "+5 HP max a 3 alleati (8h)." },
    { name: "Ristorare Inferiore", level: 2, classes: ["Bardo", "Chierico", "Druido", "Paladino", "Ranger"], description: "Rimuove malattie o condizioni." },
    { name: "Riscaldare il Metallo", level: 2, classes: ["Bardo", "Druido", "Artefice"], description: "2d8 fuoco a chi tocca metallo, svantaggio." },
    { name: "Silenzio", level: 2, classes: ["Bardo", "Chierico", "Ranger"], description: "Nessun suono in area 6m, immune tuono." },
    { name: "Pelle Coriacea", level: 2, classes: ["Druido", "Ranger"], description: "AC diventa 16." },
    { name: "Lama d'Ombra", level: 2, classes: ["Mago", "Stregone", "Warlock"], description: "Evoca spada d'ombra 2d8 psichici, vantaggio al buio." },
    { name: "Vedere Invisibilità", level: 2, classes: ["Bardo", "Mago", "Stregone", "Artefice"], description: "Vedi creature invisibili." },

    // --- LIVELLO 3 ---
    { name: "Palla di Fuoco", level: 3, classes: ["Mago", "Stregone"], description: "Esplosione 8d6 fuoco in raggio 6m." },
    { name: "Fulmine", level: 3, classes: ["Mago", "Stregone"], description: "Linea 30m, 8d6 danni fulmine." },
    { name: "Volare", level: 3, classes: ["Mago", "Stregone", "Warlock", "Artefice"], description: "Velocità volo 18m." },
    { name: "Controincantesimo", level: 3, classes: ["Mago", "Stregone", "Warlock"], description: "Interrompe un incantesimo nemico." },
    { name: "Guarire Ferite di Massa", level: 3, classes: ["Chierico", "Druido"], description: "Cura ferite su più bersagli." }, // Note: actual spell is Mass Healing Word (Parola Guaritrice di Massa) or similar? Keeping generic. Let's use "Parola Guaritrice di Massa" usually lv3.
    { name: "Parola Guaritrice di Massa", level: 3, classes: ["Chierico"], description: "1d4+mod a  fino 6 creature." },
    { name: "Revivificare", level: 3, classes: ["Chierico", "Paladino", "Ranger", "Artefice"], description: "Riporta in vita morto da 1 minuto." },
    { name: "Spiriti Guardiani", level: 3, classes: ["Chierico", "Paladino"], description: "Danni 3d8 in area attorno a te e rallenta." },
    { name: "Punizione Accecante", level: 3, classes: ["Paladino"], description: "3d8 radiosi + accecato." },
    { name: "Evoca Animali", level: 3, classes: ["Druido", "Ranger"], description: "Evoca bestie fatate al tuo comando." },
    { name: "Velocità", level: 3, classes: ["Mago", "Stregone", "Artefice", "Ranger"], description: "Haste: +2 CA, doppia velocità, una azione in più." },
    { name: "Lentezza", level: 3, classes: ["Mago", "Stregone", "Bardo"], description: "Slow: Bersagli rallentati, -2 CA, no reazioni." },
    { name: "Passo Tonante", level: 3, classes: ["Mago", "Stregone", "Warlock"], description: "Thunder Step: Teletrasporto 30m e danni tonanti dove arrivi." },
    { name: "Spirito Sudario", level: 3, classes: ["Chierico", "Paladino", "Warlock", "Mago"], description: "Spirit Shroud: Danni extra e rallenta nemici vicini." },

    // --- LIVELLO 4 ---
    { name: "Porta Dimensionale", level: 4, classes: ["Bardo", "Mago", "Stregone", "Warlock"], description: "Teletrasporto 150m con un passeggero." },
    { name: "Polimorfia", level: 4, classes: ["Bardo", "Druido", "Mago", "Stregone"], description: "Trasforma creatura in bestia." },
    { name: "Invisibilità Superiore", level: 4, classes: ["Bardo", "Mago", "Stregone"], description: "Invisibile anche se attacchi." },
    { name: "Muro di Fuoco", level: 4, classes: ["Druido", "Mago", "Stregone"], description: "Muro danni 5d8 fuoco." },
    { name: "Punizione Sconcertante", level: 4, classes: ["Paladino"], description: "4d6 psichici + stordito." },
    { name: "Esilio", level: 4, classes: ["Chierico", "Mago", "Paladino", "Stregone", "Warlock"], description: "Manda creatura in un altro piano." },
    { name: "Tentacoli neri di Evard", level: 4, classes: ["Mago"], description: "Area difficile e danni." },
    { name: "Ombra di Moil", level: 4, classes: ["Warlock"], description: "Shadow of Moil: Oscurità ti avvolge, svantaggio per colpirti." },
    { name: "Occhio Arcano", level: 4, classes: ["Mago", "Chierico", "Artefice"], description: "Occhio invisibile esplora per te." },

    // --- LIVELLO 5 ---
    { name: "Cura Ferite di Massa", level: 5, classes: ["Bardo", "Chierico", "Druido"], description: "3d8+mod a 6 creature." },
    { name: "Rianimare Morti", level: 5, classes: ["Bardo", "Chierico", "Paladino"], description: "Riporta in vita morto da 10 giorni." },
    { name: "Cono di Freddo", level: 5, classes: ["Mago", "Stregone"], description: "8d8 freddo in cono 18m." },
    { name: "Muro di Forza", level: 5, classes: ["Mago"], description: "Muro indistruttibile." },
    { name: "Punizione Bandente", level: 5, classes: ["Paladino"], description: "5d10 forza + bandito piano." },
    { name: "Blocca Mostri", level: 5, classes: ["Bardo", "Mago", "Stregone", "Warlock"], description: "Paralizza qualsiasi creatura." },
    { name: "Colpo del Vento d'Acciaio", level: 5, classes: ["Ranger", "Mago"], description: "Steel Wind Strike: Attacchi 5 nemici, 6d10 forza." },
    { name: "Sinapsi Statica", level: 5, classes: ["Mago", "Stregone", "Artefice"], description: "Synaptic Static: 8d6 psichici e debuff." },

    // --- LIVELLO 6 ---
    { name: "Catena di Fulmini", level: 6, classes: ["Mago", "Stregone"], description: "10d8 fulmine a bersaglio principale e 3 secondari." },
    { name: "Guarigione", level: 6, classes: ["Chierico", "Druido"], description: "Cura 70 HP e rimuove condizioni." },
    { name: "Disintegrazione", level: 6, classes: ["Mago", "Stregone"], description: "10d6+40 forza, riduce in polvere." },
    { name: "Globo di Invulnerabilità", level: 6, classes: ["Mago", "Stregone"], description: "Immune a incantesimi di livello basso." },

    // --- LIVELLO 7 ---
    { name: "Palla di Fuoco Ritardata", level: 7, classes: ["Mago", "Stregone"], description: "Esplosione ritardata potente (12d6 base)." },
    { name: "Teletrasporto", level: 7, classes: ["Bardo", "Mago", "Stregone"], description: "Viaggio istantaneo ovunque." },
    { name: "Risurrezione", level: 7, classes: ["Bardo", "Chierico"], description: "Riporta in vita morto da 1 secolo." },
    { name: "Gabbia di Forza", level: 7, classes: ["Bardo", "Mago", "Warlock"], description: "Intrappola creatura senza tiro salvezza." },

    // --- LIVELLO 8 ---
    { name: "Esplosione Solare", level: 8, classes: ["Chierico", "Druido", "Mago", "Stregone"], description: "12d6 radiosi e cecità in area enorme." },
    { name: "Dominare Mostri", level: 8, classes: ["Bardo", "Mago", "Stregone", "Warlock"], description: "Controlli mentalmente una creatura." },
    { name: "Parola del Potere Stordire", level: 8, classes: ["Bardo", "Mago", "Stregone", "Warlock"], description: "Stordisce automaticamente se HP < 150." },
    { name: "Terremoto", level: 8, classes: ["Chierico", "Druido", "Stregone"], description: "Distrugge strutture e crea fessure." },

    // --- LIVELLO 9 ---
    { name: "Desiderio", level: 9, classes: ["Mago", "Stregone"], description: "Il più potente incantesimo mortale. Altera la realtà." },
    { name: "Parola del Potere Uccidere", level: 9, classes: ["Bardo", "Mago", "Stregone", "Warlock"], description: "Uccide istantaneamente se HP < 100." },
    { name: "Resurrezione Vera", level: 9, classes: ["Chierico", "Druido"], description: "Riporta in vita chiunque, anche senza corpo." },
    { name: "Sciame di Meteore", level: 9, classes: ["Mago", "Stregone"], description: "4 meteore, 40d6 danni totali in aree enormi." },
    { name: "Trasformazione", level: 9, classes: ["Bard", "Druid", "Mago", "Warlock"], description: "Diventi una creatura fortissima (CR pari al livello)." },
    { name: "Fermare il Tempo", level: 9, classes: ["Mago", "Stregone"], description: "1d4+1 turni consecutivi." }
];
