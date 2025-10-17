interface EnvConfig {
    app: { name: string; version: string; url: string };
    api: { url: string; base: string };
    broadcast: { connection: 'pusher' | 'reverb'; authUrl: string };
    pusher: {
        id: string;
        key: string;
        secret: string;
        host: string;
        port: number;
        scheme: string;
        cluster: string;
    };
    reverb: {
        id: string;
        key: string;
        secret: string;
        host: string;
        port: number;
        scheme: string;
    };
}

const ime = import.meta.env;

export const env: EnvConfig = {
    app: {
        name: ime.VITE_APP_NAME || 'PeriChat',
        version: ime.VITE_APP_VERSION || '1.0.0',
        url: ime.VITE_APP_URL,
    },
    api: {
        base: ime.VITE_API_BASE || 'http://localhost:8000',
        url: (ime.VITE_API_BASE || 'http://localhost:8000') + '/api',
    },
    broadcast: {
        connection: (ime.VITE_BROADCAST_CONNECTION || 'pusher') as
            | 'pusher'
            | 'reverb',
        authUrl: ime.VITE_BROADCAST_AUTH_URL,
    },
    pusher: {
        id: ime.VITE_PUSHER_APP_ID || '',
        key: ime.VITE_PUSHER_APP_KEY || '',
        secret: ime.VITE_PUSHER_APP_SECRET || '',
        host: ime.VITE_PUSHER_HOST || 'api.pusherapp.com',
        port: ime.VITE_PUSHER_PORT ? parseInt(ime.VITE_PUSHER_PORT) : 443,
        scheme: ime.VITE_PUSHER_SCHEME || 'https',
        cluster: ime.VITE_PUSHER_APP_CLUSTER || 'mt1',
    },
    reverb: {
        id: ime.VITE_REVERB_APP_ID || '',
        key: ime.VITE_REVERB_APP_KEY || '',
        secret: ime.VITE_REVERB_APP_SECRET || '',
        host: ime.VITE_REVERB_HOST || 'localhost',
        port: ime.VITE_REVERB_PORT ? parseInt(ime.VITE_REVERB_PORT) : 8080,
        scheme: ime.VITE_REVERB_SCHEME || 'http',
    },
};
