// export type ConversationSubject = {
//     type: 'private' | 'group';
//     id: string;
//     type_id: string;
//     name: string;
//     avatar: string | null;
//     last_message: string | null;
//     last_message_sender_id: string | null;
//     last_message_date: Date | null;
//     unread_messages_count: number;
//     last_message_attachment_count: number;
// };

export type ConversationSubjectResponse = {
    message: string;
    data: BackendConversation[];
};

export type ConversationSuggestionResponse = {
    message: string;
    data: { users: User[]; groups: Group[] };
};
