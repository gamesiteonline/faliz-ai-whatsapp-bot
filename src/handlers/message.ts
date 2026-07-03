import { WAMessage, downloadContentFromMessage } from '@whiskeysockets/baileys';
import { CommandManager } from '../commands';
import { AIManager } from '../ai';
import { RAGManager } from '../ai/rag';
import logger from '../utils/logger';

export class MessageHandler {
    private commandManager: CommandManager;
    private aiManager: AIManager;
    private ragManager: RAGManager;

    constructor() {
        this.commandManager = new CommandManager();
        this.aiManager = new AIManager();
        this.ragManager = new RAGManager();
    }

    async handle(socket: any, msg: WAMessage) {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid) return;

        // 1. Check if it's a command
        const isCommand = await this.commandManager.handleCommand(socket, msg);
        if (isCommand) return;

        // 2. Handle as AI Conversation
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     msg.message?.imageMessage?.caption ||
                     msg.message?.videoMessage?.caption ||
                     "";

        if (!text && !msg.message?.imageMessage && !msg.message?.audioMessage) return;

        try {
            // Check RAG for context
            const context = await this.ragManager.searchKnowledgeBase(text);
            const prompt = context ? `Context:\n${context}\n\nUser Question: ${text}` : text;

            let responseText = "";

            // Handle Multimodal (Images)
            if (msg.message?.imageMessage) {
                const stream = await downloadContentFromMessage(msg.message.imageMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                
                responseText = await this.aiManager.getResponse(text, { 
                    media: { buffer, mimeType: msg.message.imageMessage.mimetype || 'image/jpeg' } 
                });
            } else {
                // Regular Text Response
                responseText = await this.aiManager.getResponse(prompt);
            }

            await socket.sendMessage(remoteJid, { text: responseText }, { quoted: msg });
        } catch (error) {
            logger.error('Message Handling Error:', error);
            await socket.sendMessage(remoteJid, { text: "I'm having trouble processing your request right now." });
        }
    }
}
