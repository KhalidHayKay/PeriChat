import { sortConversations } from '@/actions/conversation';
import { useChatContext } from '@/contexts/ChatContext';
import { useEffect, useState } from 'react';

export function useConversations() {
    const { conversations } = useChatContext();
    const [local, setLocal] = useState<Conversation[]>([]);
    const [sorted, setSorted] = useState<Conversation[]>([]);
    const [filter, setFilter] = useState<'all' | 'private' | 'group'>('all');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        let filtered = [...conversations]; // Use conversations from context

        if (filter !== 'all') {
            filtered = filtered.filter((c) => c.type === filter);
        }

        if (searchText !== '') {
            filtered = filtered.filter((c) =>
                c.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setLocal(filtered);
    }, [filter, searchText, conversations]);

    useEffect(() => {
        setSorted(sortConversations(local));
    }, [local]);

    return {
        local,
        setLocal,
        sorted,
        filter,
        setFilter,
        searchText,
        setSearchText,
    };
}
