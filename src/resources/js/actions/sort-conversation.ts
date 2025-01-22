const SortConversation = (conversationsArray: Conversation[]) => {
	return conversationsArray.sort((a: Conversation, b: Conversation) => {
		if (a.lastMessageDate && b.lastMessageDate) {
			return b.lastMessageDate.localeCompare(a.lastMessageDate);
		} else if (a.lastMessageDate) {
			return -1;
		} else if (b.lastMessageDate) {
			return 1;
		} else return 0;
	});
};

export default SortConversation;
