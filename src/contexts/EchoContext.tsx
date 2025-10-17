import { getBroadcastConfig } from '@/config/broadcast';
import Echo, { type Broadcaster } from 'laravel-echo';
import Pusher from 'pusher-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

window.Pusher = Pusher;

interface EchoContextType {
    echo: Echo<keyof Broadcaster> | null;
    isConnected: boolean;
}

const EchoContext = createContext<EchoContextType | undefined>({
    echo: null,
    isConnected: false,
});

export const EchoProvider = ({ children }: { children: React.ReactNode }) => {
    const [echo, setEcho] = useState<Echo<keyof Broadcaster> | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { getToken } = useAuthContext();

    useEffect(() => {
        const config = getBroadcastConfig(getToken());
        const echoInstance = new Echo(config);

        setEcho(echoInstance);

        const pusher = (echoInstance.connector as any).pusher;
        pusher.connection.bind('connected', () => setIsConnected(true));
        pusher.connection.bind('disconnected', () => setIsConnected(false));

        return () => {
            pusher.connection.unbind_all();
            echoInstance.disconnect();
            setIsConnected(false);
        };
    }, [getToken]);

    return (
        <EchoContext.Provider value={{ echo, isConnected }}>
            {children}
        </EchoContext.Provider>
    );
};

export const useEcho = () => {
    const context = useContext(EchoContext);
    if (!context) {
        throw new Error('useEcho must be used within EchoProvider');
    }
    return context;
};
