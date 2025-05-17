import axios from 'axios';

export const fetchAppUsers = async () => {
	return handleRequest('conversation.new.users');
};

export const fetchPublicGroups = async () => {
	return handleRequest('conversation.new.groups');
};

export const fetchUsersForNewGroup = async () => {
	return handleRequest('conversation.new.group-users');
};

const handleRequest = async (routeName: string) => {
	try {
		const res = await axios.get(route(routeName));
		return res.data.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
