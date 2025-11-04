import { useTempMessages } from '@/hooks/useTempMessages';
import { createContext, useContext, type ReactNode } from 'react';

type TempMessagesContextType = ReturnType<typeof useTempMessages>;

const TempMessagesContext = createContext<TempMessagesContextType | null>(null);

export const TempMessagesProvider = ({ children }: { children: ReactNode }) => {
    const tempMessages = useTempMessages();

    return (
        <TempMessagesContext.Provider value={tempMessages}>
            {children}
        </TempMessagesContext.Provider>
    );
};

export const useTempMessagesContext = () => {
    const context = useContext(TempMessagesContext);
    if (!context) {
        throw new Error(
            'useTempMessagesContext must be used within TempMessagesProvider'
        );
    }
    return context;
};
