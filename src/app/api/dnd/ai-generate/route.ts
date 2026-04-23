import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CharacterData } from '@/types/dnd';
import { CharacterLogic } from '@/lib/character-logic';
import { FiveToolsService, RawSpell } from '@/services/five-tools-service';
import { UnifiedDataService } from '@/services/unified-data-service';
import { getClassTemplate } from '@/data/class-templates';

// Local type for spell validation
interface SpellEntry {
    level: number;
    name: string;
    prepared?: boolean;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper to get spell limits for a class/level
function getSpellLimits(className: string, level: number): { cantrips: number; known: number; prepared: number; maxSpellLevel: number } {
    const limits = { cantrips: 0, known: 0, prepared: 0, maxSpellLevel: 0 };

    const fullCasters = ['Mago', 'Chierico', 'Druido', 'Bardo', 'Stregone'];
    const halfCasters = ['Paladino', 'Ranger'];
    const warlocks = ['Warlock'];
    const thirdCasters = ['Cavaliere Mistico', 'Mistificatore Arcano'];

    // Calculate max spell level
    if (fullCasters.includes(className)) {
        limits.maxSpellLevel = Math.min(9, Math.ceil(level / 2));
    } else if (halfCasters.includes(className)) {
        if (level >= 2) limits.maxSpellLevel = Math.min(5, Math.ceil((level - 1) / 2));
    } else if (warlocks.includes(className)) {
        limits.maxSpellLevel = Math.min(5, Math.ceil(level / 2));
    }

    // Cantrips by class (at level 1)
    const cantripBase: Record<string, number> = {
        'Mago': 3, 'Stregone': 4, 'Bardo': 2, 'Chierico': 3, 'Druido': 2, 'Warlock': 2
    };
    limits.cantrips = (cantripBase[className] || 0) + Math.floor(level / 4);

    // Spells known (for known-spell classes)
    if (['Bardo', 'Stregone', 'Ranger', 'Warlock'].includes(className)) {
        limits.known = Math.min(22, level + 3);
    } else if (['Mago', 'Chierico', 'Druido', 'Paladino'].includes(className)) {
        // Prepared casters - prepared = level + mod (assume mod ~3)
        limits.prepared = Math.max(1, level + 3);
    }

    return limits;
}

// Helper to build valid spells list for the prompt
async function buildSpellContext(className: string, level: number, sources: string[]): Promise<string> {
    const limits = getSpellLimits(className, level);
    if (limits.maxSpellLevel === 0) return '';

    const fiveTools = FiveToolsService.getInstance();
    
    // Get ALL valid spells for this class and level from the official database
    const allCantrips = fiveTools.getSpells(className, 0, sources);
    const allLeveledSpells: RawSpell[] = [];
    for (let l = 1; l <= limits.maxSpellLevel; l++) {
        allLeveledSpells.push(...fiveTools.getSpells(className, l, sources));
    }

    // Select a representative sample for the AI (to avoid token overflow but provide real names)
    const cantripNames = allCantrips.map(s => s.name).slice(0, 15);
    const spellNames = allLeveledSpells.map(s => s.name).slice(0, 30);

    return `
INCANTESIMI REALI DISPONIBILI per ${className} Livello ${level} (${sources.includes('XPHB') ? 'Edizione 2024' : 'Edizione 2014'}):
- Trucchetti massimi: ${limits.cantrips}
- Livello massimo incantesimi: ${limits.maxSpellLevel}
- ESEMPI DI TRUCCHETTI UFFICIALI (USA QUESTI): ${cantripNames.join(', ')}
- ESEMPI DI INCANTESIMI LIVELLO 1-${limits.maxSpellLevel} (USA QUESTI): ${spellNames.join(', ')}

IMPORTANTE: DEVI usare SOLO incantesimi reali dai manuali D&D 5e. NON INVENTARE nomi di incantesimi.
`;
}

// Helper to get hit die for a class
function getHitDie(className: string): number {
    const hitDieByClass: Record<string, number> = {
        'Barbaro': 12, 'Guerriero': 10, 'Paladino': 10, 'Ranger': 10,
        'Chierico': 8, 'Druido': 8, 'Monaco': 8, 'Ladro': 8, 'Bardo': 8, 'Warlock': 8,
        'Mago': 6, 'Stregone': 6, 'Artefice': 8
    };
    return hitDieByClass[className] || 8;
}

// Validate and fix spells from AI output using FiveToolsService
async function validateAndFixSpells(aiSpells: SpellEntry[], className: string, level: number, sources: string[]): Promise<SpellEntry[]> {
    if (!aiSpells || aiSpells.length === 0) return [];

    const fiveTools = FiveToolsService.getInstance();
    const limits = getSpellLimits(className, level);
    const validatedSpells: SpellEntry[] = [];

    let cantripCount = 0;
    let leveledCount = 0;

    for (const spell of aiSpells) {
        // 1. Find if the spell exists in 5etools (fuzzy match)
        const officialSpell = fiveTools.getSpellByName(spell.name);
        
        if (!officialSpell) {
            console.warn(`[AI-Generate] Unknown spell "${spell.name}" - skipping or replacing`);
            continue; 
        }

        // 2. Check if the spell is valid for the class
        const validForClass = fiveTools.getSpells(className, officialSpell.level, sources)
            .some(s => s.name === officialSpell.name);

        if (!validForClass) {
            console.warn(`[AI-Generate] Spell "${officialSpell.name}" is not valid for ${className}`);
            continue;
        }

        // 3. Check spell level
        if (officialSpell.level > limits.maxSpellLevel) continue;

        // 4. Enforce limits
        if (officialSpell.level === 0) {
            if (cantripCount >= limits.cantrips) continue;
            cantripCount++;
        } else {
            const limit = limits.known > 0 ? limits.known : limits.prepared;
            if (leveledCount >= limit) continue;
            leveledCount++;
        }

        validatedSpells.push({
            level: officialSpell.level,
            name: officialSpell.name,
            prepared: true
        });
    }

    // 5. If we don't have enough spells, fill with iconic ones
    if (cantripCount < limits.cantrips) {
        const officialCantrips = fiveTools.getSpells(className, 0, sources);
        for (const c of officialCantrips) {
            if (cantripCount >= limits.cantrips) break;
            if (!validatedSpells.some(s => s.name === c.name)) {
                validatedSpells.push({ level: 0, name: c.name, prepared: true });
                cantripCount++;
            }
        }
    }

    return validatedSpells;
}

export async function POST(req: NextRequest) {
    let requestData: any = {};

    try {
        await FiveToolsService.getInstance().initialize();
        requestData = await req.json();
        const { level, race, class: className, background, characterName, sourceFilter } = requestData;

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

        // Get spell context if class is a caster
        const sources = sourceFilter || (requestData.is2024 ? ['XPHB'] : ['PHB']);
        const spellContext = await buildSpellContext(className || 'Mago', level || 1, sources);

        // Calculate expected HP range
        const hitDieByClass: Record<string, number> = {
            'Barbaro': 12, 'Guerriero': 10, 'Paladino': 10, 'Ranger': 10,
            'Chierico': 8, 'Druido': 8, 'Monaco': 8, 'Ladro': 8, 'Bardo': 8, 'Warlock': 8,
            'Mago': 6, 'Stregone': 6
        };
        const hitDie = hitDieByClass[className || 'Guerriero'] || 8;
        const avgHp = hitDie + ((level - 1) * (Math.floor(hitDie / 2) + 1));
        const expectedHpMin = avgHp + level; // +1 CON mod per level
        const expectedHpMax = avgHp + (level * 3); // +3 CON mod per level

        const prompt = `
Sei un Generatore di Personaggi D&D 5a Edizione in MODALITÀ CREATIVA.
Il tuo compito è creare un personaggio UNICO e MEMORABILE.

Richiesta: Genera un ${context}.

═══════════════════════════════════════════════════
📖 SEZIONE CREATIVA - PUOI INVENTARE LIBERAMENTE:
═══════════════════════════════════════════════════
- **characterName**: Inventa un nome evocativo e originale (es. Thandor Silverhand, Elara Nightshade)
- **personality.traits**: Crea 2 tratti distintivi che influenzano il gioco di ruolo
- **personality.ideals**: Un ideale filosofico o morale forte
- **personality.bonds**: Un legame con una persona, un luogo o un oggetto
- **personality.flaws**: Un difetto significativo che possa creare spunti narrativi
- **personality.backstory**: Scrivi una storia MATURA ed AVVINCENTE divisa in:
  1. ORIGINI: Dove è cresciuto e chi era prima dell'avventura.
  2. EVENTO SCATENANTE: Cosa lo ha spinto ad abbandonare la sua vita precedente.
  3. OBIETTIVO: Cosa sta cercando o chi sta fuggendo ora.
  EVITA i cliché banali e lo stile "fiabesco" infantile.
- **appearance**: Descrizione fisica dettagliata (cicatrici, tatuaggi, portamento, equipaggiamento usurato)
- **alignment**: Coerente con la storia e l'ideale.

═══════════════════════════════════════════════════
⚔️ SEZIONE MECCANICA - DEVI USARE DATI UFFICIALI:
═══════════════════════════════════════════════════
I seguenti campi DEVONO rispettare le regole ufficiali D&D 5e:

1. **abilities**: Distribuisci 27 punti (Point Buy) o usa Standard Array (15,14,13,12,10,8)
   - Priorità stat per ${className || 'Guerriero'}: ${getClassTemplate(className || 'Guerriero')?.primaryStats?.join(' > ') || 'STR > CON > DEX'}

2. **hp**: Calcola correttamente
   - Dado Vita: d${hitDie}
   - HP atteso per livello ${level}: ${expectedHpMin}-${expectedHpMax}
   - Formula: ${hitDie} (liv1) + ${level - 1} × (${Math.floor(hitDie/2)+1} + mod CON)

3. **armorClass**: Calcola in base all'armatura
   - Nessuna armatura: 10 + DEX mod
   - Armatura leggera: armatura + DEX mod
   - Armatura media: armatura + DEX mod (max +2)
   - Armatura pesante: solo bonus armatura

4. **skills**: Scegli SOLO dalle abilità disponibili per classe/background (in ITALIANO)
   - Usa nomi ufficiali: Furtività, Percezione, Arcano, Persuasione, ecc.

5. **equipment**: Usa SOLO oggetti ufficiali D&D (in ITALIANO)
   - Spada Lunga, Arco Lungo, Cotta di Maglia, Focus Arcano, ecc.

${spellContext}

═══════════════════════════════════════════════════
📋 STRUTTURA JSON (RISPETTA ESATTAMENTE):
═══════════════════════════════════════════════════
{
    "characterName": "Nome Creativo Inventato",
    "playerName": "AI Master",
    "race": "${race || 'Umano'}",
    "class": "${className || 'Guerriero'}",
    "subclass": "Sottoclasse appropriata per livello ${level}",
    "level": ${level || 1},
    "background": "${background || 'Soldato'}",
    "alignment": "Allineamento Scelto",
    "abilities": { "STR": 15, "DEX": 14, "CON": 13, "INT": 12, "WIS": 10, "CHA": 8 },
    "skills": ["Abilità1", "Abilità2"],
    "languages": ["Comune", "Altra Lingua"],
    "equipment": ["Oggetto1", "Oggetto2"],
    "features": [
        { "name": "Privilegio Ufficiale", "source": "PHB", "description": "Descrizione.", "level": 1 }
    ],
    "spells": [
        { "level": 0, "name": "Nome Trucchetto Italiano", "prepared": true },
        { "level": 1, "name": "Nome Incantesimo Italiano", "prepared": true }
    ],
    "attacks": [
        { "name": "Arma", "bonus": "+X", "damage": "XdY+Z Tipo" }
    ],
    "hp": { "current": ${Math.round((expectedHpMin + expectedHpMax) / 2)}, "max": ${Math.round((expectedHpMin + expectedHpMax) / 2)}, "temp": 0 },
    "armorClass": 15,
    "initiative": 2,
    "speed": 9,
    "hitDice": { "total": ${level || 1}, "die": "d${hitDie}" },
    "personality": {
        "traits": "Tratti unici e memorabili...",
        "ideals": "Ciò in cui crede profondamente...",
        "bonds": "Le connessioni che lo legano al mondo...",
        "flaws": "Le debolezze che lo rendono umano...",
        "backstory": "Una storia avvincente di 3-5 paragrafi che esplora le origini, traumi, trionfi e motivazioni del personaggio. Sii CREATIVO e DETTAGLIATO!"
    },
    "appearance": {
        "age": "Età coerente con razza",
        "height": "Altezza",
        "weight": "Peso",
        "eyes": "Colore occhi descrittivo",
        "skin": "Carnagione",
        "hair": "Capelli"
    },
    "is2024": false
}

RICORDA: Narrativa LIBERA e CREATIVA, meccaniche PRECISE e UFFICIALI.
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
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
        let data = JSON.parse(jsonStr);

        // ═══════════════════════════════════════════════════
        // POST-AI VALIDATION: Ensure mechanical accuracy
        // ═══════════════════════════════════════════════════

        // 1. Validate and fix spells
        if (data.spells && Array.isArray(data.spells)) {
            data.spells = CharacterLogic.validateSpellLevels(data.spells);
            const sources = sourceFilter || (data.is2024 ? ['XPHB'] : ['PHB']);
            data.spells = await validateAndFixSpells(data.spells, data.class, data.level, sources);
        }

        // 2. Ensure HP is in valid range
        const classHitDie = getHitDie(data.class);
        const minHp = classHitDie + (data.level - 1) * (Math.floor(classHitDie / 2) + 1) + data.level;
        const maxHp = classHitDie + (data.level - 1) * (Math.floor(classHitDie / 2) + 1) + (data.level * 3);

        if (!data.hp || data.hp.max < minHp || data.hp.max > maxHp * 1.2) {
            const avgHp = Math.round((minHp + maxHp) / 2);
            data.hp = { current: avgHp, max: avgHp, temp: 0 };
        }

        // 3. Ensure hitDice is correct
        data.hitDice = { total: data.level, die: `d${classHitDie}` };

        // 4. Log validation summary
        console.log(`[AI-Generate] Validated character: ${data.characterName} (${data.class} Lv${data.level})`);
        console.log(`[AI-Generate] HP: ${data.hp.max}, Spells: ${data.spells?.length || 0}`);

        // Hydrate with official features/stats to ensure accuracy
        const hydrated = await CharacterLogic.hydrateCharacter(data);
        return NextResponse.json(hydrated);

    } catch (error: any) {
        console.error('AI Generation Error (Primary):', error.message);

        // FALLBACK LOGIC
        console.warn('Attempting Fallback Generation...');
        try {
            const { level, sourceFilter, race, class: className, characterName } = requestData;

            // Use the local logic to generate a valid character structure
            const fallbackChar = await CharacterLogic.generateQuickCharacter(
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
