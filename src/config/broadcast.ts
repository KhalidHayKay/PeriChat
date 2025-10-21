import { env } from '@/config/env';

const buildBaseAuth = (token: string | null) => ({
    authEndpoint: env.broadcast.authUrl,
    auth: {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token || ''}`,
        },
    },
});

export const broadcastConfigMap: Record<string, (token: string | null) => any> =
    {
        reverb: (token) =>
            ({
                broadcaster: 'reverb',
                key: env.reverb.key,
                wsHost: env.reverb.host, // No protocol, just hostname
                wsPort: Number(env.reverb.port),
                wssPort: Number(env.reverb.port),
                forceTLS: env.reverb.scheme === 'https',
                enabledTransports: ['ws', 'wss'],
                disableStats: true,
                ...buildBaseAuth(token),
            }) as any,

        pusher: (token) =>
            ({
                broadcaster: 'pusher',
                key: env.pusher.key,
                cluster: env.pusher.cluster,
                forceTLS: true,
                ...buildBaseAuth(token),
            }) as any,
    };

export const getBroadcastConfig = (token: string | null): any => {
    const connection = env.broadcast.connection || 'pusher';
    const builder = broadcastConfigMap[connection];
    if (!builder) {
        throw new Error(`Unknown broadcast connection: ${connection}`);
    }
    return builder(token);
};
