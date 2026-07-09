import type {
    BackendConversation,
    BackendGroup,
    BackendMessage,
} from '@/lib/dto';

export type AuthResponse = {
    message: string;
    user: User;
    token: string;
};

export type ConversationSubjectResponse = {
    message: string;
    data: BackendConversation[];
};

export type ConversationSuggestionResponse = {
    message: string;
    data: { users: User[]; groups: Group[] };
};

export type CreateGroupResponse = {
    message: string;
    data: BackendGroup;
};

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
