import { createContext, useContext, useRef } from 'react';

type EventBusDataTypes = {
    emit: (name: string, ...data: any) => void;
    on: (name: string, cb: (...args: any) => void) => () => void;
};

const EventBusContext = createContext<EventBusDataTypes>(
    {} as EventBusDataTypes
);

export const EventBusProvider = ({ children }: { children: any }) => {
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
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
};

const useEventBus = () => {
    const context = useContext(EventBusContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export default useEventBus;
