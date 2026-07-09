import { env } from '@/config/env';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuthContext } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { getToken } = useAuthContext();

    useEffect(() => {
        const instance = io(env.socket.url, {
            auth: { token: getToken() },
            reconnectionAttempts: 5,
        });

        instance.on('connect', () => setIsConnected(true));
        instance.on('disconnect', () => setIsConnected(false));

        setSocket(instance);

        return () => {
            instance.disconnect();
        };
    }, [getToken]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
