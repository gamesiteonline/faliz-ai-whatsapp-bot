import 'dotenv/config';

export const config = {
    whatsapp: {
        sessionName: process.env.WHATSAPP_SESSION_NAME || 'faliz-ai-session',
        browser: ['FALIZ AI', 'Chrome', '1.0.0'] as [string, string, string],
    },
    ai: {
        defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'gemini',
        gemini: {
            apiKey: process.env.GEMINI_API_KEY,
            model: 'gemini-1.5-flash',
        },
        deepseek: {
            apiKey: process.env.DEEPSEEK_API_KEY,
            model: 'deepseek-chat',
        },
        persona: {
            name: process.env.BOT_NAME || 'FALIZ AI',
            tone: process.env.BOT_TONE || 'helpful, professional, and friendly',
        }
    },
    languages: {
        default: 'en',
        supported: ['en', 'id', 'es', 'pt', 'ar'],
    }
};

export default config;
