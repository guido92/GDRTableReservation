import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Sparkles, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiChatBuilderProps {
    onFinish: (data: any) => void;
    onCancel: () => void;
}

export default function AiChatBuilder({ onFinish, onCancel }: AiChatBuilderProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: "Benvenuto nella Tana del Destino. Sono il tuo Dungeon Master. Dimmi, quale eroe vuoi forgiare oggi? Descrivimelo pure a parole tue..." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            // Convert history for API (map 'model' to 'model', 'user' to 'user')
            // Gemini API expects 'parts' array
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const response = await fetch('/api/dnd/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history, message: userMsg })
            });

            if (!response.ok) throw new Error("Connection lost with the ethereal plane.");

            const data = await response.json();
            const aiText = data.response;

            // Check for JSON block
            const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/);

            setMessages(prev => [...prev, { role: 'model', text: aiText.replace(/```json[\s\S]*```/, '') }]); // Hide JSON from chat

            if (jsonMatch) {
                try {
                    const charData = JSON.parse(jsonMatch[1]);
                    // Auto-finish if valid JSON found
                    onFinish(charData);
                } catch (e) {
                    console.error("Failed to parse magic rune:", e);
                }
            }

        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: "Hmm... lo spirito è confuso. Riprova." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--brand-gold)' }}>
            {/* Header */}
            <div style={{ padding: '1.25rem', background: 'rgba(207, 170, 67, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Sparkles size={20} className="gold-text" />
                    <h3 className="gold-text" style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Creazione Narrativa</h3>
                </div>
                <button onClick={onCancel} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>Chiudi</button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                background: m.role === 'user' ? 'rgba(207, 170, 67, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid',
                                borderColor: m.role === 'user' ? 'var(--brand-gold)' : 'var(--glass-border)',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: m.role === 'user' ? '1.25rem 1.25rem 0 1.25rem' : '1.25rem 1.25rem 1.25rem 0',
                                lineHeight: 1.6,
                                fontSize: '0.95rem',
                                boxShadow: 'var(--glass-shadow)'
                            }}
                        >
                            {m.role === 'model' && <span className="gold-text" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Dungeon Master</span>}
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '0.5rem' }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ margin: 0, paddingLeft: '1.2rem', marginBottom: '0.5rem' }} {...props} />,
                                    li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                                    strong: ({ node, ...props }) => <strong style={{ color: m.role === 'model' ? '#e9d5ff' : 'white' }} {...props} />
                                }}
                            >
                                {m.text}
                            </ReactMarkdown>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic', marginLeft: '1rem' }}>
                            Il maestro sta scrivendo...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(20, 15, 12, 0.8)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Descrivi il tuo eroe al DM..."
                    style={{ 
                        flex: 1, 
                        background: 'rgba(0, 0, 0, 0.3)', 
                        border: '1px solid var(--border)', 
                        padding: '0.875rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        color: 'white', 
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="btn-primary"
                    style={{ 
                        width: '56px', 
                        height: '48px', 
                        padding: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        opacity: (loading || !input.trim()) ? 0.5 : 1 
                    }}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
