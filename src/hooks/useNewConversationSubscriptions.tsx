import useAppEventContext from '@/contexts/AppEventsContext';
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
            .listen(
                'GroupCreated',
                (e: { group: Group; conversation: Conversation }) => {
                    const group = e.group;
                    const conversation = e.conversation;

                    console.log(group, conversation);

                    const optimalConversation: Conversation = {
                        id: conversation.id,
                        name: group.name,
                        type: 'group',
                        typeId: conversation.typeId,
                        avatar: '',
                        lastMessage: `${group.owner.name} created this group`,
                        lastMessageAttachmentCount: 0,
                        lastMessageSenderId: 0,
                        lastMessageDate: group.created,
                        unreadMessageCount: 0,
                    };

                    // emit('message.created', message);
                    updateConversations((prev) => [
                        ...prev,
                        optimalConversation,
                    ]);

                    // if (message.senderId !== user.id) {
                    //     emit('unread.increment', message);
                    // }
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
