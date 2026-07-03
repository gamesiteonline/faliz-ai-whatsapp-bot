import axios from 'axios';
import logger from '../utils/logger';

export class DeepSeekProvider {
    private apiKey: string;
    private apiUrl: string = 'https://api.deepseek.com/v1/chat/completions';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateResponse(prompt: string, history: any[] = []): Promise<string> {
        try {
            const messages = [
                { role: 'system', content: `You are FALIZ AI, a helpful and professional WhatsApp assistant. Tone: ${process.env.BOT_TONE || 'helpful'}.` },
                ...history,
                { role: 'user', content: prompt }
            ];

            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'deepseek-chat',
                    messages: messages,
                    temperature: 0.7
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error: any) {
            logger.error(`DeepSeek API Error: ${error.message}`);
            throw new Error('Failed to generate response from DeepSeek');
        }
    }
}
