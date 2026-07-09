import { createContext, useContext, useRef, type ReactNode } from 'react';

type AppEventHandler = (...args: unknown[]) => void;

type AppEventDataTypes = {
    emit: <TArgs extends unknown[] = unknown[]>(
        name: string,
        ...data: TArgs
    ) => void;
    on: <TArgs extends unknown[] = unknown[]>(
        name: string,
        cb: (...args: TArgs) => void
    ) => () => void;
};

const AppEventContext = createContext<AppEventDataTypes>(
    {} as AppEventDataTypes
);

export const AppEventProvider = ({ children }: { children: ReactNode }) => {
    const events = useRef<Record<string, AppEventHandler[]>>({});

    const emit = <TArgs extends unknown[] = unknown[]>(
        name: string,
        ...data: TArgs
    ) => {
        events.current[name]?.forEach((cb) => {
            cb(...data);
        });
    };

    const on = <TArgs extends unknown[] = unknown[]>(
        name: string,
        cb: (...args: TArgs) => void
    ) => {
        if (!events.current[name]) events.current[name] = [];
        events.current[name].push(cb as AppEventHandler);

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

export const useAppEventContext = () => {
    const context = useContext(AppEventContext);
    if (context === undefined) {
        throw new Error(
            'useAppEventContext must be used within an AppEventProvider'
        );
    }
    return context;
};
