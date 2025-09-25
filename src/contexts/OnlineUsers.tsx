import { createContext, useContext, useEffect, useState } from 'react';

type OnlineUsersContextTypes = {
	checkIfUserIsOnline: (userId: number) => boolean;
};

const OnlineUsersContext = createContext({} as OnlineUsersContextTypes);

export const OnlineUsersProvider = ({ children }: { children: any }) => {
	const [onlineUsers, setOnlineUsers] = useState<{ [key: number]: {} }>({});

	const checkIfUserIsOnline = (userId: number) => !!onlineUsers[userId];

	useEffect(() => {
		window.Echo.join('online')
			.here((users: []) => {
				const onlineUsersObj = Object.fromEntries(
					users.map((user: { id: number }) => [user.id, user])
				);

				setOnlineUsers((prev) => {
					return { ...prev, ...onlineUsersObj };
				});
			})
			.joining((user: { id: number }) => {
				setOnlineUsers((prev) => {
					return { ...prev, [user.id]: user };
				});
			})
			.leaving((user: { id: number }) => {
				setOnlineUsers((prev: { [key: number]: {} }) => {
					delete prev[user.id];
					return prev;
				});
			})
			.error((error: any) => {
				console.error(error);
			});

		return () => window.Echo.leave('online');
	}, []);

	return (
		<OnlineUsersContext.Provider value={{ checkIfUserIsOnline }}>
			{children}
		</OnlineUsersContext.Provider>
	);
};

const useOnlineUsers = () => {
	return useContext(OnlineUsersContext);
};

export default useOnlineUsers;
