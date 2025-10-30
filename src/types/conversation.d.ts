interface Conversation {
    id: number;
    name: string;
    type: string;
    typeId: number;
    avatar: string;
    lastMessage: string;
    lastMessageStatus?: 'sending' | 'delivered' | 'failed';
    lastMessageAttachmentCount: number;
    lastMessageSenderId: number;
    lastMessageDate: string;
    unreadMessageCount: number;
    groupUsersId?: number[];
}
