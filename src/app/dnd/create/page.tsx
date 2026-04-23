'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scroll, User, Dices, ChevronRight, MessageSquare } from 'lucide-react';
import { BACKGROUNDS, ALIGNMENTS, SOURCES_CONFIG, Source, Option } from '@/data/dnd-data';
import { CharacterData } from '@/types/dnd';
import AiChatBuilder from '@/components/AiChatBuilder';
import Navbar from '@/components/Navbar';

// Types for dynamic data
interface DynamicClass {
    name: string;
    nameEn: string;
    hitDie: number;
    source?: string;
    subclasses: { name: string; nameEn: string; source?: string }[];
}

interface DynamicRace {
    name: string;
    nameEn: string;
    speed: number;
    source?: string;
    abilityBonuses: Record<string, number>;
    subraces: { name: string; nameEn: string; abilityBonuses: Record<string, number>; source?: string }[];
}

const INITIAL_DATA: CharacterData = {
    characterName: '',
    playerName: '',
    race: 'Umano',
    class: 'Guerriero',
    level: 1,
    background: 'Soldato',
    backgroundSkills: ['Atletica', 'Intimidire'],
    backgroundTools: ['Veicoli (Terrestri)', 'Un set da gioco'],
    alignment: 'Neutrale',
    abilities: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
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
    sources: ['PHB24', 'TCE', 'XGE'],
};

