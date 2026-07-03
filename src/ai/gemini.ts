import axios from 'axios';
import logger from '../utils/logger';

export class GeminiProvider {
    private apiKey: string;
    private apiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateResponse(prompt: string, model: string = 'gemini-1.5-flash'): Promise<string> {
        try {
            const response = await axios.post(
                `${this.apiUrl}/${model}:generateContent?key=${this.apiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                }
            );

            return response.data.candidates[0].content.parts[0].text;
        } catch (error: any) {
            const errorData = error.response?.data || error.message;
            logger.error({ err: errorData }, 'Gemini API Detailed Error:');
            throw new Error(`Gemini Error: ${error.message}`);
        }
    }

    async handleMultimodal(text: string, mediaBuffer: Buffer, mimeType: string): Promise<string> {
        // Implementation for image/audio analysis
        // This would require converting buffer to base64 and using the correct Gemini payload
        try {
            const base64Data = mediaBuffer.toString('base64');
            const response = await axios.post(
                `${this.apiUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [
                            { text: text || "What is in this image?" },
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Data
                                }
                            }
                        ]
                    }]
                }
            );
            return response.data.candidates[0].content.parts[0].text;
        } catch (error: any) {
            logger.error(`Gemini Multimodal Error: ${error.message}`);
            return "Sorry, I couldn't process that media file.";
        }
    }
}
