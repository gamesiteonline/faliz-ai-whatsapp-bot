import fs from 'fs';
import path from 'path';
import { UserSession } from '../types';
import logger from '../utils/logger';

export class SessionManager {
    private sessionsDir: string;

    constructor() {
        this.sessionsDir = path.join(process.cwd(), 'data', 'user_sessions');
        if (!fs.existsSync(this.sessionsDir)) {
            fs.mkdirSync(this.sessionsDir, { recursive: true });
        }
    }

    async getSession(jid: string): Promise<UserSession> {
        const filePath = path.join(this.sessionsDir, `${jid.replace(/[:@]/g, '_')}.json`);
        
        if (fs.existsSync(filePath)) {
            try {
                const data = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                logger.error({ err: error }, `Error reading session for ${jid}:`);
            }
        }

        // Return new session if not found
        return {
            jid,
            language: 'en',
            lastInteraction: Date.now(),
            conversationHistory: []
        };
    }

    async saveSession(session: UserSession): Promise<void> {
        const filePath = path.join(this.sessionsDir, `${session.jid.replace(/[:@]/g, '_')}.json`);
        try {
            // Limit history to last 10 messages to keep file size small
            if (session.conversationHistory.length > 10) {
                session.conversationHistory = session.conversationHistory.slice(-10);
            }
            session.lastInteraction = Date.now();
            fs.writeFileSync(filePath, JSON.stringify(session, null, 2));
        } catch (error) {
            logger.error({ err: error }, `Error saving session for ${session.jid}:`);
        }
    }
}
