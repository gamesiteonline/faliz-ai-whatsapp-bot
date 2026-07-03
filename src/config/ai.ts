export const aiConfig = {
    gemini: {
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
        maxTokens: 2048,
        temperature: 0.7,
    },
    deepseek: {
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        temperature: 0.7,
    }
};
