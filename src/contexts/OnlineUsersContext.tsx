import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

interface OnlineUsersContextType {
    onlineUsers: Record<number, boolean>;
    checkIfUserIsOnline: (userId: number) => boolean;
}

const OnlineUsersContext = createContext<OnlineUsersContextType | undefined>(undefined);


export const OnlineUsersProvider = ({ children }: { children: React.ReactNode }) => {
    const [onlineUsers, setOnlineUsers] = useState<Record<number, boolean>>({});
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('users:online', (userIds: number[]) => {
            const map = Object.fromEntries(userIds.map(id => [id, true]));
            setOnlineUsers(map);
        });

        socket.on('user:online', ({ userId }: { userId: number }) => {
            setOnlineUsers(prev => ({ ...prev, [userId]: true }));
        });

        socket.on('user:offline', ({ userId }: { userId: number }) => {
            setOnlineUsers(prev => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
        });

        return () => {
            socket.off('users:online');
            socket.off('user:online');
            socket.off('user:offline');
        };
    }, [socket, isConnected]);

    return (
        <OnlineUsersContext.Provider value={{
            onlineUsers,
            checkIfUserIsOnline: (userId) => onlineUsers[userId] === true,
        }}>
            {children}
        </OnlineUsersContext.Provider>
    );
};

export const useOnlineUsers = () => {
    const context = useContext(OnlineUsersContext);
    if (!context) throw new Error('useOnlineUsers must be used within OnlineUsersProvider');
    return context;
};
