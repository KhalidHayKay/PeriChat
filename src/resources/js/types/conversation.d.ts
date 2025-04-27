interface Conversation {
	id: number;
	name: string;
	type: string;
	typeId: number;
	avatar: string | null;
	lastMessage: string | null;
	lastMessageSenderId: number | null;
	lastMessageDate: string | null;
	unreadMessageCount: number;
	groupUserIds?: number[];
}
