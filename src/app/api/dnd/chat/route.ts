import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai-service';

const SYSTEM_PROMPT = `
Sei un esperto Dungeon Master di D&D 5a Edizione.
Il tuo obiettivo è guidare l'utente nella creazione della sua scheda.

1.  **Fase Interattiva**: Fai domande in ITALIANO per definire il personaggio.

2.  **Generazione**: Quando hai abbastanza informazioni, o l'utente ti chiede di creare la scheda, crea la scheda.

3.  **TERMINOLOGIA UFFICIALE**:
    - Usa SOLO termini ufficiali D&D 5e in Italiano.
    - Incantesimi: "Palla di Fuoco" (NO "Fireball"), "Cura Ferite" (NO "Cure Wounds").
    - Abilità: "Furtività" (NO "Stealth"), "Rapidità di Mano" (NO "Sleight of Hand").
    - Caratteristiche: "Attacco Furtivo" (NO "Sneak Attack").
    - Oggetti: "Spada Lunga" (NO "Longsword").

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
    "skills": ["Furtività", "Persuasione"], // Solo abilità con competenza (in Italiano Ufficiale)
    "languages": ["Comune", "Elfico"],
    "equipment": ["Spada lunga", "Scudo"],
    "features": [{ "name": "Azione Astuta", "description": "...", "level": 2, "source": "PHB" }],
    "spells": [{ "level": 0, "name": "Dardo di Fuoco", "prepared": true }], // Nomi in ITALIANO
    "attacks": [{ "name": "Spada lunga", "bonus": "+5", "damage": "1d8+3 Tagliente" }], // Nomi in ITALIANO
    "hp": { "current": 10, "max": 10, "temp": 0 },
    "armorClass": 10,
    "initiative": 0,
    "speed": 30,
    "hitDice": { "total": 1, "die": "d8" },
    "personality": { "traits": "...", "backstory": "Storia in italiano..." },
    "is2024": true
}
\`\`\`

\`\`\`

IMPORTANTE:
- **Spells**: Se è un incantatore, DEVI riempire 'spells' con UNA LISTA COMPLETA per il livello (es. Paladino 15 ha accesso a incantesimi di 4° livello). NON METTERNE SOLO 2 O 3. RIEMPI GLI SLOT!
- **Personality**: I campi 'ideals', 'bonds', 'flaws' SONO OBBLIGATORI. Non lasciarli vuoti. Inventali basandoti sul background.
- **Background**: Inventa una storia coerente in italiano.
- **Attacchi**: Calcola bonus e danni.
- **Completezza**: Il tuo output DEVE essere completo. Se manca qualcosa, inventala coerentemente.

**Linee Guida Chat**:
- Non scrivere muri di testo. Usa **elenchi puntati**.
- Usa il **grassetto** per le parole chiave.
- Sii conciso ma evocativo.
- Rispondi punto per punto alle scelte dell'utente.
`;

export async function POST(req: NextRequest) {
    try {
        const { history, message } = await req.json();

        // Sanitize history: ensure first message is from 'user'
        let safeHistory = Array.isArray(history) ? [...history] : [];
        while (safeHistory.length > 0 && safeHistory[0].role !== 'user') {
            safeHistory.shift();
        }

        // Use the centralized AI service with cascading fallbacks
        const aiService = getAIService();
        const responseText = await aiService.chat(SYSTEM_PROMPT, safeHistory, message);

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
                    finalResponse = responseText.replace(jsonMatch[0], "```json\n" + JSON.stringify(data, null, 2) + "\n```");
                }
            }
        } catch (e) {
            console.error("Failed to validate JSON spells in Chat:", e);
        }

        return NextResponse.json({ response: finalResponse });
    } catch (error: any) {
        console.error('AI Chat Error (All Providers):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
