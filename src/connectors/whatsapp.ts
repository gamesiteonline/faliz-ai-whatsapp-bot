import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    AuthenticationState,
    AuthenticationCreds
} from '@whiskeysockets/baileys';
// import { MongoClient } from 'mongodb';
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
        // Use MultiFileAuthState as primary, but we could add Mongo logic here
        // For Render, we'll stick to the provided guide's recommendation of using a Disk
        // or a simple local state that we can manually back up if needed.
        // To keep it simple and robust for the user, we will stick to the MultiFile approach
        // and guide them to use Render Disks or a persistent VPS.
        
        const { state, saveCreds } = await useMultiFileAuthState(this.statePath);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        
        logger.info(`Using WhatsApp v${version.join('.')}, isLatest: ${isLatest}`);

        const phoneNumber = process.env.PHONE_NUMBER;
        const usePairingCode = !!phoneNumber;

        this.socket = makeWASocket({
            version,
            printQRInTerminal: !usePairingCode,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger as any),
            },
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            generateHighQualityLinkPreview: true,
        });

        if (usePairingCode && !this.socket.authState.creds.registered) {
            setTimeout(async () => {
                try {
                    const code = await this.socket.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));
                    logger.info(`\n\n=== PAIRING CODE: ${code} ===\n\n`);
                } catch (error) {
                    logger.error({ err: error }, 'Failed to request pairing code:');
                }
            }, 3000);
        }

        this.socket.ev.on('creds.update', saveCreds);

        this.socket.ev.on('connection.update', (update: any) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr && !usePairingCode) {
                logger.info('Scan the QR code below to connect:');
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
