import LayoutAside from '@/Components/app/layout/LayoutAside';
import { useConversations } from '@/hooks/useConversations';
import { useMessageSubscriptions } from '@/hooks/useMessageSubscriptions';
import { cn } from '@/utils/utils';
import { usePage } from '@inertiajs/react';
import React from 'react';

const ChatLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const props = usePage().props;
	const user = props.auth.user;
	const selectedConversation = props.selectedConversation as Conversation;

	const { local } = useConversations();

	useMessageSubscriptions(local, user, selectedConversation);

	return (
		<>
			<div
				className={cn(
					'flex-1 size-full h-screen flex sm:p-2 overflow-hidden',
					selectedConversation ? 'gap-x-0 sm:gap-x-2' : 'gap-x-2'
				)}
			>
				<LayoutAside data={{ user, selectedConversation }} />
				<main className='flex-1 bg-primary rounded-lg shadow overflow-hidden'>
					{children}
				</main>
			</div>
		</>
	);
};

export default ChatLayout;
