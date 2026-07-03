import { GeminiProvider } from './gemini';
import { DeepSeekProvider } from './deepseek';
import logger from '../utils/logger';

export class AIManager {
    private gemini?: GeminiProvider;
    private deepseek?: DeepSeekProvider;
    private defaultProvider: string;

    constructor() {
        this.defaultProvider = process.env.DEFAULT_AI_PROVIDER || 'gemini';
        
        if (process.env.GEMINI_API_KEY) {
            this.gemini = new GeminiProvider(process.env.GEMINI_API_KEY);
        }
        
        if (process.env.DEEPSEEK_API_KEY) {
            this.deepseek = new DeepSeekProvider(process.env.DEEPSEEK_API_KEY);
        }
    }

    async getResponse(prompt: string, options: { provider?: string, media?: { buffer: Buffer, mimeType: string } } = {}): Promise<string> {
        const provider = options.provider || this.defaultProvider;

        if (options.media && this.gemini) {
            // Default to Gemini for multimodal
            return await this.gemini.handleMultimodal(prompt, options.media.buffer, options.media.mimeType);
        }

        try {
            if (provider === 'deepseek' && this.deepseek) {
                return await this.deepseek.generateResponse(prompt);
            } else if (this.gemini) {
                return await this.gemini.generateResponse(prompt);
            }
        } catch (error) {
            logger.error({ err: error }, `Primary provider ${provider} failed, trying fallback...`);
            
            // Fallback logic
            if (provider === 'gemini' && this.deepseek) {
                return await this.deepseek.generateResponse(prompt);
            } else if (provider === 'deepseek' && this.gemini) {
                return await this.gemini.generateResponse(prompt);
            }
        }

        return "AI services are currently unavailable or hit an error. Please check logs.";
    }
}
