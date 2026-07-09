interface EnvConfig {
    app: { name: string; version: string; url: string; env: string };
    api: { url: string; base: string };
    socket: {
        url: string;
    };
}

const ime = import.meta.env;

export const env: EnvConfig = {
    app: {
        name: ime.VITE_APP_NAME || 'PeriChat',
        env: ime.VITE_APP_ENV || 'production',
        version: ime.VITE_APP_VERSION || '1.0.0',
        url: ime.VITE_APP_URL,
    },
    api: {
        base: ime.VITE_API_BASE || 'http://localhost:8000',
        url: (ime.VITE_API_BASE || 'http://localhost:8000') + '/api',
    },
    socket: {
        url: ime.VITE_SOCKET_URL,
    },
};
