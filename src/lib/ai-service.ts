/**
 * Centralized AI Service with cascading fallback providers.
 * 
 * Provider priority:
 * 1. Gemini (Google) - Primary
 * 2. Mistral - First fallback
 * 3. Groq - Second fallback
 * 
 * Each provider is tried in sequence. If one fails with a retryable error
 * (429, 503, network error), the next provider is attempted.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Provider Configuration ────────────────────────────────────────

interface AIProvider {
    name: string;
    available: boolean;
    generate: (prompt: string, jsonMode?: boolean) => Promise<string>;
    chat: (systemPrompt: string, history: ChatMessage[], message: string) => Promise<string>;
}

interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

// ─── Gemini Provider (internal model cascade) ──────────────────────

// Models ordered from most powerful to lightest
const GEMINI_MODELS = [
    'gemini-3-flash-preview',      // Most powerful (Preview)
    'gemini-2.5-flash',            // Stable production
    'gemini-2.5-flash-lite',       // Budget fallback
];

function createGeminiProvider(): AIProvider {
    const apiKey = process.env.GEMINI_API_KEY || '';
    const available = !!apiKey;

    const generate = async (prompt: string, jsonMode: boolean = false): Promise<string> => {
        const genAI = new GoogleGenerativeAI(apiKey);
        let lastError: any;

        for (const modelName of GEMINI_MODELS) {
            try {
                console.log(`[Gemini] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
                        maxOutputTokens: 8192,
                    }
                });
                const result = await model.generateContent(prompt);
                console.log(`[Gemini] ✅ ${modelName} succeeded`);
                return result.response.text();
            } catch (error: any) {
                console.warn(`[Gemini] ❌ ${modelName} failed: ${error.message?.substring(0, 150)}`);
                lastError = error;
            }
        }
        throw lastError;
    };

    const chat = async (systemPrompt: string, history: ChatMessage[], message: string): Promise<string> => {
        const genAI = new GoogleGenerativeAI(apiKey);
        let lastError: any;

        for (const modelName of GEMINI_MODELS) {
            try {
                console.log(`[Gemini] Trying chat model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: {
                        role: 'system',
                        parts: [{ text: systemPrompt }]
                    }
                });
                const chatSession = model.startChat({
                    history,
                    generationConfig: { maxOutputTokens: 8192 },
                });
                const result = await chatSession.sendMessage(message);
                console.log(`[Gemini] ✅ ${modelName} chat succeeded`);
                return result.response.text();
            } catch (error: any) {
                console.warn(`[Gemini] ❌ ${modelName} chat failed: ${error.message?.substring(0, 150)}`);
                lastError = error;
            }
        }
        throw lastError;
    };

    return { name: 'Gemini', available, generate, chat };
}

// ─── Mistral Provider ───────────────────────────────────────────────

function createMistralProvider(): AIProvider {
    const apiKey = process.env.MISTRAL_API_KEY || '';
    const available = !!apiKey;

    const callMistral = async (messages: { role: string; content: string }[], jsonMode: boolean = false): Promise<string> => {
        const body: any = {
            model: 'mistral-small-latest',
            messages,
            max_tokens: 8192,
        };
        if (jsonMode) {
            body.response_format = { type: 'json_object' };
        }

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Mistral API Error [${response.status}]: ${errorText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    };

    const generate = async (prompt: string, jsonMode: boolean = false): Promise<string> => {
        return callMistral([{ role: 'user', content: prompt }], jsonMode);
    };

    const chat = async (systemPrompt: string, history: ChatMessage[], message: string): Promise<string> => {
        // Convert Gemini-style history to OpenAI-style messages
        const messages: { role: string; content: string }[] = [
            { role: 'system', content: systemPrompt }
        ];

        for (const msg of history) {
            messages.push({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.parts.map(p => p.text).join('\n'),
            });
        }

        messages.push({ role: 'user', content: message });

        return callMistral(messages, false);
    };

    return { name: 'Mistral', available, generate, chat };
}

// ─── Groq Provider ──────────────────────────────────────────────────

function createGroqProvider(): AIProvider {
    const apiKey = process.env.GROQ_API_KEY || '';
    const available = !!apiKey;

    const callGroq = async (messages: { role: string; content: string }[], jsonMode: boolean = false): Promise<string> => {
        const body: any = {
            model: 'llama-3.3-70b-versatile',
            messages,
            max_tokens: 8192,
        };
        if (jsonMode) {
            body.response_format = { type: 'json_object' };
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq API Error [${response.status}]: ${errorText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    };

    const generate = async (prompt: string, jsonMode: boolean = false): Promise<string> => {
        return callGroq([{ role: 'user', content: prompt }], jsonMode);
    };

    const chat = async (systemPrompt: string, history: ChatMessage[], message: string): Promise<string> => {
        const messages: { role: string; content: string }[] = [
            { role: 'system', content: systemPrompt }
        ];

        for (const msg of history) {
            messages.push({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.parts.map(p => p.text).join('\n'),
            });
        }

        messages.push({ role: 'user', content: message });

        return callGroq(messages, false);
    };

    return { name: 'Groq', available, generate, chat };
}

// ─── Cascading AI Service ───────────────────────────────────────────

function isRetryableError(error: any): boolean {
    const msg = error?.message || '';
    return (
        msg.includes('429') ||
        msg.includes('503') ||
        msg.includes('Too Many Requests') ||
        msg.includes('Service Unavailable') ||
        msg.includes('quota') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('high demand') ||
        msg.includes('rate limit') ||
        msg.includes('fetch')
    );
}

export class AIService {
    private providers: AIProvider[];

    constructor() {
        this.providers = [
            createGeminiProvider(),
            createMistralProvider(),
            createGroqProvider(),
        ].filter(p => p.available);

        if (this.providers.length === 0) {
            console.error('[AIService] No AI providers configured! Set at least one of: GEMINI_API_KEY, MISTRAL_API_KEY, GROQ_API_KEY');
        } else {
            console.log(`[AIService] Providers available: ${this.providers.map(p => p.name).join(' → ')}`);
        }
    }

    /**
     * Generate content with cascading fallback across providers.
     * @param prompt The prompt to send
     * @param jsonMode Whether to request JSON-formatted output
     * @returns The generated text
     */
    async generate(prompt: string, jsonMode: boolean = false): Promise<string> {
        if (this.providers.length === 0) {
            throw new Error('No AI providers configured');
        }

        let lastError: any;

        for (const provider of this.providers) {
            try {
                console.log(`[AIService] Trying ${provider.name} for generation...`);
                const result = await provider.generate(prompt, jsonMode);
                console.log(`[AIService] ✅ ${provider.name} succeeded`);
                return result;
            } catch (error: any) {
                console.error(`[AIService] ❌ ${provider.name} failed:`, error.message?.substring(0, 200));
                lastError = error;

                if (!isRetryableError(error)) {
                    // Non-retryable error (e.g., bad prompt, auth error) — still try next provider
                    console.warn(`[AIService] Non-retryable error from ${provider.name}, trying next provider...`);
                }
            }
        }

        throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
    }

    /**
     * Chat with cascading fallback across providers.
     * @param systemPrompt System instruction for the AI
     * @param history Previous chat messages in Gemini format
     * @param message The new user message
     * @returns The AI response text
     */
    async chat(systemPrompt: string, history: ChatMessage[], message: string): Promise<string> {
        if (this.providers.length === 0) {
            throw new Error('No AI providers configured');
        }

        let lastError: any;

        for (const provider of this.providers) {
            try {
                console.log(`[AIService] Trying ${provider.name} for chat...`);
                const result = await provider.chat(systemPrompt, history, message);
                console.log(`[AIService] ✅ ${provider.name} chat succeeded`);
                return result;
            } catch (error: any) {
                console.error(`[AIService] ❌ ${provider.name} chat failed:`, error.message?.substring(0, 200));
                lastError = error;
            }
        }

        throw new Error(`All AI providers failed for chat. Last error: ${lastError?.message}`);
    }
}

// Singleton instance
let _instance: AIService | null = null;
export function getAIService(): AIService {
    if (!_instance) {
        _instance = new AIService();
    }
    return _instance;
}
