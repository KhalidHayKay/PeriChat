import { increment, resetUnread } from '@/actions/message-unread-actions';
import SortConversation from '@/actions/sort-conversation';
import ConversationItem from '@/Components/app/conversation/ConversationItem';
import ConversationSearch from '@/Components/app/ConversationSearch';
import useEventBus from '@/context/EventBus';
import useOnlineUsers from '@/context/OnlineUsers';
import { ConversationTypeEnum } from '@/enums/enums';
import { cn } from '@/utils/utils';
import { Button } from '@headlessui/react';
import { usePage } from '@inertiajs/react';
import { PenBox } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ChatLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const props = usePage().props;
	const user = props.auth.user;
	const conversations = props.conversations as Conversation[];
	const selectedConversation = props.selectedConversation as Conversation;

	const [localConversation, setLocalConversation] = useState<Conversation[]>(
		[]
	);
	const [sortedConversation, setSortedConversation] = useState<
		Conversation[]
	>([]);
	const [filter, setFilter] = useState<'all' | 'private' | 'group'>('all');
	const [searchText, setSearchText] = useState('');

	const { emit, on } = useEventBus();
	const { checkIfUserIsOnline } = useOnlineUsers();

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	const messageCreated = (message: Message) => {
		setLocalConversation((prev) => {
			return prev.map((c) => {
				if (
					c.type === ConversationTypeEnum.PRIVATE &&
					!message.groupId &&
					(c.typeId === message.senderId ||
						c.typeId === message.receiverId)
				) {
					c.lastMessage = message.message;
					c.lastMessageDate = message.createdAt;
					c.lastMessageSenderId = message.senderId;
					return c;
				}

				if (
					c.type === ConversationTypeEnum.GROUP &&
					c.typeId === message.groupId
				) {
					c.lastMessage = message.message;
					c.lastMessageDate = message.createdAt;
					c.lastMessageSenderId = message.senderId;
					return c;
				}

				return c;
			});
		});
	};

	const messageUnreadIncremented = (message: Message) => {
		setLocalConversation((prev) => {
			return prev.map((c) => {
				if (
					c.type === ConversationTypeEnum.PRIVATE &&
					!message.groupId &&
					(c.typeId === message.senderId ||
						c.typeId === message.receiverId)
				) {
					c.unreadMessageCount++;
					increment(message.id);
					return c;
				} else if (
					c.type === ConversationTypeEnum.GROUP &&
					c.typeId === message.groupId
				) {
					c.unreadMessageCount++;
					increment(message.id);
					return c;
				}

				return c;
			});
		});
	};

	const messageUnreadReset = (conversation: Conversation) => {
		console.log('Resetting unread count for conversation', conversation);

		// 1. Update local state
		setLocalConversation((prev) => {
			return prev.map((c) => {
				console.log(c.id, conversation.id);
				if (c.id === conversation.id) {
					return { ...c, unreadMessageCount: 0 };
				}
				return c;
			});
		});

		// 2. Call backend for THIS conversation
		resetUnread(conversation.id); // not selectedConversation.id
	};

	useEffect(() => {
		const offCreated = on('message.created', messageCreated);
		const offIncrement = on('unread.increment', messageUnreadIncremented);
		const offReset = on('unread.reset', messageUnreadReset);

		return () => {
			offCreated();
			offIncrement();
			offReset();
		};
	}, [on]);

	useEffect(() => {
		let filteredConversations = [...conversations];

		if (filter !== 'all') {
			filteredConversations = filteredConversations.filter(
				(c) => c.type === filter.toLowerCase()
			);
		}

		if (searchText !== '') {
			filteredConversations = filteredConversations.filter((c) =>
				c.name.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		setLocalConversation(filteredConversations);
	}, [filter, searchText, conversations]);

	useEffect(() => {
		setSortedConversation(SortConversation(localConversation));
	}, [localConversation]);

	useEffect(() => {
		conversations.forEach((conversation) => {
			let channel = `message.group.${conversation.typeId}`;

			if (conversation.type === ConversationTypeEnum.PRIVATE) {
				channel = `message.private.${[user.id, conversation.typeId]
					.sort((a, b) => a - b)
					.join('-')}`;
			}

			// console.log('listening to channel ' + channel);
			window.Echo.private(channel)
				.listen('SocketMessage', (e: { message: Message }) => {
					const message = e.message;

					emit('message.created', message);

					if (message.senderId === user.id) {
						return;
					}

					if (
						selectedConversation &&
						selectedConversation.type ===
							ConversationTypeEnum.PRIVATE &&
						!message.groupId &&
						selectedConversation.typeId === message.senderId
					) {
						return;
					}

					if (
						selectedConversation &&
						selectedConversation.type ===
							ConversationTypeEnum.GROUP &&
						selectedConversation.typeId === message.groupId
					) {
						return;
					}

					toast('New message notification');

					emit('unread.increment', message);
				})
				.error((err: any) => {
					console.error(err);
				});
		});

		return () => {
			conversations.forEach((conversation) => {
				let channel = `message.group.${conversation.typeId}`;

				if (conversation.type === ConversationTypeEnum.PRIVATE) {
					channel = `message.private.${[user.id, conversation.typeId]
						.sort((a, b) => a - b)
						.join('-')}`;
				}

				// console.log('Leaving channel ' + channel);
				window.Echo.leave(channel);
			});
		};
	}, [conversations]);

	return (
		<>
			<div
				className={cn(
					'flex-1 size-full h-screen flex sm:p-2 overflow-hidden',
					selectedConversation ? 'gap-x-0 sm:gap-x-2' : 'gap-x-2'
				)}
			>
				<aside
					className={cn(
						'transition duration-100',
						'h-full w-full sm:w-[300px] md:w-[370px] lg:w-[450px] bg-primary py-4 rounded-lg shadow space-y-5',
						selectedConversation ? '-ml-[100%] sm:-ml-0' : ''
					)}
				>
					<header className='px-4 mobile:px-10 sm:px-4 space-y-5'>
						<ConversationSearch
							user={user}
							online={checkIfUserIsOnline(user.id)}
							search={{
								text: searchText,
								set: setSearchText,
								handler: handleSearch,
							}}
						/>

						<div className='grid grid-cols-3 bg-secondary rounded-full p-2 font-semibold text-secondary-content'>
							<button
								onClick={() => setFilter('all')}
								className={cn(
									'rounded-full py-1.5',
									filter === 'all'
										? 'bg-primary shadow-sm text-periBlue'
										: 'bg-transparent text-primary-content shadow-none'
								)}
							>
								All
							</button>
							<button
								onClick={() => setFilter('private')}
								className={cn(
									'rounded-full py-1.5',
									filter === 'private'
										? 'bg-primary shadow-sm text-periBlue'
										: 'bg-transparent text-primary-content shadow-none'
								)}
							>
								Private
							</button>
							<button
								onClick={() => setFilter('group')}
								className={cn(
									'rounded-full py-1.5',
									filter === 'group'
										? 'bg-primary shadow-sm text-periBlue'
										: 'bg-transparent text-primary-content shadow-none'
								)}
							>
								Group
							</button>
						</div>
					</header>

					<div className='max-h-[calc(100%-135px)] pl-1 mobile:px-5 sm:pl-1 sm:pr-0 overflow-y-auto custom-scrollbar'>
						<div className='flex items-center justify-between mb-3 px-3 mobile:px-5 sm:px-3'>
							<h2 className='text-secondary-content font-semibold ml-1'>
								Messages
							</h2>

							<Button>
								<PenBox className='size-5' />
							</Button>
						</div>
						<div className='space-y-1'>
							{sortedConversation.map((conversation) => (
								<ConversationItem
									key={
										`${conversation.type === ConversationTypeEnum.GROUP ? 'group_' : 'user_'}` +
										conversation.typeId
									}
									user={user}
									conversation={conversation}
									online={
										conversation.type ===
										ConversationTypeEnum.PRIVATE
											? checkIfUserIsOnline(
													conversation.typeId
												)
											: undefined
									}
									selectedConversation={selectedConversation}
								/>
							))}
						</div>
					</div>
				</aside>
				<main className='flex-1 bg-primary rounded-lg shadow overflow-hidden'>
					{children}
				</main>
			</div>
		</>
	);
};

export default ChatLayout;
