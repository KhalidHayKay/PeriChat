import { createContext, useContext, useEffect, useState } from 'react';

import { useEcho } from './EchoContext';

interface OnlineUsersContextType {
    onlineUsers: Record<number, User>;
    checkIfUserIsOnline: (userId: number) => boolean;
}

const OnlineUsersContext = createContext<OnlineUsersContextType | undefined>(
    undefined
);

export const OnlineUsersProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [onlineUsers, setOnlineUsers] = useState<Record<number, User>>({});
    const { echo, isConnected } = useEcho();

    useEffect(() => {
        if (!echo || !isConnected) return;

        echo.join('online')
            .here((users: User[]) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers(onlineUsersObj);
            })
            .joining((user: User) => {
                setOnlineUsers((prev) => ({ ...prev, [user.id]: user }));
            })
            .leaving((user: User) => {
                setOnlineUsers((prev) => {
                    const updated = { ...prev };
                    delete updated[user.id];
                    return updated;
                });
            })
            .error((error: any) => {
                console.error('Online users channel error:', error);
            });

        return () => {
            echo.leave('online');
        };
    }, [echo, isConnected]);

    const checkIfUserIsOnline = (userId: number) => !!onlineUsers[userId];

    return (
        <OnlineUsersContext.Provider
            value={{ onlineUsers, checkIfUserIsOnline }}
        >
            {children}
        </OnlineUsersContext.Provider>
    );
};

export const useOnlineUsers = () => {
    const context = useContext(OnlineUsersContext);
    if (!context) {
        throw new Error(
            'useOnlineUsers must be used within OnlineUsersProvider'
        );
    }
    return context;
};
