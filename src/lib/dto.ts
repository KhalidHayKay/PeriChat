export const normalizeAttachment = (
    attachment: Attachment | ServerAttachment
) => {
    const clientFile = 'file' in attachment ? attachment.file : undefined;

    const name =
        'name' in attachment ? attachment.name : (clientFile?.name ?? '');
    const mime =
        'mime' in attachment ? attachment.mime : (clientFile?.type ?? '');
    const size =
        'size' in attachment ? attachment.size : (clientFile?.size ?? 0);
    const url =
        attachment.url ?? (clientFile ? URL.createObjectURL(clientFile) : '');

    return {
        ...attachment,
        name,
        mime,
        size,
        url,
    };
};

export interface BackendConversation {
    id: number;
    type: 'private' | 'group';
    name: string;
    type_id: number;
    avatar: string | null;
    last_message: string | null;
    last_message_attachment_count: number;
    last_message_sender_id: number | null;
    last_message_date: string | null;
    unread_messages_count: number;
    group_members_id: number[] | null;
    group_owner: User | null;
}

export const normalizeBackendConversation = (
    conversation: BackendConversation
): Conversation => ({
    type: conversation.type,
    id: conversation.id,
    typeId: conversation.type_id,
    name: conversation.name,
    avatar: conversation.avatar ?? '',
    lastMessage: conversation.last_message ?? '',
    lastMessageAttachmentCount: conversation.last_message_attachment_count,
    lastMessageSenderId: conversation.last_message_sender_id ?? 0,
    lastMessageDate: conversation.last_message_date ?? '',
    unreadMessageCount: conversation.unread_messages_count,
    groupUsersId: conversation.group_members_id,
    groupOwner: conversation.group_owner,
});

export interface BackendMessage {
    id: number;
    content?: string;
    conversation_id: number;
    sender_id: number;
    receiver_id?: number | null;
    group_id?: number | null;
    sender: User;
    attachments?: Attachment[] | ServerAttachment[];
    created_at: string;
    tempId?: string;
    status?: 'sending' | 'failed' | 'delivered';
}

export const normalizeBackendMessage = (message: BackendMessage): Message => ({
    id: message.id,
    message: message.content ?? '',
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    receiverId: message.receiver_id ?? null,
    groupId: message.group_id ?? null,
    sender: message.sender,
    attachments: message.attachments ?? [],
    createdAt: message.created_at,
    tempId: message.tempId,
    status: message.status,
});

export interface BackendGroup {
    id: number;
    name: string;
    avatar?: string | null;
    description?: string | null;
    is_private: boolean;
    member_ids?: Array<number | string>;
    owner: User;
    created_at: string;
    conversation_id: number;
}

export const normalizeBackendGroup = (group: BackendGroup): Group => ({
    id: group.id,
    name: group.name,
    avatar: group.avatar ?? null,
    description: group.description ?? null,
    isPrivate: group.is_private,
    memberIds: group.member_ids
        ? group.member_ids.map((m) => Number(m))
        : undefined,
    owner: group.owner,
    createdAt: group.created_at,
    conversationId: group.conversation_id,
});
