/**
 * Class Templates for D&D 5e Character Generation
 *
 * These templates provide intelligent defaults for Quick Build:
 * - Primary stat priority for optimal character builds
 * - Iconic spells that define the class fantasy
 * - Default equipment choices (pre-resolved from PHB options)
 * - Armor type preferences
 *
 * All names are in Italian to match the UI.
 */

import { AbilityScores } from '../types/dnd';

export interface ClassTemplate {
    /** Italian class name */
    name: string;
    /** English class name for 5etools lookup */
    nameEn: string;
    /** Stat priority: highest to lowest importance */
    primaryStats: (keyof AbilityScores)[];
    /** Iconic cantrips for the class (Italian names) */
    iconicCantrips: string[];
    /** Iconic spells by level (Italian names) */
    iconicSpells: Record<number, string[]>;
    /** Pre-resolved starting equipment */
    defaultEquipment: string[];
    /** Preferred armor type: 'none', 'light', 'medium', 'heavy' */
    armorType: 'none' | 'light' | 'medium' | 'heavy';
    /** Whether class uses Unarmored Defense */
    unarmoredDefense?: 'con' | 'wis';
    /** Fighting style preference (for martial classes) */
    fightingStyle?: string;
    /** Subclass recommendations by playstyle */
    recommendedSubclasses: { name: string; playstyle: string }[];
}

