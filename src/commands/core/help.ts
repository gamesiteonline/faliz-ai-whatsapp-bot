import { Command, CommandContext } from '../index';

export const helpCommand: Command = {
    name: 'help',
    description: 'Show available commands',
    execute: async ({ socket, remoteJid }) => {
        const helpText = `
*FALIZ AI - Help Menu*

Available Commands:
• *!help*: Show this menu
• *!ping*: Check bot status
• *!ai*: Show AI provider info
• *!stats*: Bot usage statistics
• *!owner*: Contact information

_Tip: You can also just talk to me normally!_
        `.trim();
        await socket.sendMessage(remoteJid, { text: helpText });
    }
};
