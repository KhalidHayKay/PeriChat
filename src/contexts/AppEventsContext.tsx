import { createContext, useContext, useRef } from 'react';

type AppEventDataTypes = {
    emit: (name: string, ...data: any) => void;
    on: (name: string, cb: (...args: any) => void) => () => void;
};

const AppEventContext = createContext<AppEventDataTypes>(
    {} as AppEventDataTypes
);

export const AppEventProvider = ({ children }: { children: any }) => {
    const events = useRef<{ [key: string]: any[] }>({});

    const emit = (name: string, ...data: any) => {
        if (events.current[name]) {
            events.current[name].forEach((cb: (...d: any) => void) => {
                cb(...data);
            });
        }
    };

    const on = (name: string, cb: (...args: any) => void) => {
        if (!events.current[name]) events.current[name] = [];
        events.current[name].push(cb);

        return () => {
            events.current[name] = events.current[name].filter(
                (fn) => fn !== cb
            );
        };
    };

    return (
        <AppEventContext.Provider value={{ emit, on }}>
            {children}
        </AppEventContext.Provider>
    );
};

const useAppEventContext = () => {
    const context = useContext(AppEventContext);
    if (context === undefined) {
        throw new Error(
            'useConversationContext must be used within a ConversationProvider'
        );
    }
    return context;
};

export default useAppEventContext;
