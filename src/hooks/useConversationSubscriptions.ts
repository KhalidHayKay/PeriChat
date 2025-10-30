import { messageMatchesConversation } from '@/actions/helpers';
import useAppEventContext from '@/contexts/AppEventsContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useEcho } from '@/contexts/EchoContext';
import { useEffect, useMemo, useRef } from 'react';

export const useConversationSubscriptions = (user: User) => {
    const { echo, isConnected } = useEcho();
    const { conversations, updateConversations } = useConversationContext();
    const { emit } = useAppEventContext();

    // Track subscribed channels to avoid re-subscribing
    const subscribedChannelsRef = useRef<Set<string>>(new Set());

    // Memoize conversation signatures to prevent unnecessary re-subscriptions
    // Only changes when conversations array changes
    const conversationSignature = useMemo(() => {
        return conversations
            .map((c) => `${c.id}-${c.type}-${c.typeId}`)
            .sort()
            .join('|');
    }, [conversations]);

    useEffect(() => {
        if (!echo || !isConnected || conversations.length === 0) return;

        const currentChannels = new Set<string>();
        const channelsToSubscribe: string[] = [];

        // Identify which channels we need
        conversations.forEach((conversation) => {
            const channelName = `conversation.${conversation.id}`;
            currentChannels.add(channelName);

            // Only subscribe if not already subscribed
            if (!subscribedChannelsRef.current.has(channelName)) {
                channelsToSubscribe.push(channelName);
            }
        });

        // Subscribe to new channels
        channelsToSubscribe.forEach((channelName) => {
            // console.log(`[MessageSub] Subscribing to: ${channelName}`);

            echo.private(channelName)
                .listen('MessageSent', (e: { message: Message }) => {
                    const { message } = e;

                    if (message.senderId !== user.id) {
                        emit('message.created', message);

                        updateConversations((prev) =>
                            prev.map((c) => {
                                if (!messageMatchesConversation(c, message))
                                    return c;

                                return {
                                    ...c,
                                    lastMessage: message.message,
                                    lastMessageDate: message.createdAt,
                                    lastMessageSenderId: message.senderId,
                                    lastMessageAttachmentCount:
                                        message.attachments?.length ?? 0,
                                };
                            })
                        );

                        emit('unread.increment', message);
                    }
                })
                .listen('MemberJoined', (e: { member: User; group: Group }) => {
                    console.log(e);

                    const { member, group } = e;

                    updateConversations((prev) =>
                        prev.map((c) => {
                            if (c.type !== 'group' || c.typeId !== group.id)
                                return c;

                            return {
                                ...c,
                                lastMessage: `${member.name} joined ${group.name}`,
                                lastMessageDate: group.created,
                                lastMessageSenderId: 0,
                            };
                        })
                    );
                })
                // .listen('LeftGroup', (e: { group: Group }) => {})
                .error((error: any) => {
                    console.error(`Error on channel ${channelName}:`, error);
                });

            subscribedChannelsRef.current.add(channelName);
        });

        // Unsubscribe from channels no longer needed
        const channelsToUnsubscribe = Array.from(
            subscribedChannelsRef.current
        ).filter((channel) => !currentChannels.has(channel));

        channelsToUnsubscribe.forEach((channelName) => {
            // console.log(`[MessageSub] Unsubscribing from: ${channelName}`);
            echo.leave(channelName);
            subscribedChannelsRef.current.delete(channelName);
        });

        return () => {
            subscribedChannelsRef.current.forEach((channelName) => {
                echo.leave(channelName);
            });
            subscribedChannelsRef.current.clear();
        };
    }, [
        echo,
        isConnected,
        conversationSignature,
        user.id,
        updateConversations,
        emit,
    ]);
};
