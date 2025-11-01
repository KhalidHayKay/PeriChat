interface Message {
    id: number;
    message: string;
    conversationId: number;
    senderId: number;
    receiverId: number | null;
    groupId: number | null;
    sender: User;
    attachments: Attachment[] | ServerAttachment[] | null;
    createdAt: string;

    tempId?: number;
    status?: 'sending' | 'failed' | 'delivered';
}
