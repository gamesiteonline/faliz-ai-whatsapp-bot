import { WAMessage } from '@whiskeysockets/baileys';
import logger from '../utils/logger';
import { helpCommand } from './core/help';
import { pingCommand } from './core/ping';

export interface CommandContext {
    socket: any;
    msg: WAMessage;
    args: string[];
    remoteJid: string;
}

export interface Command {
    name: string;
    description: string;
    execute: (ctx: CommandContext) => Promise<void>;
}

export class CommandManager {
    private commands: Map<string, Command> = new Map();
    private prefix: string = '!';

    constructor() {
        this.loadCommands();
    }

    private loadCommands() {
        this.commands.set(helpCommand.name, helpCommand);
        this.commands.set(pingCommand.name, pingCommand);
        
        // Add AI Info Command inline for simplicity or create a file
        this.commands.set('ai', {
            name: 'ai',
            description: 'Get information about the current AI provider',
            execute: async ({ socket, remoteJid }) => {
                const provider = process.env.DEFAULT_AI_PROVIDER || 'gemini';
                await socket.sendMessage(remoteJid, { text: `Currently using *${provider.toUpperCase()}* as the primary AI engine.` });
            }
        });
    }

    async handleCommand(socket: any, msg: WAMessage) {
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     "";

        if (!text.startsWith(this.prefix)) return false;

        const args = text.slice(this.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (commandName && this.commands.has(commandName)) {
            const command = this.commands.get(commandName)!;
            const remoteJid = msg.key.remoteJid!;
            
            try {
                await command.execute({ socket, msg, args, remoteJid });
                return true;
            } catch (error) {
                logger.error(`Error executing command ${commandName}:`, error);
                await socket.sendMessage(remoteJid, { text: '❌ An error occurred while executing that command.' });
                return true;
            }
        }

        return false;
    }
}
