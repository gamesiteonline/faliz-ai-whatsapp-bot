import 'dotenv/config';
import { WhatsAppConnector } from './connectors/whatsapp';
import { MessageHandler } from './handlers/message';
import logger from './utils/logger';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('FALIZ AI is running!');
});

app.listen(port, () => {
    logger.info(`Web server is listening on port ${port}`);
});

async function startBot() {
    try {
        logger.info('Starting FALIZ AI WhatsApp Bot...');
        
        const connector = new WhatsAppConnector(process.env.WHATSAPP_SESSION_NAME || 'faliz-ai');
        const socket = await connector.connect();
        const messageHandler = new MessageHandler();

        // Listen for messages
        socket.ev.on('messages.upsert', async (m: any) => {
            if (m.type === 'notify') {
                for (const msg of m.messages) {
                    if (!msg.key.fromMe && msg.message) {
                        logger.info(`Processing message from ${msg.key.remoteJid}`);
                        await messageHandler.handle(socket, msg);
                    }
                }
            }
        });

        // Handle Group Events (Example)
        socket.ev.on('group-participants.update', async (update: any) => {
            const { id, participants, action } = update;
            logger.info(`Group event: ${action} for participants ${participants} in ${id}`);
            
            if (action === 'add') {
                await socket.sendMessage(id, { text: 'Welcome to the group! I am FALIZ AI, your assistant.' });
            }
        });

    } catch (error) {
        logger.error({ err: error }, 'Failed to start FALIZ AI:');
        process.exit(1);
    }
}

startBot();
