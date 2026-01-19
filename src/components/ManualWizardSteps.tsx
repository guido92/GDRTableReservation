
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CLASSES, RACES, FEATS, BACKGROUNDS, PERSONALITY_TRAITS, IDEALS, BONDS, FLAWS } from '@/data/dnd-data';
import { SPELLS } from '@/data/spells';
import { AbilityScores, CharacterData } from '@/types/dnd';
import { Shield, Brain, BicepsFlexed, Tangent, Sparkles, Scroll, Book } from 'lucide-react';

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
                <div style={{ textAlign: 'center', marginBottom: '1rem', color: points >= 0 ? '#4ade80' : '#ef4444' }}>
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

    // Determine # of picks (Simple heuristic)
    const pickCount = baseClass === 'Ladro' ? 4 : (baseClass === 'Bardo' || baseClass === 'Ranger') ? 3 : 2;

    const toggleSkill = (skill: string) => {
        const current = data.skills || [];
        if (current.includes(skill)) {
            updateData('skills', current.filter(s => s !== skill));
        } else {
            if (current.length < pickCount) {
                updateData('skills', [...current, skill]);
            }
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Abilità</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Scegli {pickCount} abilità in cui sei competente.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {availableSkills.map(skill => (
                    <div
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        style={{
                            padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid', cursor: 'pointer',
                            background: data.skills.includes(skill) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                            borderColor: data.skills.includes(skill) ? '#10b981' : 'rgba(255,255,255,0.05)',
                            color: data.skills.includes(skill) ? '#d1fae5' : '#94a3b8',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                    >
                        <span>{skill}</span>
                        {data.skills.includes(skill) && <Sparkles size={14} />}
                    </div>
                ))}
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
export function AdvancedOptionsStep({ data, updateData }: { data: CharacterData, updateData: (f: keyof CharacterData, v: any) => void }) {
    // Check if Feats available
    // Variant Human gets a feat at Lv1. Everyone gets at Lv 4, 8, 12, 16, 19
    const isVarHuman = data.race === 'Umano' && data.subclass === 'Variante'; // Assuming handling
    const hasFeat = isVarHuman || data.level >= 4;

    // Check Spells
    const casterClasses = ['Bardo', 'Chierico', 'Druido', 'Mago', 'Stregone', 'Warlock', 'Artefice', 'Paladino', 'Ranger'];
    const baseClass = data.class.split(' (')[0];
    const isCaster = casterClasses.some(c => data.class.includes(c)); // Simple check

    // Limits
    const limits = getSpellLimits(baseClass, data.subclass || '', data.level, data.abilities);
    const currentCantrips = data.spells.filter(s => s.level === 0);
    const currentLeveled = data.spells.filter(s => s.level > 0);

    // Filter spells (Level 0 and 1 for starters)
    const classSpells = SPELLS.filter(s => s.classes.some(c => data.class.includes(c)) && s.level <= (data.level === 1 ? 1 : 9)); // Simplified

    const toggleSpell = (spellName: string) => {
        const current = data.spells || [];
        const exists = current.find(s => s.name === spellName);
        if (exists) {
            updateData('spells', current.filter(s => s.name !== spellName));
        } else {
            const spell = SPELLS.find(s => s.name === spellName);
            if (spell) updateData('spells', [...current, { name: spell.name, level: spell.level, prepared: true }]);
        }
    };

    const addFeat = (featName: string) => {
        const feat = FEATS.find(f => f.name === featName);
        if (!feat) return;
        // Add to features if not present
        const currentFeats = data.features.filter(f => f.source !== 'FEAT');
        // We'll tag it or just append
        const newFeatFeature = { name: feat.name, level: 1, source: 'PHB14', description: feat.description || '' };
        // Remove old feat if we are replacing (basic logic: assumes 1 feat choice for now in this UI)
        // complex logic required for multiple feats.
        // Let's just append for simplicity in this V2
        updateData('features', [...data.features, newFeatFeature]);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {hasFeat && (
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Talento</h3>
                    <select style={inputStyle} onChange={(e) => addFeat(e.target.value)}>
                        <option value="">Seleziona un Talento...</option>
                        {FEATS.map(f => (
                            <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {isCaster && (
                <div>
                    <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Incantesimi
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
                                <span style={{ fontWeight: 700, color: 'white' }}>Preparati (Giornalieri):</span> {currentLeveled.length} / {limits.prepared}
                            </div>
                        )}
                        {baseClass === 'Mago' && (
                            <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748b' }}>
                                *Per il Mago, seleziona i Preparati. Il Libro ne contiene di più (6 + 2/liv).
                            </div>
                        )}
                    </div>

                    <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => {
                            const spellsAtLevel = classSpells.filter(s => s.level === lvl);
                            if (spellsAtLevel.length === 0) return null;

                            return (
                                <div key={lvl} style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ color: '#a78bfa', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
                                        {lvl === 0 ? 'Trucchetti (Livello 0)' : `Livello ${lvl}`}
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.5rem' }}>
                                        {spellsAtLevel.map(s => {
                                            const isSelected = data.spells.find(x => x.name === s.name);
                                            // Disable logic:
                                            // If lvl 0: disable if max reached AND not selected
                                            // If lvl > 0: disable if max (known/prepared) reached AND not selected
                                            const isCantrip = s.level === 0;
                                            const cantripFull = currentCantrips.length >= limits.cantrips;
                                            const leveledFull = limits.type === 'known'
                                                ? currentLeveled.length >= limits.known
                                                : currentLeveled.length >= limits.prepared;

                                            const disabled = !isSelected && (isCantrip ? cantripFull : leveledFull);

                                            return (
                                                <div
                                                    key={s.name}
                                                    onClick={() => !disabled && toggleSpell(s.name)}
                                                    style={{
                                                        padding: '0.75rem', borderRadius: '0.5rem', cursor: disabled ? 'not-allowed' : 'pointer',
                                                        opacity: disabled ? 0.5 : 1,
                                                        background: isSelected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                                                        border: '1px solid',
                                                        borderColor: isSelected ? '#7c3aed' : 'rgba(255,255,255,0.05)',
                                                        display: 'flex', flexDirection: 'column'
                                                    }}
                                                >
                                                    <div style={{ fontWeight: 600, color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                                                        {s.name}
                                                        {isSelected && <Sparkles size={14} color="#a78bfa" />}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{s.description.slice(0, 60)}...</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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


// --- EQUIPMENT STEP ---
export function EquipmentStep({ data, updateData }: { data: CharacterData, updateData: (f: keyof CharacterData, v: any) => void }) {
    const [newItem, setNewItem] = useState('');

    // Default Equipment Loading (One-time)
    useEffect(() => {
        if (data.equipment.length === 0) {
            const cls = CLASSES.find(c => c.name === data.class.split(' (')[0]);
            if (cls?.equipment) {
                updateData('equipment', cls.equipment);
            }
        }
    }, []);

    const addItem = () => {
        if (newItem.trim()) {
            updateData('equipment', [...data.equipment, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index: number) => {
        const newEq = [...data.equipment];
        newEq.splice(index, 1);
        updateData('equipment', newEq);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Equipaggiamento</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Gestisci il tuo inventario. Abbiamo aggiunto l'equipaggiamento standard della tua classe.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left: Inventory List */}
                <div>
                    <h4 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Zaino</h4>
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.5rem', minHeight: '200px' }}>
                        {data.equipment.map((item, idx) => (
                            <div key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                                <span>{item}</span>
                                <button onClick={() => removeItem(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                            </div>
                        ))}
                        {data.equipment.length === 0 && <div style={{ color: '#64748b', padding: '1rem', textAlign: 'center' }}>Zaino vuoto</div>}
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addItem()}
                            placeholder="Aggiungi oggetto..."
                            style={inputStyle}
                        />
                        <button onClick={addItem} style={{ ...tabStyle, background: '#7c3aed' }}>+</button>
                    </div>
                </div>

                {/* Right: Combat Stats (Simplified) */}
                <div>
                    <h4 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Statistiche di Combattimento</h4>
                    <div style={cardStyle}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Classe Armatura (AC)</label>
                            <input
                                type="number"
                                value={data.armorClass}
                                onChange={(e) => updateData('armorClass', parseInt(e.target.value) || 10)}
                                style={inputStyle}
                            />
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Valore base. Modificatori da scudo/magia vanno calcolati a parte.</div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Punti Ferita Attuali (HP)</label>
                            <input
                                type="number"
                                value={data.hp.max}
                                onChange={(e) => updateData('hp', { ...data.hp, max: parseInt(e.target.value) || 1, current: parseInt(e.target.value) || 1 })}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Velocità (m)</label>
                            <input
                                type="number"
                                value={data.speed}
                                onChange={(e) => updateData('speed', parseInt(e.target.value) || 9)}
                                style={inputStyle}
                            />
                        </div>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={labelStyle}>Tratti della Personalità</label>
                            <button onClick={() => randomTrait(PERSONALITY_TRAITS, 'traits')} style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer' }}>🎲 Random</button>
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
                            <button onClick={() => randomTrait(IDEALS, 'ideals')} style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer' }}>🎲 Random</button>
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
                            <button onClick={() => randomTrait(BONDS, 'bonds')} style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer' }}>🎲 Random</button>
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
                            <button onClick={() => randomTrait(FLAWS, 'flaws')} style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer' }}>🎲 Random</button>
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