export const CLASS_TEMPLATES: Record<string, ClassTemplate> = {
    'Barbaro': {
        name: 'Barbaro',
        nameEn: 'Barbarian',
        primaryStats: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
        iconicCantrips: [],
        iconicSpells: {},
        defaultEquipment: [
            'Ascia Bipenne',
            'Due Asce da Lancio',
            'Zaino da Esploratore',
            '4 Giavellotti'
        ],
        armorType: 'medium',
        unarmoredDefense: 'con',
        recommendedSubclasses: [
            { name: 'Cammino del Berserker', playstyle: 'Danni puri' },
            { name: 'Cammino del Guerriero Totemico', playstyle: 'Versatile/Supporto' },
            { name: 'Cammino dello Zelota', playstyle: 'Difficile da uccidere' }
        ]
    },

    'Bardo': {
        name: 'Bardo',
        nameEn: 'Bard',
        primaryStats: ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
        iconicCantrips: ['Beffa Crudele', 'Prestidigitazione', 'Luci Danzanti'],
        iconicSpells: {
            1: ['Parola Guaritrice', 'Charme su Persone', 'Risata Incontenibile di Tasha', 'Caduta Morbida'],
            2: ['Blocca Persone', 'Invisibilità', 'Suggestione', 'Potenziare Caratteristica'],
            3: ['Trama Ipnotica', 'Dissolvi Magie', 'Contrincantesimo']
        },
        defaultEquipment: [
            'Stocco',
            'Liuto',
            'Armatura di Cuoio',
            'Daga',
            'Zaino da Intrattenitore'
        ],
        armorType: 'light',
        recommendedSubclasses: [
            { name: 'Collegio della Sapienza', playstyle: 'Supporto/Utility' },
            { name: 'Collegio del Valore', playstyle: 'Combattimento' },
            { name: 'Collegio dell\'Eloquenza', playstyle: 'Face/Sociale' }
        ]
    },

    'Chierico': {
        name: 'Chierico',
        nameEn: 'Cleric',
        primaryStats: ['WIS', 'CON', 'STR', 'CHA', 'DEX', 'INT'],
        iconicCantrips: ['Fiamma Sacra', 'Guida', 'Taumaturgia'],
        iconicSpells: {
            1: ['Benedizione', 'Cura Ferite', 'Scudo della Fede', 'Santuario'],
            2: ['Arma Spirituale', 'Ristorare Inferiore', 'Potenziare Caratteristica'],
            3: ['Guardiani Spirituali', 'Rinascita', 'Faro di Speranza']
        },
        defaultEquipment: [
            'Mazza',
            'Corazza a Scaglie',
            'Scudo',
            'Simbolo Sacro',
            'Zaino da Sacerdote'
        ],
        armorType: 'medium',
        recommendedSubclasses: [
            { name: 'Dominio della Vita', playstyle: 'Guaritore puro' },
            { name: 'Dominio della Guerra', playstyle: 'Combattimento' },
            { name: 'Dominio della Luce', playstyle: 'Danni/Controllo' }
        ]
    },

    'Druido': {
        name: 'Druido',
        nameEn: 'Druid',
        primaryStats: ['WIS', 'CON', 'DEX', 'INT', 'CHA', 'STR'],
        iconicCantrips: ['Produrre Fiamma', 'Artificio Druidico', 'Bastone Incantato'],
        iconicSpells: {
            1: ['Intralciare', 'Bacche Benefiche', 'Cura Ferite', 'Fuoco Fatato'],
            2: ['Passare Senza Tracce', 'Raggio di Luna', 'Crescita di Spine'],
            3: ['Invocare il Fulmine', 'Evoca Animali', 'Crescita Vegetale']
        },
        defaultEquipment: [
            'Scimitarra',
            'Scudo di Legno',
            'Armatura di Pelle',
            'Focus Druidico',
            'Zaino da Esploratore'
        ],
        armorType: 'medium',
        recommendedSubclasses: [
            { name: 'Circolo della Luna', playstyle: 'Forma Selvatica' },
            { name: 'Circolo della Terra', playstyle: 'Incantatore' },
            { name: 'Circolo del Pastore', playstyle: 'Evocazioni' }
        ]
    },

    'Guerriero': {
        name: 'Guerriero',
        nameEn: 'Fighter',
        primaryStats: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
        iconicCantrips: [],
        iconicSpells: {},
        defaultEquipment: [
            'Cotta di Maglia',
            'Spada Lunga',
            'Scudo',
            'Balestra Leggera',
            '20 Quadrelli',
            'Zaino da Esploratore'
        ],
        armorType: 'heavy',
        fightingStyle: 'Difesa',
        recommendedSubclasses: [
            { name: 'Campione', playstyle: 'Semplice/Critici' },
            { name: 'Maestro di Battaglia', playstyle: 'Tattico/Versatile' },
            { name: 'Cavaliere Mistico', playstyle: 'Combattente Magico' }
        ]
    },

    'Monaco': {
        name: 'Monaco',
        nameEn: 'Monk',
        primaryStats: ['DEX', 'WIS', 'CON', 'STR', 'CHA', 'INT'],
        iconicCantrips: [],
        iconicSpells: {},
        defaultEquipment: [
            'Spada Corta',
            '10 Dardi',
            'Zaino da Esploratore'
        ],
        armorType: 'none',
        unarmoredDefense: 'wis',
        recommendedSubclasses: [
            { name: 'Via della Mano Aperta', playstyle: 'Arti marziali pure' },
            { name: 'Via dell\'Ombra', playstyle: 'Furtività/Ninja' },
            { name: 'Via del Kensei', playstyle: 'Armi da monaco' }
        ]
    },

    'Paladino': {
        name: 'Paladino',
        nameEn: 'Paladin',
        primaryStats: ['STR', 'CHA', 'CON', 'WIS', 'DEX', 'INT'],
        iconicCantrips: [],
        iconicSpells: {
            1: ['Punizione Tonante', 'Scudo della Fede', 'Benedizione', 'Duello Obbligato'],
            2: ['Trova Cavalcatura', 'Aiuto', 'Punizione Marchiante'],
            3: ['Rinascita', 'Dissolvi Magie', 'Rimuovi Maledizione']
        },
        defaultEquipment: [
            'Spada Lunga',
            'Scudo',
            'Cotta di Maglia',
            'Simbolo Sacro',
            'Zaino da Esploratore'
        ],
        armorType: 'heavy',
        fightingStyle: 'Difesa',
        recommendedSubclasses: [
            { name: 'Giuramento di Devozione', playstyle: 'Paladino classico' },
            { name: 'Giuramento di Vendetta', playstyle: 'Danni/Cacciatore' },
            { name: 'Giuramento degli Antichi', playstyle: 'Natura/Protezione' }
        ]
    },

    'Ranger': {
        name: 'Ranger',
        nameEn: 'Ranger',
        primaryStats: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
        iconicCantrips: [],
        iconicSpells: {
            1: ['Marchio del Cacciatore', 'Cura Ferite', 'Passo Veloce'],
            2: ['Passare Senza Tracce', 'Crescita di Spine', 'Silenzio'],
            3: ['Evoca Animali', 'Protezione dall\'Energia']
        },
        defaultEquipment: [
            'Arco Lungo',
            '20 Frecce',
            'Due Spade Corte',
            'Armatura di Cuoio Borchiato',
            'Zaino da Esploratore'
        ],
        armorType: 'medium',
        fightingStyle: 'Tiro con l\'Arco',
        recommendedSubclasses: [
            { name: 'Cacciatore', playstyle: 'Versatile/Classico' },
            { name: 'Cacciatore delle Tenebre', playstyle: 'Stealth/Oscurità' },
            { name: 'Viandante Fatato', playstyle: 'Magico/Teletrasporto' }
        ]
    },

    'Ladro': {
        name: 'Ladro',
        nameEn: 'Rogue',
        primaryStats: ['DEX', 'INT', 'CON', 'WIS', 'CHA', 'STR'],
        iconicCantrips: [],
        iconicSpells: {},
        defaultEquipment: [
            'Stocco',
            'Arco Corto',
            '20 Frecce',
            'Armatura di Cuoio',
            'Due Daghe',
            'Attrezzi da Scasso',
            'Zaino da Scassinatore'
        ],
        armorType: 'light',
        recommendedSubclasses: [
            { name: 'Furfante', playstyle: 'Classico/Furtività' },
            { name: 'Assassino', playstyle: 'Danni Alpha' },
            { name: 'Mistificatore Arcano', playstyle: 'Ladro Magico' }
        ]
    },

    'Stregone': {
        name: 'Stregone',
        nameEn: 'Sorcerer',
        primaryStats: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
        iconicCantrips: ['Dardo di Fuoco', 'Prestidigitazione', 'Raggio di Gelo', 'Tocco Gelido'],
        iconicSpells: {
            1: ['Dardo Incantato', 'Scudo', 'Mani Brucianti', 'Charme su Persone'],
            2: ['Passo Velato', 'Ingrandire/Ridurre', 'Blocca Persone', 'Raggio Rovente'],
            3: ['Palla di Fuoco', 'Fulmine', 'Controincantesimo', 'Velocità']
        },
        defaultEquipment: [
            'Balestra Leggera',
            '20 Quadrelli',
            'Borsa dei Componenti',
            'Zaino da Esploratore'
        ],
        armorType: 'none',
        recommendedSubclasses: [
            { name: 'Stirpe Draconica', playstyle: 'Elementale/Resistenze' },
            { name: 'Magia Selvaggia', playstyle: 'Caos/Imprevedibile' },
            { name: 'Anima Divina', playstyle: 'Supporto/Guarigione' }
        ]
    },

    'Mago': {
        name: 'Mago',
        nameEn: 'Wizard',
        primaryStats: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
        iconicCantrips: ['Dardo di Fuoco', 'Mano Magica', 'Prestidigitazione', 'Illusione Minore'],
        iconicSpells: {
            1: ['Dardo Incantato', 'Scudo', 'Armatura Magica', 'Trova Famiglio', 'Individuazione del Magico'],
            2: ['Passo Velato', 'Immagine Speculare', 'Ragnatela', 'Blocca Persone'],
            3: ['Palla di Fuoco', 'Controincantesimo', 'Fulmine', 'Volare']
        },
        defaultEquipment: [
            'Bastone Ferrato',
            'Borsa dei Componenti',
            'Libro degli Incantesimi',
            'Zaino da Studioso'
        ],
        armorType: 'none',
        recommendedSubclasses: [
            { name: 'Scuola di Evocazione', playstyle: 'Danni elementali' },
            { name: 'Scuola di Abiurazione', playstyle: 'Protezione/Difesa' },
            { name: 'Scuola di Divinazione', playstyle: 'Controllo/Informazioni' }
        ]
    },

    'Warlock': {
        name: 'Warlock',
        nameEn: 'Warlock',
        primaryStats: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
        iconicCantrips: ['Deflagrazione Occulta', 'Prestidigitazione', 'Tocco Gelido', 'Illusione Minore'],
        iconicSpells: {
            1: ['Maleficio', 'Armatura di Agathys', 'Braccia di Hadar', 'Reprimenda Infernale'],
            2: ['Blocca Persone', 'Invisibilità', 'Oscurità', 'Passo Velato'],
            3: ['Controincantesimo', 'Trama Ipnotica', 'Volare']
        },
        defaultEquipment: [
            'Balestra Leggera',
            '20 Quadrelli',
            'Focus Arcano',
            'Armatura di Cuoio',
            'Due Daghe',
            'Zaino da Studioso'
        ],
        armorType: 'light',
        recommendedSubclasses: [
            { name: 'L\'Immondo', playstyle: 'Danni/Classico' },
            { name: 'L\'Antico', playstyle: 'Controllo/Fey' },
            { name: 'Il Celestiale', playstyle: 'Supporto/Guarigione' }
        ]
    },

    'Artefice': {
        name: 'Artefice',
        nameEn: 'Artificer',
        primaryStats: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
        iconicCantrips: ['Riparare', 'Messaggio', 'Guida'],
        iconicSpells: {
            1: ['Cura Ferite', 'Individuazione del Magico', 'Falsa Vita'],
            2: ['Potenziare Caratteristica', 'Arma Magica', 'Invisibilità'],
            3: ['Dissolvi Magie', 'Rinascita', 'Volare']
        },
        defaultEquipment: [
            'Qualsiasi arma semplice',
            'Balestra Leggera',
            '20 Quadrelli',
            'Armatura di Cuoio Borchiato',
            'Attrezzi da Ladro',
            'Zaino da Esploratore'
        ],
        armorType: 'medium',
        recommendedSubclasses: [
            { name: 'Artigliere', playstyle: 'Danni a distanza' },
            { name: 'Armaiolo', playstyle: 'Tank/Armatura' },
            { name: 'Maestro delle Battaglie', playstyle: 'Companion/Pet' }
        ]
    }
};

