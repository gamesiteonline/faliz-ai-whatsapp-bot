import { Command } from '../index';

export const pingCommand: Command = {
    name: 'ping',
    description: 'Check if the bot is alive',
    execute: async ({ socket, remoteJid }) => {
        const start = Date.now();
        await socket.sendMessage(remoteJid, { text: 'Pinging...' });
        const latency = Date.now() - start;
        await socket.sendMessage(remoteJid, { text: `Pong! 🏓\nLatency: ${latency}ms\nFALIZ AI is active.` });
    }
};
