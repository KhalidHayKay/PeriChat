import type { Dispatch, SetStateAction } from 'react';

import { increment, resetUnread } from './conversation';
import { messageMatchesConversation } from './helpers';

export const incrementUnreadMessageCount = (
    message: Message,
    setLocalConversation: Dispatch<SetStateAction<Conversation[]>>
) => {
    setLocalConversation((prev) =>
        prev.map((c) =>
            messageMatchesConversation(c, message)
                ? { ...c, unreadMessageCount: c.unreadMessageCount + 1 }
                : c
        )
    );

    increment(message.conversationId, message.id);
};

export const resetUnreadMessageCount = (
    conversation: Conversation,
    setLocalConversation: Dispatch<SetStateAction<Conversation[]>>
) => {
    setLocalConversation((prev) => {
        return prev.map((c) => {
            if (c.id === conversation.id) {
                return { ...c, unreadMessageCount: 0 };
            }
            return c;
        });
    });

    resetUnread(conversation.id);
};
