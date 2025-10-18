export const ConversationTypeEnum = {
    PRIVATE: 'private',
    GROUP: 'group',
} as const;

export type ConversationTypeEnum =
    (typeof ConversationTypeEnum)[keyof typeof ConversationTypeEnum];
