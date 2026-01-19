export type AbilityScores = {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
};

export type Feature = {
    name: string;
    source: string;
    description: string;
    level: number;
};

export type SpellSlot = {
    level: number;
    total: number;
    used: number;
};

export type CharacterData = {
    characterName: string;
    playerName: string;
    race: string;
    class: string;
    level: number;
    subclass?: string;
    background: string;
    alignment: string;
    abilities: AbilityScores;
    skills: string[]; // List of proficient skills
    languages: string[];
    equipment: string[];
    proficiencies?: {
        armor: string[];
        weapons: string[];
        tools: string[];
    };
    features: Feature[]; // Class features, racial traits, etc.
    hp: {
        current: number;
        max: number;
        temp: number;
    };
    armorClass: number;
    initiative: number;
    speed: number;
    hitDice: {
        total: number;
        die: string;
    };
    attacks: {
        name: string;
        bonus: string;
        damage: string;
    }[];
    personality: {
        traits: string;
        ideals: string;
        bonds: string;
        flaws: string;
        backstory: string;
    };
    spells: {
        level: number;
        name: string;
        source?: string;
        prepared?: boolean;
    }[];
    is2024: boolean;
};
