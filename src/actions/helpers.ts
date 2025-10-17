import { ConversationTypeEnum } from '@/enums/enums';

export const messageMatchesConversation = (
    conversation: Conversation,
    message: Message
) => {
    const isPrivate =
        conversation.type === ConversationTypeEnum.PRIVATE &&
        !message.groupId &&
        (conversation.typeId === message.senderId ||
            conversation.typeId === message.receiverId);

    const isGroup =
        conversation.type === ConversationTypeEnum.GROUP &&
        conversation.typeId === message.groupId;

    return isPrivate || isGroup;
};
