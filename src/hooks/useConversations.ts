import { sortConversations } from '@/actions/conversation';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useMemo, useState } from 'react';

export function useConversations() {
    const [filter, setFilter] = useState<'all' | 'private' | 'group'>('all');
    const [searchText, setSearchText] = useState('');
    const { conversations } = useConversationContext();

    // Combine filtering and sorting in one memoized operation
    const sorted = useMemo(() => {
        let filtered = conversations;

        if (filter !== 'all') {
            filtered = filtered.filter((c) => c.type === filter);
        }

        if (searchText) {
            filtered = filtered.filter((c) =>
                c.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return sortConversations(filtered);
    }, [conversations, filter, searchText]);

    return {
        sorted,
        filter,
        setFilter,
        searchText,
        setSearchText,
    };
}
