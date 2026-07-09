import type { BackendMessage } from '@/lib/utils';

export type CreateMessageResponse = {
    message: string;
    data: BackendMessage;
};

export type CreateFirstMessageResponse = {
    message: string;
    data: {
        message: BackendMessage;
        conversation: BackendConversation;
    };
};

export type FetchMessageResponse = {
    message: string;
    data: {
        messages: BackendMessage[];
        hasMore: boolean;
    };
};
