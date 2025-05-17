interface Conversation {
	id: number;
	name: string;
	type: string;
	typeId: number;
	avatar: string;
	lastMessage: string;
	lastMessageAttachmentCount: number;
	lastMessageSenderId: number;
	lastMessageDate: string;
	unreadMessageCount: number;
	groupUsersId?: number[];
}
