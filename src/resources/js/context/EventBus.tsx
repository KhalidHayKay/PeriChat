import { createContext, useContext, useState } from 'react';

type EventBusDataTypes = {
	emit: (name: string, data: any) => void;
	on: (name: string, cb: (...arg: any) => void) => () => void;
};

const EventBusContext = createContext<EventBusDataTypes>(
	{} as EventBusDataTypes
);

export const EventBusProvider = ({ children }: { children: any }) => {
	const [events, setEvents] = useState<{ [key: string]: any[] }>({});

	const emit = (name: string, data: any) => {
		if (events[name]) {
			events[name].forEach((cb: (d: any) => void) => {
				cb(data);
			});
		}
	};

	const on = (name: string, cb: () => void) => {
		if (!events[name]) {
			events[name] = [];
		}

		events[name].push(cb);

		return () => {
			events[name] = events[name].filter((callback) => callback !== cb);
		};
	};

	return (
		<EventBusContext.Provider value={{ emit, on }}>
			{children}
		</EventBusContext.Provider>
	);
};

const useEventBus = () => {
	return useContext(EventBusContext);
};

export default useEventBus;
