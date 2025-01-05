import SortConversation from '@/actions/sort-conversation';
import Avatar from '@/Components/app/conversation/Avatar';
import ConversationItem from '@/Components/app/conversation/ConversationItem';
import { cn } from '@/utils/cn';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';
import { MessageSquareTextIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ChatLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const page = usePage();
	const user = page.props.auth.user;
	const conversations = page.props.conversations as [];
	const selectedConversation = page.props.selectedConversation;
	console.log(conversations);

	const [onlineUsers, setOnlineUsers] = useState<{ [key: number]: {} }>({});
	const [localConversation, setLocalConversation] = useState<Conversation[]>(
		[]
	);
	const [sortedConversation, setSortedConversation] = useState<
		Conversation[]
	>([]);

	const checkIfUserIsOnline = (userId: number) => !!onlineUsers[userId];

	useEffect(() => {
		setSortedConversation(SortConversation(localConversation));
	}, [localConversation]);

	useEffect(() => {
		setLocalConversation(conversations);
	}, [conversations]);

	useEffect(() => {
		window.Echo.join('online')
			.here((users: []) => {
				const onlineUsersObj = Object.fromEntries(
					users.map((user: { id: number }) => [user.id, user])
				);

				setOnlineUsers((prev) => {
					return { ...prev, ...onlineUsersObj };
				});
			})
			.joining((user: { id: number }) => {
				setOnlineUsers((prev) => {
					return { ...prev, [user.id]: user };
				});
			})
			.leaving((user: { id: number }) => {
				setOnlineUsers((prev: { [key: number]: {} }) => {
					delete prev[user.id];
					return prev;
				});
			})
			.error((error: any) => {
				console.error(error);
			});

		return () => window.Echo.leave('online');
	}, []);

	return (
		<>
			<div className='flex-1 size-full h-screen flex gap-x-2 sm:p-2'>
				<aside
					className={cn(
						'h-full w-full sm:w-[300px] md:w-[370px] lg:w-[450px] bg-primary py-4 rounded-lg shadow space-y-5'
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
										Khalid HayKay
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
												`${conversation.is_group ? 'group_' : 'user_'}` +
												conversation.id
											}
											conversation={conversation}
											online={checkIfUserIsOnline(
												conversation.is_user
													? conversation.id
													: 0
											)}
											selectedConversation={11}
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
