import { ConversationTypeEnum } from '@/enums/enums';
// import { toast } from 'react-toastify';

export const handleIncomingSocketMessage = (
    message: Message,
    user: User,
    emit: (...args: any[]) => void,
    selectedConversation?: Conversation
    // newConversation?: Conversation
) => {
    emit('message.created', message);

    if (message.senderId === user.id) {
        return;
    }

    if (
        selectedConversation &&
        selectedConversation.type === ConversationTypeEnum.PRIVATE &&
        !message.groupId &&
        selectedConversation.typeId === message.senderId
    ) {
        return;
    }

    if (
        selectedConversation &&
        selectedConversation.type === ConversationTypeEnum.GROUP &&
        selectedConversation.typeId === message.groupId
    ) {
        return;
    }

    emit('unread.increment', message);
    // toast('New message notification');
};

export default handleIncomingSocketMessage;
