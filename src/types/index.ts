import { WAMessage } from '@whiskeysockets/baileys';

export interface UserSession {
    jid: string;
    name?: string;
    language: string;
    lastInteraction: number;
    conversationHistory: MessageHistory[];
}

export interface MessageHistory {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface AIResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface BotConfig {
    name: string;
    prefix: string;
    ownerNumber: string;
}
