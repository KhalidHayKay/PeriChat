import { ConversationTypeEnum } from '@/enums/enums';
import { Dispatch, SetStateAction } from 'react';
import { increment, resetUnread } from './message-unread-actions';

export const messageCreated = (
	message: Message,
	setLocalConversation: Dispatch<SetStateAction<Conversation[]>>
) => {
	setLocalConversation((prev) =>
		prev.map((c) => {
			if (!messageMatchConversation(c, message)) return c;

			return {
				...c,
				lastMessage: message.message,
				lastMessageDate: message.createdAt,
				lastMessageSenderId: message.senderId,
				lastMessageAttachmentCount: message.attachments?.length ?? 0,
			};
		})
	);
};

export const messageUnreadIncremented = (
	message: Message,
	setLocalConversation: Dispatch<SetStateAction<Conversation[]>>
) => {
	setLocalConversation((prev) =>
		prev.map((c) =>
			messageMatchConversation(c, message)
				? { ...c, unreadMessageCount: c.unreadMessageCount + 1 }
				: c
		)
	);

	increment(message.id);
};

export const messageUnreadReset = (
	conversation: Conversation,
	setLocalConversation: Dispatch<SetStateAction<Conversation[]>>
) => {
	setLocalConversation((prev) => {
		return prev.map((c) => {
			if (c.id === conversation.id) {
				return { ...c, unreadMessageCount: 0 };
			}
			return c;
		});
	});

	resetUnread(conversation.id);
};

const messageMatchConversation = (
	conversation: Conversation,
	message: Message
) => {
	const isPrivate =
		conversation.type === ConversationTypeEnum.PRIVATE &&
		!message.groupId &&
		(conversation.typeId === message.senderId ||
			conversation.typeId === message.receiverId);

	const isGroup =
		conversation.type === ConversationTypeEnum.GROUP &&
		conversation.typeId === message.groupId;

	return isPrivate || isGroup;
};
