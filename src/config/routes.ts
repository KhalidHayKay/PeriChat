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
            subjects: '/conversation/subjects',
            newUsers: '/conversation/new/users',
            newGroups: '/conversation/new/groups',
            newGroupUsers: '/conversation/new/group-users',
        },
        message: {
            load: (conversationId: number) =>
                `/messaging/conversation/${conversationId}`,
            loadOlder: (conversationId: number, lastMessageId: number) =>
                `/messaging/conversation/${conversationId}/older/${lastMessageId}`,
            send: (conversationId: number) =>
                `/messaging/conversation/${conversationId}/send`,

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
