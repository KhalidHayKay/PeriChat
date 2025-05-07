import useEventBus from '@/context/EventBus';
import { ConversationTypeEnum } from '@/enums/enums';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const useMessageSubscriptions = (
	conversations: Conversation[],
	user: User,
	selectedConversation?: Conversation
) => {
	const { emit } = useEventBus();

	useEffect(() => {
		conversations.forEach((conversation) => {
			let channel = `message.group.${conversation.typeId}`;

			if (conversation.type === ConversationTypeEnum.PRIVATE) {
				channel = `message.private.${[user.id, conversation.typeId]
					.sort((a, b) => a - b)
					.join('-')}`;
			}

			// console.log('listening to channel ' + channel);
			window.Echo.private(channel)
				.listen('SocketMessage', (e: { message: Message }) => {
					const message = e.message;

					emit('message.created', message);

					if (message.senderId === user.id) {
						return;
					}

					if (
						selectedConversation &&
						selectedConversation.type ===
							ConversationTypeEnum.PRIVATE &&
						!message.groupId &&
						selectedConversation.typeId === message.senderId
					) {
						return;
					}

					if (
						selectedConversation &&
						selectedConversation.type ===
							ConversationTypeEnum.GROUP &&
						selectedConversation.typeId === message.groupId
					) {
						return;
					}

					emit('unread.increment', message);
					toast('New message notification');
				})
				.error((err: any) => {
					console.error(err);
				});
		});

		return () => {
			conversations.forEach((conversation) => {
				let channel = `message.group.${conversation.typeId}`;

				if (conversation.type === ConversationTypeEnum.PRIVATE) {
					channel = `message.private.${[user.id, conversation.typeId]
						.sort((a, b) => a - b)
						.join('-')}`;
				}

				// console.log('Leaving channel ' + channel);
				window.Echo.leave(channel);
			});
		};
	}, [conversations]);
};
