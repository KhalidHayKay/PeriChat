import { useAppEventContext } from '@/contexts/AppEventsContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useEcho } from '@/contexts/EchoContext';
import { useEffect } from 'react';

export const useNewConversationSubscriptions = (user: User) => {
    const { echo, isConnected } = useEcho();
    const { updateConversations } = useConversationContext();
    const { emit } = useAppEventContext();

    useEffect(() => {
        if (!echo || !isConnected) return;

        const channelName = `user.${user.id}`;

        echo.private(channelName)
            .listen('GroupCreated', (e: { conversation: Conversation }) => {
                const { conversation } = e;

                updateConversations((prev) => [conversation, ...prev]);
            })
            .listen(
                'ConversationCreated',
                (e: { conversation: Conversation; message: Message }) => {
                    const { conversation, message } = e;

                    updateConversations((prev) => [conversation, ...prev]);

                    if (conversation.lastMessageSenderId !== user.id) {
                        emit('unread.increment', message);
                    }
                }
            )
            .error((error: any) => {
                console.error(`Error on channel ${channelName}:`, error);
            });

        return () => {
            echo.leave(channelName);
        };
    }, [echo, isConnected, user.id, updateConversations, emit]);
};
