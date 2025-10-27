interface Group {
    id: number;
    name: string;
    avatar: string | null;
    description: string;
    userIds?: number[];
    owner: User;
    created: date;
}
