import ConversationHeader from '@/Components/app/conversation/ConversationHeader';
import ConversationInput from '@/Components/app/conversation/ConversationInput';
import ConversationMessages from '@/Components/app/conversation/ConversationMessages';
import useEventBus from '@/context/EventBus';
import { ConversationTypeEnum } from '@/enums/enums';
import ChatLayout from '@/Layouts/ChatLayout';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const Conversation = ({
	messages,
	selectedConversation,
}: {
	messages?: { data: Message[] };
	selectedConversation: Conversation;
}) => {
	const page = usePage();
	const user = page.props.auth.user;

	const [localMessages, setLocalMessages] = useState<Message[]>([]);

	const { on } = useEventBus();

	const messageCreated = (message: Message) => {
		if (
			selectedConversation &&
			selectedConversation.type === ConversationTypeEnum.GROUP &&
			selectedConversation.typeId === message.groupId
		) {
			setLocalMessages((prev) => [...prev, message]);
		}

		if (
			selectedConversation &&
			selectedConversation.type === ConversationTypeEnum.PRIVATE &&
			!message.groupId &&
			(selectedConversation.typeId === message.senderId ||
				selectedConversation.typeId === message.receiverId)
		) {
			setLocalMessages((prev) => [...prev, message]);
		}
	};

	useEffect(() => {
		const offCreated = on('message.created', messageCreated);

		return () => {
			offCreated();
		};
	}, [selectedConversation]);

	useEffect(() => {
		setLocalMessages(messages ? messages.data.reverse() : []);
	}, [messages]);

	return (
		<>
			<ConversationHeader selectedConversation={selectedConversation} />

			<div className='flex-1 bg-secondary/50 overflow-hidden relative'>
				{localMessages.length > 0 ? (
					<>
						<ConversationMessages
							messages={localMessages}
							setMessages={setLocalMessages}
							selectedConversation={selectedConversation}
							user={user}
						/>
					</>
				) : (
					<div className='size-full flex items-center justify-center'>
						No message to see. start a conversation.
					</div>
				)}
			</div>

			<ConversationInput conversation={selectedConversation} />
		</>
	);
};

Conversation.layout = (page: React.ReactNode) => (
	<ChatLayout>{page}</ChatLayout>
);

export default Conversation;
