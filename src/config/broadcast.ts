import { env } from '@/config/env';

const buildBaseAuth = (token: string | null) => ({
    authEndpoint: env.api.base + '/broadcasting/auth',
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
                wsHost: env.reverb.host,
                wsPort:
                    env.reverb.scheme === 'https'
                        ? 443
                        : Number(env.reverb.port),
                wssPort:
                    env.reverb.scheme === 'https'
                        ? Number(env.reverb.port)
                        : 443,
                forceTLS: env.reverb.scheme === 'https',
                enabledTransports: ['ws', 'wss'],
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