/**
 * Get template for a class by Italian name
 */
export function getClassTemplate(className: string): ClassTemplate | undefined {
    return CLASS_TEMPLATES[className];
}

/**
 * Get recommended stat array for a class (4d6 drop lowest, optimally distributed)
 */
export function getOptimalStatDistribution(className: string, rolls: number[]): Record<keyof AbilityScores, number> {
    const template = CLASS_TEMPLATES[className];
    const sortedRolls = [...rolls].sort((a, b) => b - a);

    const stats: Record<keyof AbilityScores, number> = {
        STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
    };

    if (template) {
        template.primaryStats.forEach((stat, index) => {
            if (index < sortedRolls.length) {
                stats[stat] = sortedRolls[index];
            }
        });
    } else {
        // Default distribution if no template
        const defaultOrder: (keyof AbilityScores)[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
        defaultOrder.forEach((stat, index) => {
            if (index < sortedRolls.length) {
                stats[stat] = sortedRolls[index];
            }
        });
    }

    return stats;
}

/**
 * Get iconic spells for a class at a given level
 */
export function getIconicSpells(className: string, maxSpellLevel: number): string[] {
    const template = CLASS_TEMPLATES[className];
    if (!template) return [];

    const spells: string[] = [];

    // Add cantrips
    spells.push(...template.iconicCantrips);

    // Add leveled spells up to max level
    for (let level = 1; level <= maxSpellLevel; level++) {
        if (template.iconicSpells[level]) {
            spells.push(...template.iconicSpells[level]);
        }
    }

    return spells;
}

/**
 * Get default equipment for a class
 */
export function getDefaultEquipment(className: string): string[] {
    const template = CLASS_TEMPLATES[className];
    return template?.defaultEquipment || ['Zaino da Esploratore'];
}

/**
 * Get armor type preference for a class
 */
export function getArmorPreference(className: string): 'none' | 'light' | 'medium' | 'heavy' {
    const template = CLASS_TEMPLATES[className];
    return template?.armorType || 'none';
}

/**
 * Check if class uses Unarmored Defense
 */
export function hasUnarmoredDefense(className: string): { enabled: boolean; secondaryStat?: 'con' | 'wis' } {
    const template = CLASS_TEMPLATES[className];
    if (template?.unarmoredDefense) {
        return { enabled: true, secondaryStat: template.unarmoredDefense };
    }
    return { enabled: false };
}
