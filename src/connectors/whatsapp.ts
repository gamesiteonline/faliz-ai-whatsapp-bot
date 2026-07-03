import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import qrcode from 'qrcode-terminal';
import logger from '../utils/logger';

export class WhatsAppConnector {
    private sessionName: string;
    private statePath: string;
    public socket: any;

    constructor(sessionName: string = 'faliz-session') {
        this.sessionName = sessionName;
        this.statePath = path.join(process.cwd(), 'data', 'sessions', this.sessionName);
        
        if (!fs.existsSync(path.join(process.cwd(), 'data', 'sessions'))) {
            fs.mkdirSync(path.join(process.cwd(), 'data', 'sessions'), { recursive: true });
        }
    }

    async connect() {
        const { state, saveCreds } = await useMultiFileAuthState(this.statePath);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        
        logger.info(`Using WhatsApp v${version.join('.')}, isLatest: ${isLatest}`);

        this.socket = makeWASocket({
            version,
            printQRInTerminal: true,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger as any),
            },
            browser: ['FALIZ AI', 'Chrome', '1.0.0'],
            generateHighQualityLinkPreview: true,
        });

        this.socket.ev.on('creds.update', saveCreds);

        this.socket.ev.on('connection.update', (update: any) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                logger.info('Scan the QR code below to connect:');
                // QR code is automatically printed if printQRInTerminal is true
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                logger.error(`Connection closed due to ${lastDisconnect?.error}, reconnecting: ${shouldReconnect}`);
                
                if (shouldReconnect) {
                    this.connect();
                }
            } else if (connection === 'open') {
                logger.info('FALIZ AI WhatsApp connection opened successfully!');
            }
        });

        return this.socket;
    }

    // Method for pairing code if needed
    async requestPairingCode(phoneNumber: string) {
        // Implementation for pairing code if user prefers it over QR
        const code = await this.socket.requestPairingCode(phoneNumber);
        return code;
    }
}
