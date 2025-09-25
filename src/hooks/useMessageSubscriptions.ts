import handleIncomingSocketMessage from '@/actions/handle-incoming-socket-message';
import useEventBus from '@/contexts/EventBus';
import { ConversationTypeEnum } from '@/enums/enums';
import { useEffect } from 'react';

export const useMessageSubscriptions = (
    conversations: Conversation[],
    user: User,
    selectedConversation: Conversation | null
) => {
    if (!selectedConversation) {
        return;
    }

    const { emit } = useEventBus();

    const getChannelName = (conversation: Conversation) => {
        let channel = `message.group.${conversation.typeId}`;

        if (conversation.type === ConversationTypeEnum.PRIVATE) {
            channel = `message.private.${[user.id, conversation.typeId]
                .sort((a, b) => a - b)
                .join('-')}`;
        }

        return channel;
    };

    useEffect(() => {
        conversations.forEach((conversation) => {
            console.log('listening to channel ' + getChannelName(conversation));
            window.Echo.private(getChannelName(conversation))
                .listen('SocketMessage', (e: { message: Message }) => {
                    const message = e.message;

                    handleIncomingSocketMessage(
                        message,
                        user,
                        emit,
                        selectedConversation
                    );
                })
                .error((err: any) => {
                    console.error(err);
                });
        });

        return () => {
            conversations.forEach((conversation) => {
                console.log('Leaving channel ' + getChannelName(conversation));
                window.Echo.leave(getChannelName(conversation));
            });
        };
    }, [conversations]);
};
