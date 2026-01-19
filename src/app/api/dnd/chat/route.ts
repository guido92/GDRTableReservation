import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Using the experimental 2.0 model which serves the "preview/next-gen" role.
// If the user specifically has access to a model named "gemini-3-...", they can change this string.
// For now, gemini-2.0-flash-exp is the widely available preview.
// Using gemini-1.5-pro for better instruction following and context window
// Using gemini-3-flash-preview as requested
const MODEL_NAME = 'gemini-3-flash-preview';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { history, message } = await req.json();

        // Sanitize history: Gemini requires the first message to be from 'user'
        let safeHistory = Array.isArray(history) ? [...history] : [];
        while (safeHistory.length > 0 && safeHistory[0].role !== 'user') {
            safeHistory.shift();
        }

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: {
                role: 'system',
                parts: [{
                    text: `
            Sei un esperto Dungeon Master di D&D 5a Edizione.
            Il tuo obiettivo è guidare l'utente nella creazione della sua scheda.
            
            1.  **Fase Interattiva**: Fai domande in ITALIANO per definire il personaggio.
            
            2.  **Generazione**: Quando hai abbastanza informazioni, o l'utente ti chiede di creare la scheda, crea la scheda.
            
            3.  **Formato Finale**: Se devi generare la scheda, il tuo ultimo messaggio DEVE essere un blocco JSON STRETTAMENTE formattato:
            
            \`\`\`json
            {
                "characterName": "...",
                "race": "...",
                "class": "...",
                "level": 1,
                "background": "...",
                "alignment": "...",
                "abilities": { "STR": 10, "DEX": 10, "CON": 10, "INT": 10, "WIS": 10, "CHA": 10 },
                "skills": ["Furtività", "Persuasione"], // Solo abilità con competenza (in Italiano)
                "languages": ["Comune", "Elfico"],
                "equipment": ["Spada lunga", "Scudo"],
                "features": [{ "name": "Azione Astuta", "description": "...", "level": 2, "source": "PHB" }],
                "spells": [{ "level": 0, "name": "Dardo di Fuoco", "prepared": true }], // OBBLIGATORIO per incantatori
                "attacks": [{ "name": "Spada lunga", "bonus": "+5", "damage": "1d8+3 Tagliente" }], // OBBLIGATORIO (min 2)
                "hp": { "current": 10, "max": 10, "temp": 0 },
                "armorClass": 10,
                "initiative": 0,
                "speed": 30,
                "hitDice": { "total": 1, "die": "d8" },
                "personality": { "traits": "...", "backstory": "Storia in italiano..." },
                "is2024": true
            }
            \`\`\`
            
            IMPORTANTE:
            - **Spells**: Se è un incantatore, riempi 'spells' con una lista valida (inclusi Trucchetti).
            - **Background**: Inventa una storia coerente in italiano.
            - **Attacchi**: Calcola bonus e danni.
            
            **Linee Guida Chat**:
            - Non scrivere muri di testo. Usa **elenchi puntati**.
            - Usa il **grassetto** per le parole chiave.
            - Sii conciso ma evocativo.
            - Rispondi punto per punto alle scelte dell'utente.
             ` }]
            }
        });

        const chat = model.startChat({
            history: safeHistory,
            generationConfig: {
                maxOutputTokens: 8192,
            },
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        let finalResponse = responseText;

        // Attempt to parse and validate if it looks like JSON
        try {
            // Extract JSON block if present
            const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || responseText.match(/(\{[\s\S]*\})/);
            if (jsonMatch) {
                const jsonStr = jsonMatch[1];
                const data = JSON.parse(jsonStr);

                // Validate Spells
                if (data.spells && Array.isArray(data.spells)) {
                    const { CharacterLogic } = require('@/lib/character-logic');
                    data.spells = CharacterLogic.validateSpellLevels(data.spells);

                    // Re-embed validated JSON into response
                    // We only replace the JSON part to keep any surrounding text valid (though prompt asks for strict JSON)
                    // But usually for the "final message", responseText IS the JSON block roughly.
                    // Let's safe replace:
                    finalResponse = responseText.replace(jsonMatch[0], "```json\n" + JSON.stringify(data, null, 2) + "\n```");
                }
            }
        } catch (e) {
            console.error("Failed to validate JSON spells in Chat:", e);
        }

        return NextResponse.json({ response: finalResponse });
    } catch (error: any) {
        console.error('AI Chat Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
