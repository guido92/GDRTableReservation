import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CharacterData } from '@/types/dnd';
import { CharacterLogic } from '@/lib/character-logic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    let requestData: any = {};

    try {
        requestData = await req.json();
        const { level, race, class: className, background, characterName } = requestData;

        // Direct Fallback check for dev/no-key environment
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("No Gemini API Key configured - switching to fallback");
        }

        // Construct dynamic prompt context
        let context = `Level ${level}`;
        if (race) context += ` ${race}`;
        if (className) context += ` ${className}`;
        if (background) context += ` with ${background} background`;
        if (characterName) context += ` named "${characterName}"`;

        const prompt = `
        Sei un Generatore di Personaggi D&D 5a Edizione Esperto.
        Il tuo compito è generare un personaggio DETTAGLIATO e PERFETTO, pronto per essere giocato.
        
        Richiesta Utente: Genera un ${context}.
        
        REGOLE FERREE (PENALITÀ SE VIOLATE):
        1.  **LINGUA**: TUTTO DEVE ESSERE IN ITALIANO (Nomi abilità, incantesimi, descrizioni).
        2.  **COMPLETEZZA**: Non lasciare MAI campi vuoti o placeholder. Se manca un dato, INVENTALO coerentemente.
        3.  **FONTI**: Usa le regole ufficiali 5e (PHB, Xanathar, Tasha) come riferimento principale.
        4.  **TERMINOLOGIA UFFICIALE**: Usa ESCLUSIVAMENTE termini italiani ufficiali D&D 5e:
            - Incantesimi: "Fireball" -> "Palla di Fuoco", "Healing Word" -> "Parola Guaritrice".
            - Abilità: "Stealth" -> "Furtività", "Investigation" -> "Indagare".
            - Oggetti: "Longsword" -> "Spada Lunga", "Chain Mail" -> "Cotta di Maglia".
        5.  **INCANTATORI**: Se la classe usa magia, DEVI compilare l'array 'spells' con nomi ITALIANI validi per il livello.
        6.  **EQUIPAGGIAMENTO**: Includi equipaggiamento di classe e background (in Italiano).
        
        Struttura JSON (RISPETTARE TASSATIVAMENTE):
        {
            "characterName": "${characterName || "Nome del Personaggio"}",
            "playerName": "AI Master",
            "race": "Nome Razza (es. Elfo Alto)",
            "class": "Nome Classe (es. Mago)",
            "subclass": "Nome Sottoclasse (es. Scuola di Invocazione) - OBBLIGATORIO se livello >= 3 (o 1/2 per alcune classi)",
            "level": ${level},
            "background": "Nome Background",
            "alignment": "Allineamento (es. Caotico Buono)",
            "abilities": { "STR": 10, "DEX": 10, "CON": 10, "INT": 10, "WIS": 10, "CHA": 10 },
            "skills": ["Furtività", "Arcano"], // SOLO le abilità con competenza (in Italiano Ufficiale)
            "languages": ["Comune", "Elfico"],
            "equipment": ["Spada Corta", "Focus Arcano", "Zaino da Esploratore"],
            "features": [
                { "name": "Nome Privilegio", "source": "PHB", "description": "Descrizione COMPLETA in ITALIANO.", "level": 1 }
            ],
            "spells": [
                { "level": 0, "name": "Dardo di Fuoco", "prepared": true }, // Trucchetti in Italiano
                { "level": 1, "name": "Scudo", "prepared": true }
            ],
            "attacks": [
                { "name": "Pugnale", "bonus": "+5", "damage": "1d4+3 Perforante" }
            ],
            "hp": { "current": 20, "max": 20, "temp": 0 },
            "armorClass": 12,
            "initiative": 2,
            "speed": 9,
            "hitDice": { "total": ${level}, "die": "d6" },
            "personality": {
                "traits": "Tratto della personalità...",
                "ideals": "Ideale...",
                "bonds": "Legame...",
                "flaws": "Difetto...",
                "backstory": "Scrivi una storia avvincente di almeno 3 paragrafi che spieghi le origini, le motivazioni e gli obiettivi del personaggio. Sii creativo!",
                "appearance": "Descrizione fisica dettagliata."
            },
            "is2024": false
        }
        
        ASSICURATI CHE IL JSON SIA VALIDO E COMPLETO.
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 8192,
            }
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || responseText.match(/(\{[\s\S]*\})/);

        if (!jsonMatch) {
            throw new Error("Failed to parse JSON from AI response");
        }

        const jsonStr = jsonMatch[1];
        const data = JSON.parse(jsonStr);

        // Validazione Aggiuntiva
        if (data.spells && Array.isArray(data.spells)) {
            data.spells = CharacterLogic.validateSpellLevels(data.spells);
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('AI Generation Error (Primary):', error.message);

        // FALLBACK LOGIC
        console.warn('Attempting Fallback Generation...');
        try {
            const { level, sourceFilter, race, class: className, characterName } = requestData;

            // Use the local logic to generate a valid character structure
            const fallbackChar = CharacterLogic.generateQuickCharacter(
                level || 1,
                sourceFilter || ['PHB14'],
                { race: race, class: className } // Pass overrides
            );

            if (characterName) fallbackChar.characterName = characterName;

            return NextResponse.json(fallbackChar);

        } catch (fallbackError) {
            console.error('Fallback Generation Error:', fallbackError);
            return NextResponse.json(
                { error: 'Failed to generate character even with fallback.' },
                { status: 500 }
            );
        }
    }
}
