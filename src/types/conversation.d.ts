interface Conversation {
    id: number;
    name: string;
    type: 'private' | 'group';
    typeId: number;
    avatar: string;
    lastMessage: string;
    lastMessageAttachmentCount: number;
    lastMessageSenderId: number;
    lastMessageDate: string;
    unreadMessageCount: number;
    groupMemberIds: number[] | null;
    groupOwner: User | null;

    // client side variables
    lastMessageStatus?: 'sending' | 'delivered' | 'failed';
}
