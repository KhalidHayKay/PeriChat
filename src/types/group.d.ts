interface Group {
    id: number;
    name: string;
    avatar: string | null;
    description: string | null;
    isPrivate: boolean;
    memberIds: number[];
    owner: User;
    createdAt: string;
    conversationId: number;
}
