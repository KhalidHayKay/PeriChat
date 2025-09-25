import axios from 'axios';

export const increment = (messageId: number) => {
	axios
		.post(route('message.incrementUnread', messageId))
		.catch((err) => console.error(err));
};

export const resetUnread = async (conversationId: number) => {
	axios
		.post(route('message.markRead', conversationId))
		.catch((err) => console.error(err));
};