export default function CharactermancerV2() {
    const [step, setStep] = useState(0); // 0 = Intro/QuickBuild choice
    const [data, setData] = useState<CharacterData>(INITIAL_DATA);
    const [loading, setLoading] = useState(false);
    const [activeSources, setActiveSources] = useState<Source[]>(['PHB24', 'TCE', 'XGE']);

    // Dynamic data state
    const [classes, setClasses] = useState<DynamicClass[]>([]);
    const [races, setRaces] = useState<DynamicRace[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Fetch classes and races on mount and when sources change
    useEffect(() => {
        async function fetchData() {
            setDataLoading(true);
            try {
                const sourcesParam = activeSources.join(',');
                const [classesRes, racesRes] = await Promise.all([
                    fetch(`/api/dnd/classes?sources=${sourcesParam}`),
                    fetch(`/api/dnd/races?sources=${sourcesParam}`)
                ]);

                if (classesRes.ok) {
                    const classesData = await classesRes.json();
                    setClasses(classesData.classes || []);
                }

                if (racesRes.ok) {
                    const racesData = await racesRes.json();
                    setRaces(racesData.races || []);
                }
            } catch (error) {
                console.error('Failed to fetch D&D data:', error);
            } finally {
                setDataLoading(false);
            }
        }
        fetchData();
    }, [activeSources]);

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
            // Server handles AI generation, validation, hydration, and fallback
            const response = await fetch('/api/dnd/ai-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, sourceFilter: activeSources })
            });

            if (!response.ok) {
                throw new Error('Generazione fallita.');
            }

            const charData = await response.json();
            setData(charData);
            generatePDF(charData);

        } catch (error) {
            console.error(error);
            alert("Errore nella generazione del personaggio.");
            setLoading(false);
        }
    };

    // Manual Build Finalizer (Deterministic)
    const finishManualBuild = async () => {
        setLoading(true);
        try {
            // Server-side hydration ensures official features/stats accuracy
            const response = await fetch('/api/dnd/hydrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Hydration failed');

            const finalData = await response.json();
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

    // Styles (Updated to Bar Dama Theme)
    const cardStyle: React.CSSProperties = {
        background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
        padding: '2rem', cursor: 'pointer', transition: 'all 0.3s ease',
        position: 'relative', overflow: 'hidden', boxShadow: 'var(--glass-shadow)'
    };
    const headerStyle: React.CSSProperties = {
        marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem'
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <div className="container" style={{ padding: '4rem 1rem', flex: 1 }}>
                {/* Header */}
                <header style={{ 
                    marginBottom: '3rem', 
                    borderBottom: '1px solid var(--border)', 
                    paddingBottom: '1.5rem',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '1.5rem' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(207, 170, 67, 0.1)', borderRadius: '0.75rem', border: '1px solid var(--brand-gold)', display: 'flex' }}>
                            <Sparkles size={24} className="gold-text" />
                        </div>
                        <div>
                            <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>
                                Crea la tua Scheda
                            </h1>
                            <p style={{ fontSize: '0.75rem', color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0.25rem 0 0', fontWeight: 700 }}>Forgia il tuo destino</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {SOURCES_CONFIG.map(src => (
                            <button
                                key={src.id}
                                onClick={() => toggleSource(src.id)}
                                style={{
                                    padding: '0.4rem 1rem', 
                                    fontSize: '0.7rem', 
                                    fontWeight: 700, 
                                    borderRadius: '4px',
                                    border: '1px solid', 
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: activeSources.includes(src.id) ? 'rgba(207, 170, 67, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                    borderColor: activeSources.includes(src.id) ? 'var(--brand-gold)' : 'rgba(255, 255, 255, 0.1)',
                                    color: activeSources.includes(src.id) ? 'white' : 'rgba(255, 255, 255, 0.4)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                {src.name}
                            </button>
                        ))}
                    </div>
                </header>

                <AnimatePresence mode="wait">

                    {/* SELEZIONE INIZIALE (Home) */}
                    {step === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}
                            >
                                {/* Manual Mode */}
                                <div
                                    onClick={() => setStep(1)}
                                    className="glass-panel"
                                    style={{ padding: '2.5rem', cursor: 'pointer' }}
                                >
                                    <div style={{ marginBottom: '1.5rem', width: '56px', height: '56px', background: 'rgba(207, 170, 67, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(207, 170, 67, 0.2)' }}>
                                        <User size={28} className="gold-text" />
                                    </div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>Creazione Guidata</h2>
                                    <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>Scegli Razza, Classe e Background passo dopo passo. L&apos;AI penserà ai dettagli narrativi.</p>
                                    <div className="gold-text" style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                        Inizia il Rituale <ChevronRight size={16} style={{ marginLeft: '0.5rem' }} />
                                    </div>
                                </div>

                                {/* Chat Mode */}
                                <div
                                    onClick={() => setStep(2)}
                                    className="glass-panel"
                                    style={{ padding: '2.5rem', cursor: 'pointer' }}
                                >
                                    <div style={{ marginBottom: '1.5rem', width: '56px', height: '56px', background: 'rgba(207, 170, 67, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(207, 170, 67, 0.2)' }}>
                                        <MessageSquare size={28} className="gold-text" />
                                    </div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>Creazione Narrativa</h2>
                                    <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>Parla con il Dungeon Master AI. Descrivi il tuo eroe a parole tue e lascialo prendere vita.</p>
                                    <div className="gold-text" style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                        Entra nella Tana <ChevronRight size={16} style={{ marginLeft: '0.5rem' }} />
                                    </div>
                                </div>

                                {/* Quick Build */}
                                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                                    <div style={{ marginBottom: '1.5rem', width: '56px', height: '56px', background: 'rgba(207, 170, 67, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(207, 170, 67, 0.2)' }}>
                                        <Dices size={28} className="gold-text" />
                                    </div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>Evocazione Rapida</h2>
                                    <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>Generazione istantanea basata sul livello. Ideale per NPC o personaggi d&apos;emergenza.</p>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Scegli il Livello</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {[1, 3, 5, 10].map(lvl => (
                                                <button
                                                    key={lvl}
                                                    disabled={loading}
                                                    onClick={() => quickBuild(lvl)}
                                                    className="btn-secondary"
                                                    style={{
                                                        flex: 1, padding: '0.6rem', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Lv {lvl}
                                                </button>
                                            ))}
                                        </div>
                                        {loading && <div className="gold-text" style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '1rem', animation: 'pulse 2s infinite', fontWeight: 600 }}>Evocazione dello spirito (AI) in corso...</div>}
                                    </div>
                                </div>
                            </motion.div>

                            {/* TOOL EXPLANATION SECTION */}
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                transition={{ delay: 0.5 }}
                                className="glass-panel" 
                                style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '3rem' }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
                                    <div>
                                        <h3 className="gold-text" style={{ fontSize: '1.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Sparkles size={20} /> Cervello Artificiale
                                        </h3>
                                        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 300 }}>
                                            Utilizziamo l&apos;intelligenza artificiale di <strong>Google Gemini</strong> per interpretare le tue idee. Non si limita a generare dati casuali: crea backstory profonde e personalità uniche che si integrano nel mondo di gioco.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="gold-text" style={{ fontSize: '1.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Scroll size={20} /> Regole Ufficiali
                                        </h3>
                                        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 300 }}>
                                            Sotto il cofano, il motore carica database estesi (5etools) per garantire che ogni talento, incantesimo o privilegio sia fedele al manuale. Il sistema valida ogni statistica per assicurare un personaggio bilanciato.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="gold-text" style={{ fontSize: '1.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Scroll size={20} /> Pipeline PDF
                                        </h3>
                                        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 300 }}>
                                            Una volta completato il "rituale", il sistema esegue una scansione finale dei dati, corregge automaticamente eventuali mancanze (DataFixer) e produce una scheda PDF pronta per la stampa o l&apos;uso digitale.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
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
                            classes={classes}
                            races={races}
                            dataLoading={dataLoading}
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
                                onFinish={async (aiData) => {
                                    setLoading(true);
                                    try {
                                        const response = await fetch('/api/dnd/hydrate', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(aiData),
                                        });
                                        if (!response.ok) throw new Error('Hydration failed');
                                        const finalData = await response.json();
                                        setData(finalData);
                                        await generatePDF(finalData);
                                    } catch (e) {
                                        console.error(e);
                                        // Fallback: use raw AI data if hydration fails
                                        setData(aiData);
                                        await generatePDF(aiData);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>
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
function WizardFlow({ data, updateData, activeSources, filterOptions, onCancel, onFinish, loading, classes, races, dataLoading }: any) {
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative', padding: '0 1rem' }}>
                <div style={{ position: 'absolute', top: '25%', left: '2rem', right: '2rem', height: '1px', background: 'var(--border)', zIndex: 0 }} />
                {steps.map((s, i) => (
                    <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: i <= wizardStep ? 'var(--brand-gold)' : 'var(--background)',
                            border: '1px solid var(--brand-gold)',
                            boxShadow: i === wizardStep ? '0 0 15px var(--brand-gold-glow)' : '',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontWeight: 800, fontSize: '0.8rem', color: i <= wizardStep ? 'black' : 'var(--brand-gold)',
                            transition: 'all 0.3s ease'
                        }}>
                            {i + 1}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: i <= wizardStep ? 'white' : 'var(--foreground-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.title}</div>
                    </div>
                ))}
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '550px', display: 'flex', flexDirection: 'column' }}>

                <h2 className="text-gradient" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {steps[wizardStep].title}
                </h2>
                <p style={{ color: 'var(--foreground-muted)', marginBottom: '2.5rem', fontWeight: 300 }}>{steps[wizardStep].subtitle}</p>

                <div style={{ flex: 1 }}>
                    {/* STEP 0: CLASS & RACE */}
                    {wizardStep === 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* CLASS */}
                            <div>
                                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={18} color="#f87171" />
                                    <h3 style={{ fontWeight: 700, color: 'white', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Classe ({dataLoading ? '...' : classes.length})</h3>
                                </div>
                                {dataLoading ? (
                                    <div style={{ color: 'var(--brand-gold)', padding: '2rem', textAlign: 'center', animation: 'pulse 2s infinite' }}>Canalizzazione dei poteri (classi)...</div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                        {classes.map((c: DynamicClass) => (
                                            <div key={c.name} onClick={() => {
                                                updateData('class', c.name);
                                                // Update Hit Die
                                                const hd = c.hitDie ? `d${c.hitDie}` : 'd8';
                                                updateData('hitDice', { total: data.level, die: hd });
                                            }}
                                                className="glass-panel"
                                                style={{
                                                    padding: '0.8rem', cursor: 'pointer', textAlign: 'center',
                                                    background: data.class.includes(c.name) ? 'rgba(207, 170, 67, 0.15)' : '',
                                                    borderColor: data.class.includes(c.name) ? 'var(--brand-gold)' : '',
                                                    color: data.class.includes(c.name) ? 'white' : 'var(--foreground-muted)'
                                                }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                                    {c.name}
                                                </div>
                                                {c.source && (
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--brand-gold)', opacity: 0.7, marginTop: '2px' }}>
                                                        {c.source === 'PHB' ? 'Ed. 5.0 (2014)' : c.source === 'PHB24' || c.source === 'XPHB' ? 'Ed. 5.5 (2024)' : c.source}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Subclass */}
                                {classes.find((c: DynamicClass) => c.name === data.class.replace(/ *\(.*\)/, ''))?.subclasses?.length > 0 && (
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
                                            {classes.find((c: DynamicClass) => c.name === data.class.replace(/ *\(.*\)/, ''))?.subclasses?.map((s: { name: string; nameEn: string; source?: string }) => (
                                                <option key={s.name} value={s.name}>
                                                    {s.name} {s.source === 'PHB' ? '(5.0)' : s.source === 'PHB24' || s.source === 'XPHB' ? '(5.5)' : `(${s.source})`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* RACE */}
                            <div>
                                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={18} color="#60a5fa" />
                                    <h3 style={{ fontWeight: 700, color: 'white', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Razza ({dataLoading ? '...' : races.length})</h3>
                                </div>
                                {dataLoading ? (
                                    <div style={{ color: 'var(--brand-gold)', padding: '2rem', textAlign: 'center', animation: 'pulse 2s infinite' }}>Evochiamo gli antenati (razze)...</div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                        {races.map((r: DynamicRace) => (
                                            <div key={r.name} onClick={() => updateData('race', r.name)}
                                                className="glass-panel"
                                                style={{
                                                    padding: '0.8rem', cursor: 'pointer', textAlign: 'center',
                                                    background: data.race.includes(r.name) ? 'rgba(207, 170, 67, 0.15)' : '',
                                                    borderColor: data.race.includes(r.name) ? 'var(--brand-gold)' : '',
                                                    color: data.race.includes(r.name) ? 'white' : 'var(--foreground-muted)'
                                                }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                                    {r.name}
                                                </div>
                                                {r.source && (
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--brand-gold)', opacity: 0.7, marginTop: '2px' }}>
                                                        {r.source === 'PHB' ? 'Ed. 5.0 (2014)' : r.source === 'PHB24' || r.source === 'XPHB' ? 'Ed. 5.5 (2024)' : r.source}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Subrace */}
                                {races.find((r: DynamicRace) => r.name === data.race.split(' (')[0])?.subraces?.length > 0 && (
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
                                            {races.find((r: DynamicRace) => r.name === data.race.split(' (')[0])?.subraces?.map((s: { name: string; nameEn: string; abilityBonuses: Record<string, number>; source?: string }) => (
                                                <option key={s.name} value={s.name}>
                                                    {s.name} {s.source === 'PHB' ? '(5.0)' : s.source === 'PHB24' || s.source === 'XPHB' ? '(5.5)' : `(${s.source})`}
                                                </option>
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
                                                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem',
                                                    background: data.level === lvl ? 'var(--brand-gold)' : 'rgba(255,255,255,0.05)', 
                                                    color: data.level === lvl ? 'black' : 'var(--foreground-muted)',
                                                    border: '1px solid', borderColor: data.level === lvl ? 'var(--brand-gold)' : 'rgba(255,255,255,0.05)',
                                                    transition: 'all 0.2s'
                                                }}>
                                                {lvl}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {wizardStep === 1 && <AbilityScoreStep data={data} updateData={updateData} races={races} classes={classes} />}
                    {wizardStep === 2 && <BackgroundStep data={data} updateData={updateData} activeSources={activeSources} />}
                    {wizardStep === 3 && <SkillsStep data={data} updateData={updateData} classes={classes} />}
                    {wizardStep === 4 && <AdvancedOptionsStep data={data} updateData={updateData} activeSources={activeSources} classes={classes} />}
                    {wizardStep === 5 && <EquipmentStep data={data} updateData={updateData} activeSources={activeSources} classes={classes} />}

                    {/* STEP 6: BIO & REVIEW */}
                    {wizardStep === 6 && (
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <BioStep data={data} updateData={updateData} />

                            <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
                                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', minWidth: '320px', border: '1px solid var(--brand-gold)' }}>
                                    <div style={{ width: '64px', height: '64px', background: 'rgba(207, 170, 67, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--brand-gold)' }}>
                                        <User size={32} className="gold-text" />
                                    </div>
                                    <div>
                                        <h3 className="gold-text" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{data.characterName || 'Senza Nome'}</h3>
                                        <div style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.25rem' }}>{data.race} {data.class} (Livello {data.level})</div>
                                    </div>
                                </div>
                                <br />
                                <button onClick={onFinish} disabled={loading} className="btn-primary" style={{ padding: '1rem 4rem', fontSize: '1.1rem' }}>
                                    {loading ? 'Invocazione Finali...' : 'Concludi il Rituale'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: 'auto' }}>
                    {wizardStep === 0 ? <button onClick={onCancel} className="btn-secondary" style={{ color: '#ff6b6b' }}>Annulla</button> : <button onClick={prev} className="btn-secondary">&larr; Indietro</button>}
                    {wizardStep < 6 && <button onClick={next} className="btn-primary">Avanti &rarr;</button>}
                </div>

            </div>
        </motion.div>
    );
}

const labelStyle: React.CSSProperties = { display: 'block', color: 'var(--brand-gold)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(20, 15, 12, 0.5)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--foreground)', outline: 'none' };
const navBtnStyle: React.CSSProperties = { padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' };
const cardStyle = { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' };
const iconBoxStyle = { width: '32px', height: '32px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
