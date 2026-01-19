
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CLASSES, RACES, FEATS, BACKGROUNDS, PERSONALITY_TRAITS, IDEALS, BONDS, FLAWS } from '@/data/dnd-data';
import { SPELLS } from '@/data/spells';
import { AbilityScores, CharacterData } from '@/types/dnd';
import { Shield, Brain, BicepsFlexed, Tangent, Sparkles, Scroll, Book, Dices } from 'lucide-react';

// --- HELPER: SPELL PROGRESSION & LIMITS ---

// Simplified Tables for "Spells Known" classes (Bard, Ranger, Rogue AT, Sorcerer, Warlock, Fighter EK)
// Prepared classes (Cleric, Druid, Paladin, Wizard) use formulas: Level + Mod
const SPELL_PROGRESSION: Record<string, { cantrips: number[], known: number[] }> = {
    'Bardo': {
        cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        known: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22]
    },
    'Stregone': {
        cantrips: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        known: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15]
    },
    'Warlock': {
        cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        known: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15]
    },
    'Ranger': {
        cantrips: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Tasha adds fighting style cantrips, ignored for base
        known: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11]
    },
    'Ladro': { // Arcane Trickster logic (starts lv 3)
        cantrips: [0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        known: [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13]
    },
    'Guerriero': { // Eldritch Knight logic (starts lv 3)
        cantrips: [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        known: [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13]
    },
    'Mago': { // Wizard Special: Cantrips fixed, Known = Book (6 + 2/lv), Prepared = Lv + Int
        cantrips: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        known: [] // Unused, calculated
    },
    'Chierico': {
        cantrips: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        known: []
    },
    'Druido': {
        cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // + Circle of Land bonus cantrip at lv 2 (ignored for simplicity)
        known: []
    },
    'Artefice': {
        cantrips: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        known: []
    },
    'Paladino': { // No cantrips standard
        cantrips: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        known: []
    }
};

const getSpellLimits = (cls: string, sub: string, lvl: number, abs: AbilityScores) => {
    const base = cls.split(' (')[0];
    const limits = { cantrips: 0, known: 0, prepared: 0, type: 'known' as 'known' | 'prepared' };

    // Modifiers
    const intMod = Math.floor((abs.INT - 10) / 2);
    const wisMod = Math.floor((abs.WIS - 10) / 2);
    const chaMod = Math.floor((abs.CHA - 10) / 2);

    // Progression Lookup
    const prog = SPELL_PROGRESSION[base];
    if (prog) {
        limits.cantrips = prog.cantrips[lvl - 1] || 0;
    }

    // Class Specific Logic
    if (base === 'Bardo' || base === 'Stregone' || base === 'Warlock') {
        limits.type = 'known';
        if (prog) limits.known = prog.known[lvl - 1] || 0;
    } else if (base === 'Ranger') {
        limits.type = 'known';
        if (prog) limits.known = prog.known[lvl - 1] || 0;
    } else if (base === 'Ladro' && sub.includes('Mistificatore')) {
        limits.type = 'known';
        if (prog) limits.known = prog.known[lvl - 1] || 0;
    } else if (base === 'Guerriero' && sub.includes('Mistico')) {
        limits.type = 'known';
        if (prog) limits.known = prog.known[lvl - 1] || 0;
    } else if (base === 'Mago') {
        limits.type = 'prepared';
        limits.prepared = Math.max(1, lvl + intMod);
        // Wizard Book "Known" is technically 6 + (lvl-1)*2, but effectively unlimited for adding to sheet.
        // We will treat "Known" as "In Spellbook" and "Prepared" as "Memorized".
    } else if (base === 'Chierico' || base === 'Druido') {
        limits.type = 'prepared';
        limits.prepared = Math.max(1, lvl + wisMod);
    } else if (base === 'Paladino') {
        limits.type = 'prepared';
        limits.prepared = Math.max(1, Math.floor(lvl / 2) + chaMod);
    } else if (base === 'Artefice') {
        limits.type = 'prepared';
        // Artificer prepares Lv/2 (rounded up) + IntMod
        limits.prepared = Math.max(1, Math.ceil(lvl / 2) + intMod);
    }

    return limits;
};

// --- STYLES ---
const cardStyle = { background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem' };
const labelStyle: React.CSSProperties = { display: 'block', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' };
const inputStyle = { width: '100%', background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.5rem', color: '#cbd5e1', outline: 'none' };

// --- ABILITY SCORES STEP ---
export function AbilityScoreStep({ data, updateData }: { data: CharacterData, updateData: (f: keyof CharacterData, v: any) => void }) {
    const scores = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
    const [mode, setMode] = useState<'pointBuy' | 'standard' | 'roll'>('pointBuy');
    const [points, setPoints] = useState(27);
    const [standardArray, setStandardArray] = useState([15, 14, 13, 12, 10, 8]);
    const [rolled, setRolled] = useState(false);

    // Calculate Racial Bonuses
    const getBonuses = () => {
        const bonuses: Record<string, number> = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };

        // Base Race
        const baseRaceName = data.race.split(' (')[0];
        const race = RACES.find(r => r.name === baseRaceName);
        if (race?.abilityBonuses) {
            Object.entries(race.abilityBonuses).forEach(([k, v]) => bonuses[k] += v);
        }

        // Subrace
        const match = data.race.match(/\((.*?)\)/);
        if (match) {
            const subName = match[1];
            const sub = race?.suboptions?.find(s => s.name === subName);
            if (sub?.abilityBonuses) {
                Object.entries(sub.abilityBonuses).forEach(([k, v]) => bonuses[k] += v);
            }
        }
        return bonuses;
    };
    const racialBonuses = getBonuses();

    // Standard Point Buy Costs
    const cost = (val: number) => {
        if (val <= 8) return 0;
        if (val == 9) return 1;
        if (val == 10) return 2;
        if (val == 11) return 3;
        if (val == 12) return 4;
        if (val == 13) return 5;
        if (val == 14) return 7;
        if (val == 15) return 9;
        return 99;
    };

    const handlePointBuy = (stat: keyof AbilityScores, val: number) => {
        const currentVal = data.abilities[stat];
        const newCost = points + cost(currentVal) - cost(val);
        if (newCost >= 0 && val >= 8 && val <= 15) {
            updateData('abilities', { ...data.abilities, [stat]: val });
            setPoints(newCost);
        }
    };

    const rollStats = () => {
        const newStats = { ...data.abilities };
        scores.forEach(s => {
            const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => a - b);
            newStats[s] = rolls.slice(1).reduce((a, b) => a + b, 0);
        });
        updateData('abilities', newStats);
        setRolled(true);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Caratteristiche</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Definisci le capacità fisiche e mentali del tuo eroe.</p>

            {/* Mode Selector */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                <button onClick={() => setMode('pointBuy')} style={{ ...tabStyle, background: mode === 'pointBuy' ? '#7c3aed' : 'rgba(255,255,255,0.05)' }}>Point Buy</button>
                <button onClick={() => setMode('standard')} style={{ ...tabStyle, background: mode === 'standard' ? '#7c3aed' : 'rgba(255,255,255,0.05)' }}>Standard Array</button>
                <button onClick={() => setMode('roll')} style={{ ...tabStyle, background: mode === 'roll' ? '#7c3aed' : 'rgba(255,255,255,0.05)' }}>Tira i Dadi</button>
            </div>

            {mode === 'pointBuy' && (
                <div style={{ textAlign: 'center' as const, marginBottom: '1rem', color: points >= 0 ? '#4ade80' : '#ef4444' }}>
                    Punti Rimanenti: {points} / 27
                </div>
            )}

            {mode === 'standard' && (
                <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#94a3b8' }}>
                    Assegna i valori: 15, 14, 13, 12, 10, 8
                </div>
            )}

            {mode === 'roll' && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <button onClick={rollStats} style={{ padding: '0.5rem 1rem', background: '#d946ef', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                        <Brain size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        {rolled ? 'Ritira Dadi' : 'Tira 4d6 (Scarta il più basso)'}
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                {scores.map(stat => {
                    const bonus = racialBonuses[stat] || 0;
                    const total = data.abilities[stat] + bonus;
                    const mod = Math.floor((total - 10) / 2);

                    return (
                        <div key={stat} style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>{stat}</div>
                            {mode === 'pointBuy' ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <button onClick={() => handlePointBuy(stat, data.abilities[stat] - 1)} style={btnMiniStyle}>-</button>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', width: '30px' }}>{data.abilities[stat]}</span>
                                    <button onClick={() => handlePointBuy(stat, data.abilities[stat] + 1)} style={btnMiniStyle}>+</button>
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    value={data.abilities[stat]}
                                    readOnly={mode === 'roll'}
                                    onChange={(e) => updateData('abilities', { ...data.abilities, [stat]: parseInt(e.target.value) || 10 })}
                                    style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, width: '60px' }}
                                />
                            )}
                            {bonus > 0 && <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '0.25rem' }}>+{bonus} Razza</div>}
                            <div style={{ fontSize: '0.9rem', color: 'white', marginTop: '0.5rem', fontWeight: 600 }}>
                                Totale: {total}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                Mod: {mod > 0 ? '+' : ''}{mod}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* HP & HIT DICE MANAGEMENT */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0.25rem', background: '#ef4444', borderRadius: '0.25rem', color: 'black' }}>HP & Dadi Vita</div>
                    Punti Ferita
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

                    {/* LEVEL & HIT DICE */}
                    <div>
                        <label style={{ ...labelStyle, color: '#fca5a5' }}>Livello & Dadi Vita</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Livello</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={data.level || 1}
                                    onChange={(e) => {
                                        const lvl = Math.max(1, parseInt(e.target.value) || 1);
                                        const cls = CLASSES.find(c => c.name === data.class.replace(/ *\(.*\)/, ''));
                                        const hdDie = `d${cls?.hitDie || 8}`;
                                        updateData('level', lvl);
                                        updateData('hitDice', { total: lvl, die: hdDie });
                                    }}
                                    style={{ ...inputStyle, width: '60px', textAlign: 'center', borderColor: '#ef4444' }}
                                />
                            </div>
                            <div style={{ fontSize: '1.25rem', color: '#cbd5e1' }}>
                                ×
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dado Vita</span>
                                <div style={{ fontSize: '1.25rem', color: 'white', fontWeight: 700 }}>
                                    {data.hitDice?.die || (CLASSES.find(c => c.name === data.class.replace(/ *\(.*\)/, ''))?.hitDie ? `d${CLASSES.find(c => c.name === data.class.replace(/ *\(.*\)/, ''))?.hitDie}` : 'd8')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div>
                        <label style={{ ...labelStyle, color: '#fca5a5' }}>Calcolo HP</label>
                        <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                            Mod. Costituzione: <strong>{Math.floor(((data.abilities.CON + (racialBonuses.CON || 0)) - 10) / 2) > 0 ? '+' : ''}{Math.floor(((data.abilities.CON + (racialBonuses.CON || 0)) - 10) / 2)}</strong>
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                onClick={() => {
                                    // Calculate Average
                                    const cls = CLASSES.find(c => c.name === data.class.replace(/ *\(.*\)/, ''));
                                    const hd = cls?.hitDie || 8;
                                    const conMod = Math.floor(((data.abilities.CON + (racialBonuses.CON || 0)) - 10) / 2);
                                    const level = data.level || 1;
                                    const avg = Math.floor(hd / 2) + 1;

                                    const total = (hd + conMod) + (Math.max(0, level - 1) * (avg + conMod));
                                    updateData('hp', { current: total, max: total, temp: 0 });
                                }}
                                style={{ ...tabStyle, background: 'rgba(239, 68, 68, 0.3)', border: '1px solid #ef4444' }}
                            >
                                Usa Media (Standard)
                            </button>
                            <button
                                onClick={() => {
                                    // Roll HP
                                    const cls = CLASSES.find(c => c.name === data.class.replace(/ *\(.*\)/, ''));
                                    const hd = cls?.hitDie || 8;
                                    const conMod = Math.floor(((data.abilities.CON + (racialBonuses.CON || 0)) - 10) / 2);
                                    const level = data.level || 1;

                                    // Lvl 1: Max
                                    let total = hd + conMod;
                                    let rolls = [];

                                    // Lvl 2+: Roll
                                    for (let i = 0; i < level - 1; i++) {
                                        const roll = Math.floor(Math.random() * hd) + 1;
                                        rolls.push(roll);
                                        total += (roll + conMod);
                                    }

                                    updateData('hp', { current: total, max: total, temp: 0 });
                                    alert(`Dadi lanciati per ${level - 1} livelli: [${rolls.join(', ')}]\nTotale con CON: ${total}`);
                                }}
                                style={{ ...tabStyle, background: '#ef4444', fontWeight: 600 }}
                            >
                                <Dices size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                Tira Dadi Vita
                            </button>
                        </div>
                    </div>

                    {/* RESULT */}
                    <div style={{ justifySelf: 'center', textAlign: 'center' }}>
                        <label style={{ fontSize: '0.75rem', color: '#fca5a5', marginBottom: '0.25rem', display: 'block' }}>Massimi HP</label>
                        <input
                            type="number"
                            value={data.hp?.max || 0}
                            onChange={(e) => updateData('hp', { ...data.hp, max: parseInt(e.target.value) || 0, current: parseInt(e.target.value) || 0 })}
                            style={{ ...inputStyle, width: '100px', fontSize: '2rem', textAlign: 'center', color: '#fca5a5', borderColor: '#ef4444' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const tabStyle = { padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer', fontSize: '0.875rem' };
const btnMiniStyle = { width: '24px', height: '24px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };


// --- SKILLS STEP ---
export function SkillsStep({ data, updateData }: { data: CharacterData, updateData: (f: keyof CharacterData, v: any) => void }) {
    // Improve class matching to handle "Guerriero (Campione)"
    const baseClass = data.class.split(' (')[0];
    const cls = CLASSES.find(c => c.name === baseClass);
    const availableSkills = cls?.proficiencies?.skills || [];

    // Background Skills
    const baseBg = data.background.split(' (')[0];
    const bg = BACKGROUNDS.find(b => b.name === baseBg);
    const bgSkills = bg?.skillProficiencies || [];

    // Determine # of picks (Simple heuristic)
    const pickCount = baseClass === 'Ladro' ? 4 : (baseClass === 'Bardo' || baseClass === 'Ranger') ? 3 : 2;

    const toggleSkill = (skill: string) => {
        if (bgSkills.includes(skill)) return; // Cannot toggle background skills

        const current = data.skills || [];
        if (current.includes(skill)) {
            updateData('skills', current.filter(s => s !== skill));
        } else {
            // Check limits (excluding BG skills, assuming data.skills ONLY tracks class picks? 
            // Wait, if hydrate merges them later, data.skills MUST NOT contain BG skills during this step)
            if (current.length < pickCount) {
                updateData('skills', [...current, skill]);
            }
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Abilità</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Scegli {pickCount} abilità extra oltre a quelle garantite dal Background.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {availableSkills.map(skill => {
                    const isBgSkill = bgSkills.includes(skill);
                    const isSelected = data.skills.includes(skill);

                    return (
                        <div
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            style={{
                                padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid', cursor: isBgSkill ? 'default' : 'pointer',
                                background: (isSelected || isBgSkill) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                                borderColor: (isSelected || isBgSkill) ? '#10b981' : 'rgba(255,255,255,0.05)',
                                color: (isSelected || isBgSkill) ? '#d1fae5' : '#94a3b8',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                opacity: isBgSkill ? 0.7 : 1
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{skill}</span>
                                {isBgSkill && <span style={{ fontSize: '0.65rem', color: '#6ee7b7' }}>(Background)</span>}
                            </div>
                            {(isSelected || isBgSkill) && <Sparkles size={14} />}
                        </div>
                    );
                })}
            </div>
            {availableSkills.length === 0 && (
                <div style={{ color: '#ef4444', textAlign: 'center' }}>
                    Errore DB: Nessuna skill trovata per {baseClass}. Contattare il DM (Sviluppatore).
                </div>
            )}
            <div style={{ marginTop: '1rem', textAlign: 'right', color: data.skills.length === pickCount ? '#4ade80' : '#facc15' }}>
                Selezionate: {data.skills.length} / {pickCount}
            </div>
        </div>
    );
}

// --- FEATS & SPELLS STEP ---
export function AdvancedOptionsStep({ data, updateData, activeSources = ['PHB', 'XGE', 'TCE'] }: { data: CharacterData, updateData: (f: keyof CharacterData, v: any) => void, activeSources?: string[] }) {
    // Check if Feats available
    const isVarHuman = data.race === 'Umano' && data.subclass === 'Variante';
    const hasFeat = isVarHuman || data.level >= 4;

    // Check Spells
    const casterClasses = ['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone', 'Warlock', 'Artefice', 'Paladino', 'Ranger'];
    const baseClass = data.class.replace(/ *\(.*\)/, '').replace(/[0-9]/g, '').trim();

    // Normalize English/Italian Names
    const normalizeClass = (c: string) => {
        if (c === 'Paladin') return 'Paladino';
        if (c === 'Cleric') return 'Chierico';
        if (c === 'Sorcerer') return 'Stregone';
        if (c === 'Wizard') return 'Mago';
        if (c === 'Bard') return 'Bardo';
        if (c === 'Druid') return 'Druido';
        if (c === 'Fighter') return 'Guerriero';
        if (c === 'Barbarian') return 'Barbaro';
        if (c === 'Rogue') return 'Ladro';
        if (c === 'Monk') return 'Monaco';
        return c;
    }
    const safeBaseClass = normalizeClass(baseClass);
    const isCaster = casterClasses.some(c => safeBaseClass.includes(c));

    // Calculate Max Feats / ASIs
    const calculateMaxFeats = () => {
        let count = 0;
        if (isVarHuman) count += 1;
        const levels = [4, 8, 12, 16, 19];
        // Note: Fighter/Rogue logic added in previous chunk or here
        if (safeBaseClass === 'Guerriero') levels.push(6, 14);
        if (safeBaseClass === 'Ladro') levels.push(10);
        return count + levels.filter(l => data.level >= l).length;
    };
    const maxFeats = calculateMaxFeats();


    const currentFeats = data.features.filter(f => f.source !== 'Class' && f.source !== 'Race' && f.source !== 'Background').length;
    // ^ Heuristic: data.features mixes everything. 
    // Ideally we track feats separately or tag them. 
    // But since we add them via 'addFeat', they naturally append.
    // However, existing features from Race/Class might not be tagged 'source'.
    // `addFeat` adds them with `source: feat.source`.
    // Let's rely on user count for now or just show "Slot Disponibili".
    // Better: Show "Slot sbloccati per livello: X".



    // --- ASYNC FEATS LOGIC ---
    const [apiFeats, setApiFeats] = useState<any[]>([]);
    const [loadingFeats, setLoadingFeats] = useState(false);
    const [featSearch, setFeatSearch] = useState('');

    useEffect(() => {
        if (!hasFeat) return;
        async function loadFeats() {
            setLoadingFeats(true);
            try {
                const srcParam = activeSources.join(',');
                const res = await fetch(`/api/dnd/feats?sources=${srcParam}`);
                const json = await res.json();
                if (json.feats) setApiFeats(json.feats);
            } catch (e) {
                console.error("Failed to load feats", e);
            } finally {
                setLoadingFeats(false);
            }
        }
        loadFeats();
    }, [hasFeat, activeSources]);


    const filteredFeats = React.useMemo(() => {
        if (!featSearch) return apiFeats;
        return apiFeats.filter(f => f.name.toLowerCase().includes(featSearch.toLowerCase()));
    }, [apiFeats, featSearch]);

    const addFeat = (featName: string) => {
        const feat = apiFeats.find(f => f.name === featName);
        if (!feat) return;
        // Check if already added
        if (data.features.some(f => f.name === feat.name)) return;

        const newFeatFeature = {
            name: feat.name,
            level: data.level, // Acquired at current level
            source: feat.source,
            description: feat.description || ''
        };
        updateData('features', [...data.features, newFeatFeature]);
    };

    const removeFeat = (featName: string) => {
        updateData('features', data.features.filter(f => f.name !== featName));
    };


    // --- ASYNC SPELLS LOGIC ---
    const [apiSpells, setApiSpells] = useState<any[]>([]);
    const [loadingSpells, setLoadingSpells] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const maxSpellLevel = React.useMemo(() => {
        let max = 0;
        if (['Paladino', 'Ranger'].includes(safeBaseClass)) max = Math.ceil(data.level / 2);
        else if (['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone'].includes(safeBaseClass)) max = Math.ceil(data.level / 2);
        else if (safeBaseClass === 'Warlock') { max = Math.ceil(data.level / 2); if (max > 5) max = 5; }
        else if (safeBaseClass === 'Artefice') max = Math.ceil(data.level / 2);

        if (max > 9) max = 9;
        if (max < 1 && isCaster) max = 1;
        return max;
    }, [safeBaseClass, data.level, isCaster]);

    useEffect(() => {
        if (!isCaster) return;
        async function load() {
            setLoadingSpells(true);
            try {
                const srcParam = activeSources.join(',');
                const res = await fetch(`/api/dnd/spells?sources=${srcParam}`);
                const json = await res.json();
                if (json.spells) {
                    setApiSpells(json.spells);
                }
            } catch (e) {
                console.error("Failed to fetch spells", e);
            } finally {
                setLoadingSpells(false);
            }
        }
        load();
    }, [activeSources, isCaster]);

    // Limit to 9
    // Filter Logic
    const displayedSpells = React.useMemo(() => {
        let spells = apiSpells;
        // Filter by Level
        spells = spells.filter(s => s.level <= maxSpellLevel);

        // Filter by Search
        if (searchTerm) {
            spells = spells.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return spells;
    }, [apiSpells, maxSpellLevel, searchTerm]);

    // Group by Level
    const spellsByLevel: Record<number, any[]> = {};
    displayedSpells.forEach(s => {
        if (!spellsByLevel[s.level]) spellsByLevel[s.level] = [];
        spellsByLevel[s.level].push(s);
    });

    const toggleSpell = (spellName: string, level: number) => {
        const current = data.spells || [];
        const exists = current.find(s => s.name === spellName);
        if (exists) {
            updateData('spells', current.filter(s => s.name !== spellName));
        } else {
            // New spell structure from API
            updateData('spells', [...current, { name: spellName, level: level, prepared: true }]);
        }
    };

    // Limits Definitions (Re-added for Display)
    const limits = getSpellLimits(safeBaseClass, data.subclass || '', data.level, data.abilities);
    const currentCantrips = data.spells.filter(s => s.level === 0);
    const currentLeveled = data.spells.filter(s => s.level > 0);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {hasFeat && (
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Talento</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Cerca Talento..."
                            value={featSearch}
                            onChange={e => setFeatSearch(e.target.value)}
                            style={{ ...inputStyle, width: '100%' }}
                        />
                    </div>
                    {loadingFeats ? (
                        <div style={{ color: '#a78bfa' }}>Caricamento Talenti...</div>
                    ) : (
                        <select style={inputStyle} onChange={(e) => addFeat(e.target.value)} value="">
                            <option value="">Seleziona un Talento da aggiungere...</option>
                            {filteredFeats.map(f => (
                                <option key={f.name} value={f.name}>
                                    {f.name} {f.source !== 'PHB' && `[${f.source}]`}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Show selected feats that are NOT class features (heuristic: source is strict) */}
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {data.features.filter(f => !['Class', 'Race'].includes(f.source || '') && filteredFeats.some(api => api.name === f.name)).map(f => (
                            <div key={f.name} style={{ background: '#4c1d95', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #8b5cf6' }}>
                                <span>{f.name}</span>
                                <button onClick={() => removeFeat(f.name)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontWeight: 'bold' }}>Ã—</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isCaster && (
                <div>
                    <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Incantesimi (Database Esteso)
                    </h3>

                    {/* LIMITS DISPLAY */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                        <div style={{ color: currentCantrips.length > limits.cantrips ? '#ef4444' : '#94a3b8' }}>
                            <span style={{ fontWeight: 700, color: 'white' }}>Trucchetti:</span> {currentCantrips.length} / {limits.cantrips}
                        </div>
                        {limits.type === 'known' && (
                            <div style={{ color: currentLeveled.length > limits.known ? '#ef4444' : '#94a3b8' }}>
                                <span style={{ fontWeight: 700, color: 'white' }}>Conosciuti:</span> {currentLeveled.length} / {limits.known}
                            </div>
                        )}
                        {limits.type === 'prepared' && (
                            <div style={{ color: currentLeveled.length > limits.prepared ? '#ef4444' : '#94a3b8' }}>
                                <span style={{ fontWeight: 700, color: 'white' }}>Preparati:</span> {currentLeveled.length} / {limits.prepared}
                            </div>
                        )}
                        {baseClass === 'Mago' && (
                            <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748b' }}>
                                *Per il Mago, seleziona i Preparati. Il Libro ne contiene di piÃ¹ (6 + 2/liv).
                            </div>
                        )}
                    </div>

                    {/* SEARCH BOX */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Cerca incantesimo (es. 'Fireball')..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ ...inputStyle, width: '100%' }}
                        />
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                            Nota: Incluso contenuto da {activeSources.join(', ')}.
                        </div>
                    </div>

                    {loadingSpells ? (
                        <div style={{ color: '#a78bfa', textAlign: 'center', padding: '2rem' }}>Caricamento Incantesimi Plutonium...</div>
                    ) : (
                        <div>
                            {/* Always show levels 0 to MAX */}
                            {Array.from({ length: maxSpellLevel + 1 }).map((_, level) => {
                                const list = spellsByLevel[level] || [];

                                return (
                                    <div key={level} style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ color: '#a78bfa', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                                            {level === 0 ? 'Trucchetti (Livello 0)' : `Livello ${level}`}
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                            {list.length > 0 ? list.map((spell: any) => {
                                                const isSelected = data.spells.some(s => s.name === spell.name);
                                                // Enable selection logic (Optional: Disable if full)
                                                const isCantrip = spell.level === 0;
                                                const cantripFull = currentCantrips.length >= limits.cantrips;
                                                const leveledFull = limits.type === 'known'
                                                    ? currentLeveled.length >= limits.known
                                                    : currentLeveled.length >= limits.prepared;
                                                const disabled = !isSelected && (isCantrip ? cantripFull : leveledFull);

                                                return (
                                                    <button
                                                        key={spell.name}
                                                        onClick={() => !disabled && toggleSpell(spell.name, level)}
                                                        style={{
                                                            padding: '0.5rem',
                                                            borderRadius: '0.25rem',
                                                            border: '1px solid',
                                                            borderColor: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.1)',
                                                            background: isSelected ? 'rgba(167, 139, 250, 0.2)' : 'transparent',
                                                            color: isSelected ? 'white' : disabled ? '#475569' : '#cbd5e1',
                                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                                            textAlign: 'left',
                                                            fontSize: '0.9rem',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}
                                                        title={spell.description || spell.name}
                                                    >
                                                        {spell.name}
                                                        {spell.source !== 'PHB' && <span style={{ marginLeft: '0.5rem', fontSize: '0.7em', color: '#64748b' }}>[{spell.source}]</span>}
                                                    </button>
                                                );
                                            }) : (
                                                <div style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>Nessun incantesimo trovato.</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {!hasFeat && !isCaster && (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                    Nessuna opzione avanzata disponibile per questa classe/livello.
                    <br />Clicca Avanti per continuare.
                </div>
            )}
        </div>
    );
}

export function EquipmentStep({ data, updateData, activeSources = ['PHB', 'XGE', 'TCE'] }: { data: CharacterData, updateData: (f: keyof CharacterData, v: any) => void, activeSources?: string[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [apiItems, setApiItems] = useState<any[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Fetch Items on Init (or when sources change)
    useEffect(() => {
        async function load() {
            setLoadingItems(true);
            try {
                const srcParam = activeSources.join(',');
                const res = await fetch(`/api/dnd/items?sources=${srcParam}`);
                const json = await res.json();
                if (json.items) {
                    setApiItems(json.items);
                }
            } catch (e) {
                console.error("Failed to load items", e);
            } finally {
                setLoadingItems(false);
            }
        }
        load();
    }, [activeSources]);

    // Default Equipment Loading (One-time)
    useEffect(() => {
        if (data.equipment.length === 0) {
            const cls = CLASSES.find(c => c.name === data.class.split(' (')[0]);
            if (cls?.equipment) {
                updateData('equipment', cls.equipment);
            }
        }
    }, []);

    const addItem = (itemName: string) => {
        if (itemName.trim()) {
            updateData('equipment', [...data.equipment, itemName.trim()]);
            setSearchTerm('');
            setShowResults(false);
        }
    };

    const removeItem = (index: number) => {
        const newEq = [...data.equipment];
        newEq.splice(index, 1);
        updateData('equipment', newEq);
    };

    const filteredItems = React.useMemo(() => {
        if (!searchTerm) return [];
        return apiItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10);
    }, [searchTerm, apiItems]);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Equipaggiamento</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Gestisci il tuo inventario. Cerca oggetti dal database o aggiungi equipaggiamento personalizzato.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left: Search & Add */}
                <div>
                    <h4 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Aggiungi Oggetto</h4>
                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
                                placeholder="Cerca oggetto (es. 'Spada Lunga')..."
                                style={{ ...inputStyle, flex: 1 }}
                                onFocus={() => setShowResults(true)}
                            />
                            <button
                                onClick={() => addItem(searchTerm)} // Fallback for custom items
                                style={{ padding: '0.5rem 1rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                            >
                                +
                            </button>
                        </div>

                        {/* Autocomplete Dropdown */}
                        {showResults && searchTerm && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, right: 0,
                                background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0.5rem', maxHeight: '200px', overflowY: 'auto', zIndex: 10,
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }}>
                                {loadingItems ? (
                                    <div style={{ padding: '0.5rem', color: '#94a3b8' }}>Caricamento...</div>
                                ) : filteredItems.length > 0 ? (
                                    filteredItems.map(item => (
                                        <div
                                            key={item.name + item.source}
                                            onClick={() => addItem(item.name)}
                                            style={{
                                                padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                cursor: 'pointer', color: '#e2e8f0', display: 'flex', justifyContent: 'space-between'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span>{item.name}</span>
                                            {item.source !== 'PHB' && <span style={{ fontSize: '0.7rem', color: '#64748b' }}>[{item.source}]</span>}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '0.5rem', color: '#94a3b8' }}>
                                        Nessun risultato. Premi + per aggiungere come personalizzato.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                        Nota: La ricerca include oggetti da: {activeSources.join(', ')}.
                    </div>
                </div>

                {/* Right: Inventory List */}
                <div>
                    <h4 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Zaino</h4>
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.5rem', minHeight: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                        {data.equipment.map((item, idx) => (
                            <div key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                                <span>{item}</span>
                                <button onClick={() => removeItem(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Ã—</button>
                            </div>
                        ))}
                        {data.equipment.length === 0 && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                                Lo zaino Ã¨ vuoto.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>



    );
}

// --- BIO STEP ---
export function BioStep({ data, updateData }: { data: CharacterData, updateData: (f: keyof CharacterData, v: any) => void }) {
    const randomTrait = (pool: readonly string[], field: keyof typeof data.personality) => {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        updateData('personality', { ...data.personality, [field]: pick });
    };


    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Dettagli Personali</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Dai vita al tuo personaggio. Chi è? Cosa vuole?</p>

            <div style={{ marginBottom: '2rem' }}>
                <label style={labelStyle}>Nome Eroe</label>
                <input
                    type="text"
                    value={data.characterName}
                    onChange={(e) => updateData('characterName', e.target.value)}
                    placeholder="Il nome della tua leggenda..."
                    style={{ ...inputStyle, fontSize: '1.25rem', fontWeight: 700 }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={labelStyle}>Tratti della Personalità</label>
                            <button onClick={() => randomTrait(PERSONALITY_TRAITS, 'traits')} style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Dices size={12} style={{ marginRight: '4px' }} /> Casuale
                            </button>
                        </div>
                        <textarea
                            value={data.personality.traits}
                            onChange={(e) => updateData('personality', { ...data.personality, traits: e.target.value })}
                            style={{ ...inputStyle, minHeight: '80px' }}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={labelStyle}>Ideali</label>
                            <button onClick={() => randomTrait(IDEALS, 'ideals')} style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Dices size={12} style={{ marginRight: '4px' }} /> Casuale
                            </button>
                        </div>
                        <textarea
                            value={data.personality.ideals}
                            onChange={(e) => updateData('personality', { ...data.personality, ideals: e.target.value })}
                            style={{ ...inputStyle, minHeight: '60px' }}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={labelStyle}>Legami</label>
                            <button onClick={() => randomTrait(BONDS, 'bonds')} style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Dices size={12} style={{ marginRight: '4px' }} /> Casuale
                            </button>
                        </div>
                        <textarea
                            value={data.personality.bonds}
                            onChange={(e) => updateData('personality', { ...data.personality, bonds: e.target.value })}
                            style={{ ...inputStyle, minHeight: '60px' }}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={labelStyle}>Difetti</label>
                            <button onClick={() => randomTrait(FLAWS, 'flaws')} style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Dices size={12} style={{ marginRight: '4px' }} /> Casuale
                            </button>
                        </div>
                        <textarea
                            value={data.personality.flaws}
                            onChange={(e) => updateData('personality', { ...data.personality, flaws: e.target.value })}
                            style={{ ...inputStyle, minHeight: '60px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Storia del Personaggio (Backstory)</label>
                        <textarea
                            value={data.personality.backstory}
                            onChange={(e) => updateData('personality', { ...data.personality, backstory: e.target.value })}
                            style={{ ...inputStyle, height: '300px' }}
                            placeholder="Scrivi qui la storia del tuo eroe..."
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Allineamento</label>
                        <select
                            value={data.alignment}
                            onChange={(e) => updateData('alignment', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Seleziona...</option>
                            <option value="Legale Buono">Legale Buono</option>
                            <option value="Neutrale Buono">Neutrale Buono</option>
                            <option value="Caotico Buono">Caotico Buono</option>
                            <option value="Legale Neutrale">Legale Neutrale</option>
                            <option value="Neutrale Puro">Neutrale Puro</option>
                            <option value="Caotico Neutrale">Caotico Neutrale</option>
                            <option value="Legale Malvagio">Legale Malvagio</option>
                            <option value="Neutrale Malvagio">Neutrale Malvagio</option>
                            <option value="Caotico Malvagio">Caotico Malvagio</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- BACKGROUND STEP ---
export function BackgroundStep({ data, updateData, activeSources = ['PHB', 'XGE', 'TCE'] }: { data: CharacterData, updateData: (f: keyof CharacterData, v: any) => void, activeSources?: string[] }) {
    const [backgrounds, setBackgrounds] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const srcParam = activeSources.join(',');
                const res = await fetch(`/api/dnd/backgrounds?sources=${srcParam}`);
                const json = await res.json();
                if (json.backgrounds) setBackgrounds(json.backgrounds);
            } catch (e) {
                console.error("Failed to load backgrounds", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [activeSources]);

    const filtered = backgrounds.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

    const selectBackground = (bg: any) => {
        // Update background name
        // Note: generic proficiencies in json are tricky (e.g. "choose two from...").
        // For now, let's just save the background name and name-based skills if distinct.
        // Actually, Plutonium data often has concrete skills or "choose 2".

        updateData('background', bg.name);
        // updateData('skills', newSkills); // Optional: Auto-add skills? Might conflict with manual picks logic. 
        // Better to just set background and let user pick skills manually in next step if they want, 
        // OR separate background skills.

        // For now, simpliest: Set Name.
        // Feature?
        if (bg.feature) {
            const feat = {
                name: bg.feature.name,
                source: bg.source,
                level: 1,
                description: bg.feature.entries ? JSON.stringify(bg.feature.entries) : ''
            };
            // Remove old background feature?
            const cleanFeatures = data.features.filter(f => f.source !== 'Background');
            updateData('features', [...cleanFeatures, { ...feat, source: 'Background' }]);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Background (Avventura)</h3>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Cerca Background..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ ...inputStyle, width: '100%' }}
                />
            </div>
            {loading ? <div style={{ color: '#a78bfa' }}>Caricamento...</div> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {filtered.map(bg => (
                        <div
                            key={bg.name}
                            onClick={() => selectBackground(bg)}
                            style={{
                                padding: '1rem',
                                border: '1px solid',
                                borderColor: data.background === bg.name ? '#10b981' : 'rgba(255,255,255,0.1)',
                                background: data.background === bg.name ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                borderRadius: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', color: 'white' }}>{bg.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{bg.source}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
