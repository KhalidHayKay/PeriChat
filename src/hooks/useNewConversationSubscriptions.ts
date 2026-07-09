import { useAppEventContext } from '@/contexts/AppEventsContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useSocket } from '@/contexts/SocketContext';
import {
    normalizeBackendConversation,
    normalizeBackendMessage,
    type BackendConversation,
    type BackendMessage,
} from '@/lib/dto';
import { useEffect } from 'react';

export const useNewConversationSubscriptions = (user: User) => {
    const { socket, isConnected } = useSocket();
    const { updateConversations } = useConversationContext();
    const { emit } = useAppEventContext();

    useEffect(() => {
        if (!socket || !isConnected) return;

        socket.on('created:group', (subject: BackendConversation) => {
            const conversation = normalizeBackendConversation(subject);

            if (conversation.groupOwner?.id === user.id) return;

            updateConversations((prev) => [conversation, ...prev]);
        });

        socket.on(
            'created:conversation',
            ({
                subject,
                message: serverMessage,
            }: {
                subject: BackendConversation;
                message: BackendMessage;
            }) => {
                const message = normalizeBackendMessage(serverMessage);
                const conversation = normalizeBackendConversation(subject);

                if (conversation.lastMessageSenderId === user.id) return;

                updateConversations((prev) => [conversation, ...prev]);
                emit('unread.increment', message);
            }
        );

        return () => {
            socket.off('created:group');
            socket.off('created:conversation');
        };
    }, [socket, isConnected, user.id, updateConversations, emit]);
};
