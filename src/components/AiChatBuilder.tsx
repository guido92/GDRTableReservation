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
        <div style={{ height: '600px', display: 'flex', flexDirection: 'column', background: '#0f172a', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1rem', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Sparkles size={20} color="#a78bfa" />
                    <h3 style={{ fontWeight: 700, color: 'white' }}>Creazione Narrativa (Beta)</h3>
                </div>
                <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Chiudi</button>
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
                                maxWidth: '80%',
                                background: m.role === 'user' ? '#4f46e5' : '#1e293b',
                                color: m.role === 'user' ? 'white' : '#cbd5e1',
                                padding: '0.75rem 1rem',
                                borderRadius: m.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                lineHeight: 1.5,
                                fontSize: '0.95rem'
                            }}
                        >
                            {m.role === 'model' && <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: '#a78bfa' }}>Dungeon Master</span>}
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

            {/* Input Area */}
            <div style={{ padding: '1rem', background: '#13141a', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Descrivi il tuo eroe..."
                    style={{ flex: 1, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
