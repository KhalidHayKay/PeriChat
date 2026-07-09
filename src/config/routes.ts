export const routes = {
    app: {
        auth: {
            login: '/login',
            register: '/register',
        },
        home: '/',
        conversation: (id: number) => `/conversation/${id}`,
        profile: (id: number) => `/profile/${id}`,
    },
    api: {
        auth: {
            login: '/auth/login',
            register: '/auth/register',
        },
        getUser: (id: string) => `/api/user/${id}`,
        conversation: {
            subjects: '/conversations/',
            newUsers: '/conversations/suggestions?type=user',
            newGroups: '/conversations/suggestions?type=group',
            messages: (id: number) => `/conversations/${id}`,
            olderMessages: (id: number, lastMessageId: number) =>
                `/conversations/${id}/older?last_message_id${lastMessageId}`,
        },
        group: {
            create: '/group',
            candidates: '/group/candidates',
            join: (groupId: number) => `/group/${groupId}/join`,
        },
        message: {
            send: '/messaging',
            sendFirst: '/messaging/first',
            unread: (conversationId: number, messageId: number) =>
                `/messaging/conversation/${conversationId}/message/${messageId}/unread/increment`,
            read: (conversationId: number) =>
                `/messaging/conversation/${conversationId}/unread/reset`,
        },
        attachments: {
            download: (attachmentId: number) =>
                `/attachment/download/${attachmentId}`,
        },
    },
    broadcast: '/broadcasting/auth',
};
