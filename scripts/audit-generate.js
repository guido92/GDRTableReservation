const fs = require('fs');
const path = require('path');

// Constants
const API_URL = 'http://localhost:3000/api/dnd/generate';
const OUTPUT_DIR = 'C:/Users/micha/.gemini/antigravity/brain/60c3e6d9-dbab-430b-897f-ff5930157027';

const generate = async (name, payload) => {
    console.log(`Generating ${name}...`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`${response.status} ${response.statusText}: ${errText}`);
        }

        const buffer = await response.arrayBuffer();
        const outPath = path.join(OUTPUT_DIR, `${name}.pdf`);
        fs.writeFileSync(outPath, Buffer.from(buffer));
        console.log(`Success! Saved to ${outPath}`);
    } catch (e) {
        console.error(`Error generating ${name}:`, e);
    }
};

const barbarian = {
    characterName: "Grog The Strong",
    playerName: "Audit",
    race: "Goliath",
    class: "Barbaro",
    level: 5,
    background: "Forestiero",
    alignment: "Caotico Buono",
    abilities: { STR: 18, DEX: 14, CON: 16, INT: 8, WIS: 12, CHA: 10 },
    skills: ["Atletica", "Sopravvivenza"],
    languages: ["Comune", "Gigante"],
    equipment: ["Ascia Bipenne", "Giavellotto (4)", "Kit da Esploratore"],
    features: [
        { name: "Ira", description: "Vantaggio su prove forza, bonus danni, resistenza.", level: 1, source: "PHB" },
        { name: "Difesa Senza Armatura", description: "AC = 10 + Dex + Con", level: 1, source: "PHB" },
        { name: "Attacco Extra", description: "Due attacchi per azione.", level: 5, source: "PHB" }
    ],
    spells: [],
    attacks: [{ name: "Ascia Bipenne", bonus: "+7", damage: "1d12+4 Tagliente" }],
    hp: { current: 55, max: 55, temp: 0 },
    armorClass: 15,
    initiative: 2,
    speed: 40,
    hitDice: { total: 5, die: "d12" },
    personality: { traits: "I break things.", ideals: "Freedom.", bonds: "My axe.", flaws: "Can't read.", backstory: "Grog smash." },
    is2024: true
};

const sorcerer = {
    characterName: "Immeral The Arcane",
    playerName: "Audit",
    race: "Alto Elfo",
    class: "Stregone",
    level: 10,
    background: "Erudito",
    alignment: "Legale Neutrale",
    abilities: { STR: 8, DEX: 14, CON: 14, INT: 12, WIS: 10, CHA: 20 },
    skills: ["Arcana", "Persuasione"],
    languages: ["Comune", "Elfico", "Draconico"],
    equipment: ["Daga", "Focus Arcano", "Vestiti Comuni"],
    features: [
        { name: "Incantesimi", description: "Lanci incantesimi basati su Carisma.", level: 1, source: "PHB" },
        { name: "Fonte di Magia", description: "Hai 10 Punti Stregoneria.", level: 2, source: "PHB" },
        { name: "Metamagia: Incantesimo Rapido", description: "Lancia bonus action.", level: 3, source: "PHB" }
    ],
    spells: [
        { level: 0, name: "Dardo di Fuoco", prepared: true },
        { level: 0, name: "Messaggio", prepared: true },
        { level: 0, name: "Luce", prepared: true },
        { level: 1, name: "Scudo", prepared: true },
        { level: 1, name: "Armatura Magica", prepared: true },
        { level: 3, name: "Palla di Fuoco", prepared: true },
        { level: 3, name: "Velocità", prepared: true },
        { level: 5, name: "Cono di Freddo", prepared: true }
    ],
    attacks: [{ name: "Dardo di Fuoco", bonus: "+9", damage: "2d10 Fuoco" }],
    hp: { current: 62, max: 62, temp: 0 },
    armorClass: 15, // Mage Armor
    initiative: 2,
    speed: 30,
    hitDice: { total: 10, die: "d6" },
    personality: { traits: "Always reading.", ideals: "Knowledge.", bonds: "My library.", flaws: "Arrogant.", backstory: "Magic is power." },
    is2024: true
};

(async () => {
    // Wait for server to potentially restart if build was running? 
    // Usually 'npm run dev' hot reloads.
    console.log("Starting Audit...");
    await generate("audit_barbarian_lv5", barbarian);
    await generate("audit_sorcerer_lv10", sorcerer);
})();
