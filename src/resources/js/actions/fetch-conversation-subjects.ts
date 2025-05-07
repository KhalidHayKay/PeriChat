import axios from 'axios';

export const fetchConversation = async () => {
	try {
		const res = await axios.get(route('conversation.subjects'));
		return res.data;
	} catch (error) {
		console.error('Failed to fetch conversations:', error);
		throw error; // re-throw so caller knows it failed
	}
};
