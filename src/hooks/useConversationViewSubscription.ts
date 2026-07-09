import { useAppEventContext } from '@/contexts/AppEventsContext';
import { useSocket } from '@/contexts/SocketContext';
import { useEffect } from 'react';

export const useConversationViewSubscription = (
    conversation: Conversation | null
) => {
    const { socket } = useSocket();
    const { emit } = useAppEventContext();

    useEffect(() => {
        if (!socket || !conversation) return;

        emit('unread.reset', conversation);

        // tell server "I'm viewing this conversation"
        socket.emit('conversation:viewing', {
            conversationId: conversation.id,
            conversationType: conversation.type,
            typeId:
                conversation.type === 'private'
                    ? conversation.id
                    : conversation.typeId,
            unreadMessageCount: conversation.unreadMessageCount,
        });

        return () => {
            // tell server "I left" when component unmounts
            socket.emit('conversation:left', conversation.id);
        };
    }, [socket, conversation]);
};
