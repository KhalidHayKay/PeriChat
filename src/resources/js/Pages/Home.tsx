import ConversationHeader from '@/Components/app/conversation/ConversationHeader';
import ConversationInput from '@/Components/app/conversation/ConversationInput';
import ConversationMessages from '@/Components/app/conversation/ConversationMessages';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const Home = ({
	messages,
	selectedConversation,
}: {
	messages?: { data: Message[] };
	selectedConversation?: Conversation;
}) => {
	const page = usePage();
	const user = page.props.auth.user;

	const [localMessages, setLocalMessages] = useState<Message[]>([]);

	useEffect(() => {
		setLocalMessages(messages ? messages.data.reverse() : []);
	}, [messages]);

	return (
		<div className='size-full flex flex-col divide-y divide-secondary'>
			{!selectedConversation ? (
				<div className='size-full flex flex-col gap-y-3 items-center justify-center'>
					<h2 className='text-2xl font-bold'>PeriChat</h2>
					<p className='text-lg'>
						Select conversation to see messages
					</p>
					<ChatBubbleLeftIcon className='size-20 mt-5 text-primary-content' />
				</div>
			) : (
				<>
					<ConversationHeader
						selectedConversation={selectedConversation}
					/>

					<div className='flex-1 bg-secondary/50 overflow-hidden'>
						{localMessages.length > 0 ? (
							<ConversationMessages
								messages={localMessages}
								selectedConversation={selectedConversation}
								user={user}
							/>
						) : (
							<div className='size-full flex items-center justify-center'>
								No message to see. start a conversation.
							</div>
						)}
					</div>

					<ConversationInput />
				</>
			)}
		</div>
	);
};

Home.layout = (page: React.ReactNode) => (
	<Authenticated>
		<ChatLayout children={page} />
	</Authenticated>
);

export default Home;
