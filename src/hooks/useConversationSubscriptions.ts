import { useAppEventContext } from '@/contexts/AppEventsContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useSocket } from '@/contexts/SocketContext';
import { normalizeBackendMessage, type BackendMessage } from '@/lib/dto';
import { useEffect, useMemo } from 'react';

export const useConversationSubscriptions = (user: User) => {
    const { socket, isConnected } = useSocket();
    const { conversations, updateConversations } = useConversationContext();
    const { emit } = useAppEventContext();

    const conversationSignature = useMemo(() => {
        return conversations
            .map((c) => c.id)
            .sort()
            .join('|');
    }, [conversations]);

    useEffect(() => {
        if (!socket || !isConnected || conversations.length === 0) return;

        // tell server which conversations to join
        const ids = conversations.map((c) => c.id);
        socket.emit('conversations:join', ids);

        socket.on('message:sent', (serverMessage: BackendMessage) => {
            const message = normalizeBackendMessage(serverMessage);
            console.log(message);
            if (message.senderId !== user.id) {
                // message UI rearrangement
                emit('message.created', message);
                // LHS conversation subject UI rearrangement
                updateConversations((prev) =>
                    prev.map((c) => {
                        if (c.id !== message.conversationId) return c;
                        return {
                            ...c,
                            lastMessage: message.message,
                            lastMessageDate: message.createdAt,
                            lastMessageSenderId: message.senderId,
                        };
                    })
                );
                emit('unread.increment', message);
            }
        });

        return () => {
            socket.emit('conversations:leave', ids);
            socket.off('message:sent');
        };
    }, [socket, isConnected, conversationSignature, user.id]);
};
