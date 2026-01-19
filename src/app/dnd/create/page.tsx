'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scroll, User, Dices, ChevronRight, MessageSquare } from 'lucide-react';
import { CLASSES, RACES, BACKGROUNDS, ALIGNMENTS, SOURCES_CONFIG, Source, Option } from '@/data/dnd-data';
import { CharacterData } from '@/types/dnd';
import { CharacterLogic } from '@/lib/character-logic';
import AiChatBuilder from '@/components/AiChatBuilder';

const INITIAL_DATA: CharacterData = {
    characterName: '',
    playerName: '',
    race: 'Umano',
    class: 'Guerriero',
    level: 1,
    background: 'Soldato',
    alignment: 'Neutrale',
    abilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    skills: [],
    languages: [],
    equipment: [],
    features: [],
    attacks: [],
    hp: { current: 10, max: 10, temp: 0 },
    armorClass: 10,
    initiative: 0,
    speed: 30,
    hitDice: { total: 1, die: 'd10' },
    personality: { traits: '', ideals: '', bonds: '', flaws: '', backstory: '' },
    spells: [],
    is2024: true,
};

export default function CharactermancerV2() {
    const [step, setStep] = useState(0); // 0 = Intro/QuickBuild choice
    const [data, setData] = useState<CharacterData>(INITIAL_DATA);
    const [loading, setLoading] = useState(false);
    const [activeSources, setActiveSources] = useState<Source[]>(['PHB', 'PHB24', 'TCE', 'XGE']);

    const updateData = (field: keyof CharacterData, value: any) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleSource = (source: Source) => {
        setActiveSources(prev =>
            prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
        );
    };

    const filterOptions = (options: Option[]) => {
        return options.filter(o => !o.source || activeSources.includes(o.source));
    };

    // Quick Build Generator (AI Powered)
    const quickBuild = async (level: number) => {
        setLoading(true);

        try {
            // Attempt AI Generaton
            const response = await fetch('/api/dnd/ai-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, sourceFilter: activeSources })
            });

            if (!response.ok) {
                throw new Error('AI Generation failed, falling back to local logic.');
            }

            const aiData = await response.json();

            // Enforce Rules: Hydrate AI data with official features/stats to ensure accuracy
            const strictData = CharacterLogic.hydrateCharacter(aiData);

            setData(strictData);
            generatePDF(strictData); // Auto generate PDF

        } catch (error) {
            console.warn(error);
            // Fallback to Local Logic
            setTimeout(() => {
                const newData = CharacterLogic.generateQuickCharacter(level, activeSources.map(s => s as string));
                setData(newData);
                generatePDF(newData);
            }, 800);
        } finally {
            // Loading state cleared in generatePDF or here if needed, 
            // but generatePDF sets it to false at end, so it's safer to not unset it here immediately if we chain.
            // However, generatePDF is async.
        }
    };

    // Manual Build Finalizer (Deterministic)
    const finishManualBuild = async () => {
        setLoading(true);
        try {
            // Use local logic to hydrate features/stats based on selections
            // This ensures 100% accuracy for manual builds without AI hallucinations
            const finalData = CharacterLogic.hydrateCharacter(data);
            setData(finalData);
            await generatePDF(finalData);
        } catch (e) {
            console.error(e);
            alert("Errore nella generazione del personaggio.");
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async (charData: CharacterData) => {
        setLoading(true);
        try {
            const response = await fetch('/api/dnd/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(charData),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${charData.characterName || 'Hero'}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (e) {
            console.error(e);
            alert('Errore generazione');
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const containerStyle: React.CSSProperties = {
        maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', minHeight: '100vh',
        display: 'flex', flexDirection: 'column'
    };
    const cardStyle: React.CSSProperties = {
        background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem',
        padding: '2rem', cursor: 'pointer', transition: 'all 0.3s ease',
        position: 'relative', overflow: 'hidden'
    };
    const headerStyle: React.CSSProperties = {
        marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
    };

    return (
        <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

            <div style={containerStyle}>

                {/* Header */}
                <header style={headerStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '0.75rem', display: 'flex' }}>
                            <Sparkles size={24} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(to right, #e9d5ff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                                Charactermancer
                            </h1>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Forgia il tuo destino</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {SOURCES_CONFIG.map(src => (
                            <button
                                key={src.id}
                                onClick={() => toggleSource(src.id)}
                                style={{
                                    padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '0.5rem',
                                    border: '1px solid', transition: 'all 0.2s',
                                    background: activeSources.includes(src.id) ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                    borderColor: activeSources.includes(src.id) ? '#a855f7' : 'rgba(255, 255, 255, 0.1)',
                                    color: activeSources.includes(src.id) ? '#d8b4fe' : '#64748b'
                                }}
                            >
                                {src.name.split(' (')[0]}
                            </button>
                        ))}
                    </div>
                </header>

                <AnimatePresence mode="wait">

                    {/* SELEZIONE INIZIALE (Home) */}
                    {step === 0 && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}
                        >
                            {/* Manual Mode */}
                            <div
                                onClick={() => setStep(1)}
                                style={cardStyle}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            >
                                <div style={{ marginBottom: '1.5rem', width: '64px', height: '64px', background: '#1e293b', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={32} color="#818cf8" />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Creazione Guidata</h2>
                                <p style={{ color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>Scegli Razza, Classe e Background. L'AI penserà ai dettagli.</p>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#a78bfa', fontWeight: 600, fontSize: '0.875rem' }}>
                                    Inizia il Rituale <ChevronRight size={16} style={{ marginLeft: '0.25rem' }} />
                                </div>
                            </div>

                            {/* Chat Mode */}
                            <div
                                onClick={() => setStep(2)}
                                style={cardStyle}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ec4899'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            >
                                <div style={{ marginBottom: '1.5rem', width: '64px', height: '64px', background: '#1e293b', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MessageSquare size={32} color="#f472b6" />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Creazione Narrativa</h2>
                                <p style={{ color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>Parla con il Dungeon Master AI. Descrivi il tuo eroe e lascialo prendere vita.</p>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#f472b6', fontWeight: 600, fontSize: '0.875rem' }}>
                                    Entra nella Tana <ChevronRight size={16} style={{ marginLeft: '0.25rem' }} />
                                </div>
                            </div>

                            {/* Quick Build */}
                            <div style={{ ...cardStyle, cursor: 'default' }}>
                                <div style={{ marginBottom: '1.5rem', width: '64px', height: '64px', background: '#1e293b', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Dices size={32} color="#10b981" />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Quick Build</h2>
                                <p style={{ color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.5rem' }}>Generazione istantanea per NPC o personaggi veloci.</p>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#64748b', marginBottom: '0.5rem' }}>Scegli il Livello</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {[1, 3, 5, 10].map(lvl => (
                                            <button
                                                key={lvl}
                                                disabled={loading}
                                                onClick={() => quickBuild(lvl)}
                                                style={{
                                                    flex: 1, padding: '0.5rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '0.5rem', color: '#f8fafc', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; e.currentTarget.style.color = '#34d399'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#f8fafc'; }}
                                            >
                                                Lv {lvl}
                                            </button>
                                        ))}
                                    </div>
                                    {loading && <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#34d399', marginTop: '1rem', animation: 'pulse 2s infinite' }}>Evocazione dello spirito (AI) in corso...</div>}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* WIZARD FLOW */}
                    {step === 1 && (
                        <WizardFlow
                            data={data}
                            updateData={updateData}
                            activeSources={activeSources}
                            filterOptions={filterOptions}
                            onCancel={() => setStep(0)}
                            onFinish={finishManualBuild}
                            loading={loading}
                        />
                    )}

                    {/* CHAT MODE */}
                    {step === 2 && (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}
                        >
                            <AiChatBuilder
                                onCancel={() => setStep(0)}
                                onFinish={(aiData) => {
                                    setData(aiData);
                                    generatePDF(aiData);
                                }}
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

// ... (imports remain)
import {
    AbilityScoreStep,
    SkillsStep,
    BackgroundStep,
    AdvancedOptionsStep,
    EquipmentStep,
    BioStep
} from '@/components/ManualWizardSteps';

// ... (CharactermancerV2 remains same until WizardFlow)

// Sub-component for Wizard
function WizardFlow({ data, updateData, activeSources, filterOptions, onCancel, onFinish, loading }: any) {
    const [wizardStep, setWizardStep] = useState(0);

    const next = () => setWizardStep(p => p + 1);
    const prev = () => setWizardStep(p => p - 1);

    const steps = [
        { title: "Origini", subtitle: "Scegli la tua stirpe e vocazione" },
        { title: "Statistiche", subtitle: "Definisci il tuo potenziale" },
        { title: "Background", subtitle: "Le tue origini e competenze" },
        { title: "Competenze", subtitle: "Cosa sai fare meglio" },
        { title: "Talenti & Magia", subtitle: "Poteri speciali e incantesimi" },
        { title: "Equipaggiamento", subtitle: "Armi, armature e oggetti" },
        { title: "Dettagli", subtitle: "Definisci il tuo passato" }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}
        >
            {/* Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                {steps.map((s, i) => (
                    <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: i <= wizardStep ? '#7c3aed' : '#1e293b',
                            border: i === wizardStep ? '2px solid #a78bfa' : '2px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem'
                        }}>
                            {i + 1}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: i <= wizardStep ? 'white' : '#64748b', fontWeight: 600, display: 'none' /* Hide text on mobile maybe, keep for now */ }}>{s.title}</div>
                    </div>
                ))}
            </div>

            <div style={{ background: '#13141a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', padding: '2rem', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>

                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(to right, white, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {steps[wizardStep].title}
                </h2>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{steps[wizardStep].subtitle}</p>

                <div style={{ flex: 1 }}>
                    {/* STEP 0: CLASS & RACE */}
                    {wizardStep === 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* CLASS */}
                            <div>
                                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={18} color="#f87171" />
                                    <h3 style={{ fontWeight: 600, color: 'white' }}>Classe ({CLASSES.length})</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>

                                    {CLASSES.map((c: any) => (
                                        <div key={c.name} onClick={() => {
                                            updateData('class', c.name);
                                            // Update Hit Die
                                            const hd = c.hitDie ? `d${c.hitDie}` : 'd8';
                                            updateData('hitDice', { total: data.level, die: hd });
                                        }}
                                            style={{
                                                padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                                                background: data.class.includes(c.name) ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                                borderColor: data.class.includes(c.name) ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                                                color: data.class.includes(c.name) ? '#ddd6fe' : '#94a3b8',
                                                opacity: (!c.source || activeSources.includes(c.source)) ? 1 : 0.3
                                            }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                {c.name}
                                                {c.source && c.source !== 'PHB' && <span style={{ marginLeft: '4px', fontSize: '0.65rem', color: '#fca5a5', border: '1px solid #fca5a5', borderRadius: '4px', padding: '0 4px' }}>{c.source}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Subclass */}
                                {CLASSES.find((c: any) => c.name === data.class.replace(/ *\(.*\)/, ''))?.suboptions && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <label style={labelStyle}>Sottoclasse</label>
                                        <select
                                            value={data.class.includes('(') ? data.class.match(/\((.*?)\)/)?.[1] || '' : ''}
                                            onChange={(e) => {
                                                const base = data.class.replace(/ *\(.*\)/, '');
                                                const sub = e.target.value;
                                                updateData('class', sub ? `${base} (${sub})` : base);
                                            }}
                                            style={inputStyle}
                                        >
                                            <option value="">Seleziona...</option>
                                            {CLASSES.find((c: any) => c.name === data.class.replace(/ *\(.*\)/, ''))?.suboptions?.filter((s: any) => !s.source || activeSources.includes(s.source)).map((s: any) => (
                                                <option key={s.name} value={s.name}>{s.name} {s.source && `[${s.source}]`}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* RACE */}
                            <div>
                                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={18} color="#60a5fa" />
                                    <h3 style={{ fontWeight: 600, color: 'white' }}>Razza</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                                    {RACES.map((r: any) => (
                                        <div key={r.name} onClick={() => updateData('race', r.name)}
                                            style={{
                                                padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                                                background: data.race.includes(r.name) ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                                borderColor: data.race.includes(r.name) ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                                                color: data.race.includes(r.name) ? '#bfdbfe' : '#94a3b8',
                                                opacity: (!r.source || activeSources.includes(r.source)) ? 1 : 0.3
                                            }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                {r.name}
                                                {r.source && r.source !== 'PHB' && <span style={{ marginLeft: '4px', fontSize: '0.65rem', color: '#93c5fd', border: '1px solid #93c5fd', borderRadius: '4px', padding: '0 4px' }}>{r.source}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Subrace */}
                                {RACES.find((r: any) => r.name === data.race.split(' (')[0])?.suboptions && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <label style={labelStyle}>Sottorazza</label>
                                        <select
                                            value={data.race.includes('(') ? data.race.match(/\((.*?)\)/)?.[1] || '' : ''}
                                            onChange={(e) => {
                                                const base = data.race.split(' (')[0];
                                                const sub = e.target.value;
                                                updateData('race', sub ? `${base} (${sub})` : base);
                                            }}
                                            style={inputStyle}
                                        >
                                            <option value="">Seleziona...</option>
                                            {RACES.find((r: any) => r.name === data.race.split(' (')[0])?.suboptions?.filter((s: any) => !s.source || activeSources.includes(s.source)).map((s: any) => (
                                                <option key={s.name} value={s.name}>{s.name} {s.source && `[${s.source}]`}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div style={{ marginTop: '2rem' }}>
                                    <label style={labelStyle}>Livello Iniziale</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(lvl => (
                                            <div key={lvl} onClick={() => updateData('level', lvl)}
                                                style={{
                                                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                                                    background: data.level === lvl ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: data.level === lvl ? 'black' : '#94a3b8'
                                                }}>
                                                {lvl}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {wizardStep === 1 && <AbilityScoreStep data={data} updateData={updateData} />}
                    {wizardStep === 2 && <BackgroundStep data={data} updateData={updateData} activeSources={activeSources} />}
                    {wizardStep === 3 && <SkillsStep data={data} updateData={updateData} />}
                    {wizardStep === 4 && <AdvancedOptionsStep data={data} updateData={updateData} activeSources={activeSources} />}
                    {wizardStep === 5 && <EquipmentStep data={data} updateData={updateData} activeSources={activeSources} />}

                    {/* STEP 6: BIO & REVIEW */}
                    {wizardStep === 6 && (
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <BioStep data={data} updateData={updateData} />

                            <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                                <div style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid #7c3aed', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', display: 'inline-block', minWidth: '300px' }}>
                                    <User size={32} color="#a78bfa" style={{ marginBottom: '0.5rem' }} />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{data.characterName || 'Senza Nome'}</h3>
                                    <div style={{ color: '#a78bfa', fontSize: '0.9rem' }}>{data.race} {data.class} (Lv {data.level})</div>
                                </div>
                                <br />
                                <button onClick={onFinish} disabled={loading}
                                    style={{
                                        padding: '1rem 3rem', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', fontWeight: 700, borderRadius: '0.75rem',
                                        border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px 0 rgba(124, 58, 237, 0.5)', fontSize: '1.1rem', transition: 'all 0.2s'
                                    }}>
                                    {loading ? 'Evocazione in corso...' : 'Genera Scheda PDF'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                    {wizardStep === 0 ? <button onClick={onCancel} style={{ ...navBtnStyle, color: '#ef4444' }}>Annulla</button> : <button onClick={prev} style={navBtnStyle}>&larr; Indietro</button>}
                    {wizardStep < 6 && <button onClick={next} style={{ ...navBtnStyle, background: 'white', color: 'black' }}>Avanti &rarr;</button>}
                </div>

            </div>
        </motion.div>
    );
}

const labelStyle: React.CSSProperties = { display: 'block', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { width: '100%', background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: '#cbd5e1', outline: 'none' };
const navBtnStyle: React.CSSProperties = { padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' };
const cardStyle = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s', borderLeft: '4px solid transparent' };
const iconBoxStyle = { width: '32px', height: '32px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
