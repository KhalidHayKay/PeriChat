interface Conversation {
	id: number;
	name: string;
	type: string;
	avatar: string | null;
	lastMessage: string | null;
	lastMessageDate: string | null;
	groupUserIds?: number[];
}
