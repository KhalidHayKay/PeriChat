const SortConversation = (conversationsArray: Conversation[]) => {
	return conversationsArray.sort((a: Conversation, b: Conversation) => {
		if (a.blocked_at && b.blocked_at) {
			return a.blocked_at > b.blocked_at ? 1 : -1;
		} else if (a.blocked_at) {
			return 1;
		} else if (b.blocked_at) {
			return 1;
		}

		if (a.last_message_date && b.last_message_date) {
			return b.last_message_date.localeCompare(a.last_message_date);
		} else if (a.last_message_date) {
			return -1;
		} else if (b.last_message_date) {
			return 1;
		} else return 0;
	});
};

export default SortConversation;
