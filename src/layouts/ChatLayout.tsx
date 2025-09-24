import LayoutAside from '@/Components/app/layout/LayoutAside';
import Toast from '@/Components/app/Toast';
import { EventBusProvider } from '@/context/EventBus';
import { OnlineUsersProvider } from '@/context/OnlineUsers';
import { cn } from '@/utils/utils';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

const ChatLayout = ({ children }: { children: ReactNode }) => {
	const props = usePage().props;
	const user = props.auth.user;
	const selectedConversation = props.selectedConversation as Conversation;

	return (
		<>
			<Head title='Home' />
			<div className='min-h-screen bg-secondary'>
				<OnlineUsersProvider>
					<EventBusProvider>
						<div
							className={cn(
								'flex-1 size-full h-screen flex sm:p-2 overflow-hidden',
								selectedConversation
									? 'gap-x-0 sm:gap-x-2'
									: 'gap-x-2'
							)}
						>
							<LayoutAside
								data={{ user, selectedConversation }}
							/>

							<main className='flex-1 bg-primary rounded-lg shadow overflow-hidden'>
								<div className='relative size-full flex flex-col divide-y divide-secondary'>
									{children}
								</div>
							</main>
						</div>
					</EventBusProvider>
				</OnlineUsersProvider>
			</div>
			<Toast />
		</>
	);
};

export default ChatLayout;
