import { EventBusProvider } from '@/context/EventBus';
import { OnlineUsersProvider } from '@/context/OnlineUsers';
import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import '../../css/custom.css';

export default function Authenticated({ children }: PropsWithChildren) {
	return (
		<EventBusProvider>
			<OnlineUsersProvider>
				<Head title='Home' />
				<div className='min-h-screen bg-secondary'>{children}</div>
			</OnlineUsersProvider>
		</EventBusProvider>
	);
}
