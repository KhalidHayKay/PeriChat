interface Message {
	id: number;
	message: string;
	senderId: number;
	receiverId: number | null;
	groupId: number | null;
	sender: User;
	attachments: Attachment[] | ServerAttachment[] | null;
	createdAt: string;
}
