import {
	messageCreated,
	messageUnreadIncremented,
	messageUnreadReset,
} from '@/actions/event-bus-actions';
import { fetchConversation } from '@/actions/fetch-conversation-subjects';
import SortConversation from '@/actions/sort-conversation';
import useEventBus from '@/context/EventBus';
import { useEffect, useState } from 'react';

export function useConversations() {
	const [fetched, setFetched] = useState<Conversation[]>([]);
	const [local, setLocal] = useState<Conversation[]>([]);
	const [sorted, setSorted] = useState<Conversation[]>([]);
	const [filter, setFilter] = useState<'all' | 'private' | 'group'>('all');
	const [searchText, setSearchText] = useState('');

	const { on } = useEventBus();

	// EventBus listeners
	useEffect(() => {
		const offCreated = on('message.created', (message: Message) =>
			messageCreated(message, setLocal)
		);
		const offIncrement = on('unread.increment', (message: Message) =>
			messageUnreadIncremented(message, setLocal)
		);
		const offReset = on('unread.reset', (conversation: Conversation) =>
			messageUnreadReset(conversation, setLocal)
		);

		return () => {
			offCreated();
			offIncrement();
			offReset();
		};
	}, [on]);

	// initial conversation fetch
	useEffect(() => {
		let isMounted = true;

		fetchConversation()
			.then((c) => {
				isMounted && setFetched(c);
			})
			.catch((err) => {
				isMounted && console.error(err);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	// Handle filter + search
	useEffect(() => {
		let filtered = [...fetched];

		if (filter !== 'all') {
			filtered = filtered.filter((c) => c.type === filter);
		}

		if (searchText !== '') {
			filtered = filtered.filter((c) =>
				c.name.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		setLocal(filtered);
	}, [filter, searchText, fetched]);

	// Sort when local conversation updates
	useEffect(() => {
		setSorted(SortConversation(local));
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
