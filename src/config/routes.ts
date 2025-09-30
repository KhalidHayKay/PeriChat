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
            messages: (conversationId: number) =>
                `/conversation/${conversationId}`,
            // attachments: (conversationId: string) =>
            //     `/conversation/${conversationId}/attachments`,
            newUsers: '/conversation/new/users',
            newGroups: '/conversation/new/groups',
            newGroupUsers: '/conversation/new/group-users',
        },
        message: {
            send: '/message/send',
            loadOlder: (lastMessageId: number) =>
                `/message/load-older/${lastMessageId}`,
        },
        attachments: {
            download: (attachmentId: number) =>
                `/attachment/download/${attachmentId}`,
        },
        search: {
            users: '/search/users',
            messages: '/search/messages',
        },
    },
};
