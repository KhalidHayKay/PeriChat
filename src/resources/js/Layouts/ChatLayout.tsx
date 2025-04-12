import SortConversation from '@/actions/sort-conversation';
import Avatar from '@/Components/app/Avatar';
import ConversationItem from '@/Components/app/conversation/ConversationItem';
import useEventBus from '@/context/EventBus';
import useOnlineUsers from '@/context/OnlineUsers';
import { ConversationTypeEnum } from '@/enums/ConversationTypeEnum';
import { cn } from '@/utils/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { MessageSquareTextIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ChatLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const props = usePage().props;
	const user = props.auth.user;
	const conversations = props.conversations as Conversation[];
	const selectedConversation = props.selectedConversation as Conversation;

	const [localConversation, setLocalConversation] = useState<Conversation[]>(
		[]
	);
	// console.log(localConversation);
	const [sortedConversation, setSortedConversation] = useState<
		Conversation[]
	>([]);

	const { emit, on } = useEventBus();
	const { checkIfUserIsOnline } = useOnlineUsers();

	const incrementUnreadCount = (id: number) => {
		axios
			.post(route('message.incrementUnread', id))
			.catch((err) => console.error(err));
	};

	const messageCreated = (message: Message) => {
		setLocalConversation((prev) => {
			return prev.map((c) => {
				if (
					c.type === ConversationTypeEnum.PRIVATE &&
					!message.groupId &&
					(c.id === message.senderId || c.id === message.receiverId)
				) {
					c.lastMessage = message.message;
					c.lastMessageDate = message.createdAt;

					if (
						// !selectedConversation ||
						selectedConversation?.id !== message.senderId
					) {
						const count = c.unreadMessageCount++;
						incrementUnreadCount(message.id);
					}

					return c;
				}

				if (
					c.type === ConversationTypeEnum.GROUP &&
					c.id === message.groupId
				) {
					c.lastMessage = message.message;
					c.lastMessageDate = message.createdAt;
					return c;
				}

				return c;
			});
		});
	};

	useEffect(() => {
		const offCreated = on('message.created', messageCreated);

		return () => {
			offCreated();
		};
	}, [on]);

	useEffect(() => {
		setSortedConversation(SortConversation(localConversation));
	}, [localConversation]);

	useEffect(() => {
		setLocalConversation(conversations);
	}, [conversations]);

	useEffect(() => {
		conversations.forEach((conversation) => {
			let channel = `message.group.${conversation.id}`;

			if (conversation.type === ConversationTypeEnum.PRIVATE) {
				channel = `message.private.${[user.id, conversation.id]
					.sort((a, b) => a - b)
					.join('-')}`;
			}

			// console.log('start listening to channel ' + channel);

			window.Echo.private(channel)
				.listen('SocketMessage', (e: { message: Message }) => {
					const message = e.message;

					emit('message.created', message);

					if (message.senderId === user.id) {
						return;
					}

					emit('newMessageNotification', {
						user: message.sender,
						groupId: message.groupId,
						message:
							message.message ||
							`shared ${
								message.attachments?.length === 1
									? 'an attachment'
									: message.attachments?.length +
										' attachments'
							}`,
					});

					emit('incremenetUnread', {
						receiver: message.receiverId,
					});
				})
				.error((err: any) => {
					console.error(err);
				});
		});

		return () => {
			conversations.forEach((conversation) => {
				let channel = `message.group.${conversation.id}`;

				if (conversation.type === ConversationTypeEnum.PRIVATE) {
					channel = `message.private.${[user.id, conversation.id]
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
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-x-2'>
								<Avatar
									avatarUrl={user.avatar ?? null}
									online={checkIfUserIsOnline(user.id)}
									isProfile={true}
								/>
								<div className=''>
									<h1 className='text-lg font-semibold'>
										{user.name}
									</h1>
									<p className='text-primary-content'>
										Account info
									</p>
								</div>
							</div>
							<div>
								<MagnifyingGlassIcon className='size-7 text-secondary-content' />
							</div>
						</div>
						<div className='grid grid-cols-3 bg-secondary rounded-full p-2 font-semibold text-secondary-content'>
							<button className='rounded-full py-1.5 bg-primary shadow-sm text-periBlue'>
								All
							</button>
							<button className='rounded-full py-1.5'>
								Personal
							</button>
							<button className='rounded-full py-1.5'>
								Group
							</button>
						</div>
					</header>

					<div className='max-h-[calc(100%-135px)] overflow-y-auto custom-scrollbar'>
						<div className='space-y-5 pl-1 mobile:px-5 sm:pl-1 sm:pr-0'>
							{/* <div>
								<div className='flex items-center justify-between mb-5'>
									<h2 className='text-secondary-content font-semibold ml-1'>
										Pinned Messages
									</h2>
									<Pin className='size-5' />
								</div>
								<div className='space-y-5'>
									<ChatItem />
								</div>
							</div> */}
							<div>
								<div className='flex items-center justify-between mb-3 px-3 mobile:px-5 sm:px-3'>
									<h2 className='text-secondary-content font-semibold ml-1'>
										Messages
									</h2>
									<MessageSquareTextIcon className='size-5' />
								</div>
								<div className='space-y-1'>
									{sortedConversation.map((conversation) => (
										<ConversationItem
											key={
												`${conversation.type === ConversationTypeEnum.GROUP ? 'group_' : 'user_'}` +
												conversation.id
											}
											user={user}
											conversation={conversation}
											online={
												conversation.type ===
												ConversationTypeEnum.PRIVATE
													? checkIfUserIsOnline(
															conversation.id
														)
													: undefined
											}
											selectedConversation={
												selectedConversation
											}
										/>
									))}
								</div>
							</div>
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
