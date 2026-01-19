export interface Item {
    name: string;
    type: 'Weapon' | 'Armor' | 'Gear' | 'Tool' | 'Magic Item';
    cost?: string;
    weight?: string;
    description?: string;
    properties?: string[]; // e.g. ["Finesse", "Light"]
    damage?: string; // e.g. "1d8"
    damageType?: string; // e.g. "slashing"
    ac?: number;
}

export const ITEMS: Item[] = [
    // --- ARMOR ---
    { name: "Imbottita", type: "Armor", cost: "5 mo", ac: 11, properties: ["Svantaggio Furtività"], weight: "4 kg" },
    { name: "Cuoio", type: "Armor", cost: "10 mo", ac: 11, weight: "5 kg" },
    { name: "Cuoio Borchiato", type: "Armor", cost: "45 mo", ac: 12, weight: "6.5 kg" },
    { name: "Pelle", type: "Armor", cost: "10 mo", ac: 12, weight: "5 kg" },
    { name: "Giaco di Maglia", type: "Armor", cost: "50 mo", ac: 13, weight: "10 kg" },
    { name: "Corazza a Scaglie", type: "Armor", cost: "50 mo", ac: 14, properties: ["Svantaggio Furtività"], weight: "22.5 kg" },
    { name: "Corazza di Piastre", type: "Armor", cost: "400 mo", ac: 14, properties: ["Svantaggio Furtività"], weight: "20 kg" },
    { name: "Mezza Armatura", type: "Armor", cost: "750 mo", ac: 15, properties: ["Svantaggio Furtività"], weight: "20 kg" },
    { name: "Anelli", type: "Armor", cost: "30 mo", ac: 14, properties: ["Svantaggio Furtività"], weight: "27.5 kg" },
    { name: "Cotta di Maglia", type: "Armor", cost: "75 mo", ac: 16, properties: ["Svantaggio Furtività", "Forza 13"], weight: "27.5 kg" },
    { name: "Smembrata", type: "Armor", cost: "200 mo", ac: 17, properties: ["Svantaggio Furtività", "Forza 15"], weight: "30 kg" },
    { name: "A Piastre", type: "Armor", cost: "1500 mo", ac: 18, properties: ["Svantaggio Furtività", "Forza 15"], weight: "32.5 kg" },
    { name: "Scudo", type: "Armor", cost: "10 mo", ac: 2, weight: "3 kg" },

    // --- WEAPONS (Simple) ---
    { name: "Bastone Ferrato", type: "Weapon", cost: "2 ma", damage: "1d6", damageType: "contundente", properties: ["Versatile (1d8)"], weight: "2 kg" },
    { name: "Daga", type: "Weapon", cost: "2 mo", damage: "1d4", damageType: "perforante", properties: ["Accurata", "Leggera", "Lancio (6/18)"], weight: "0.5 kg" },
    { name: "Giavellotto", type: "Weapon", cost: "5 ma", damage: "1d6", damageType: "perforante", properties: ["Lancio (9/36)"], weight: "1 kg" },
    { name: "Lancia", type: "Weapon", cost: "1 mo", damage: "1d6", damageType: "perforante", properties: ["Lancio (6/18)", "Versatile (1d8)"], weight: "1.5 kg" },
    { name: "Mazza", type: "Weapon", cost: "5 mo", damage: "1d6", damageType: "contundente", weight: "2 kg" },
    { name: "Arco Corto", type: "Weapon", cost: "25 mo", damage: "1d6", damageType: "perforante", properties: ["Munizioni (24/96)", "Due mani"], weight: "1 kg" },
    { name: "Balestra Leggera", type: "Weapon", cost: "25 mo", damage: "1d8", damageType: "perforante", properties: ["Munizioni (24/96)", "Ricarica", "Due mani"], weight: "2.5 kg" },

    // --- WEAPONS (Martial) ---
    { name: "Alabarda", type: "Weapon", cost: "20 mo", damage: "1d10", damageType: "tagliente", properties: ["Pesante", "Portata", "Due mani"], weight: "3 kg" },
    { name: "Ascia Bipenne", type: "Weapon", cost: "30 mo", damage: "1d12", damageType: "tagliente", properties: ["Pesante", "Due mani"], weight: "3.5 kg" },
    { name: "Ascia da Battaglia", type: "Weapon", cost: "10 mo", damage: "1d8", damageType: "tagliente", properties: ["Versatile (1d10)"], weight: "2 kg" },
    { name: "Maglio", type: "Weapon", cost: "10 mo", damage: "2d6", damageType: "contundente", properties: ["Pesante", "Due mani"], weight: "5 kg" },
    { name: "Spada Corta", type: "Weapon", cost: "10 mo", damage: "1d6", damageType: "perforante", properties: ["Accurata", "Leggera"], weight: "1 kg" },
    { name: "Spada Lunga", type: "Weapon", cost: "15 mo", damage: "1d8", damageType: "tagliente", properties: ["Versatile (1d10)"], weight: "1.5 kg" },
    { name: "Spadone", type: "Weapon", cost: "50 mo", damage: "2d6", damageType: "tagliente", properties: ["Pesante", "Due mani"], weight: "3 kg" },
    { name: "Stocco", type: "Weapon", cost: "25 mo", damage: "1d8", damageType: "perforante", properties: ["Accurata"], weight: "1 kg" },
    { name: "Arco Lungo", type: "Weapon", cost: "50 mo", damage: "1d8", damageType: "perforante", properties: ["Munizioni (45/180)", "Pesante", "Due mani"], weight: "1 kg" },
    { name: "Balestra a Mano", type: "Weapon", cost: "75 mo", damage: "1d6", damageType: "perforante", properties: ["Munizioni (9/36)", "Leggera", "Ricarica"], weight: "1.5 kg" },
    { name: "Balestra Pesante", type: "Weapon", cost: "50 mo", damage: "1d10", damageType: "perforante", properties: ["Munizioni (30/120)", "Pesante", "Ricarica", "Due mani"], weight: "9 kg" },

    // --- GEAR ---
    { name: "Zaino", type: "Gear", cost: "2 mo", weight: "2.5 kg" },
    { name: "Sacco a pelo", type: "Gear", cost: "1 mo", weight: "3.5 kg" },
    { name: "Razione (1 giorno)", type: "Gear", cost: "5 ma", weight: "1 kg" },
    { name: "Corda di Canapa (15m)", type: "Gear", cost: "1 mo", weight: "5 kg" },
    { name: "Torcia", type: "Gear", cost: "1 mr", weight: "0.5 kg" },
    { name: "Kit da Guaritore", type: "Gear", cost: "5 mo", weight: "1.5 kg", description: "10 usi per stabilizzare." },
    { name: "Pozione di Guarigione", type: "Gear", cost: "50 mo", weight: "0.5 kg", description: "Cura 2d4+2 HP." },
    { name: "Focus Arcano", type: "Gear", cost: "10 mo", weight: "0.5 kg" },
    { name: "Simbolo Sacro", type: "Gear", cost: "5 mo", weight: "0.5 kg" },
    { name: "Strumenti da Scasso", type: "Tool", cost: "25 mo", weight: "0.5 kg" },
    { name: "Liuto", type: "Tool", cost: "35 mo", weight: "1 kg" }
];
