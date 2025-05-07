import { isImage, isVideo } from '@/actions/file-check';
import useEventBus from '@/context/EventBus';
import { cn } from '@/utils/utils';
import axios, { AxiosError } from 'axios';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DisplayModal from './attachment/DisplayModal';
import MessageAttachment from './attachment/MessageAttachment';

const ConversationMessages = ({
	messages,
	setMessages,
	selectedConversation,
	user,
}: {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	selectedConversation: Conversation;
	user: User;
}) => {
	const conversationCtrRef = useRef<HTMLDivElement | null>(null);
	const loadOlderMessageIntercept = useRef<HTMLDivElement | null>(null);

	const [scrollFromBottom, setScrollFromBottom] = useState(0);
	const [noOlderMessages, setNoOlderMessages] = useState(false);
	const [viewData, setViewData] = useState<{
		attachments: ServerAttachment[];
		index: number;
	} | null>(null);

	const { emit } = useEventBus();

	const loadOlderMessages = useCallback(async () => {
		// if (noOlderMessages) {
		// 	return;
		// }

		const lastMessage = messages[0];

		try {
			const res = await axios.get(
				route('message.loadOlder', lastMessage.id)
			);

			const olderMessages = res.data.data as Message[];

			if (olderMessages.length === 0) {
				setNoOlderMessages(true);
				return;
			}

			if (!conversationCtrRef.current) {
				throw new Error("'conversationCtrRef.current' is null");
			}

			const scrollHeight = conversationCtrRef.current.scrollHeight;
			const scrollTop = conversationCtrRef.current.scrollTop;
			const clientHeight = conversationCtrRef.current.clientHeight;
			const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;

			setScrollFromBottom(tmpScrollFromBottom);

			setMessages((prev) => [...olderMessages.reverse(), ...prev]);
		} catch (err) {
			if (err instanceof AxiosError) {
				console.error(err.response?.data);
			} else {
				console.error(err);
			}
		}
	}, [messages, noOlderMessages]);

	const onAttachmentClick = (
		attachments: ServerAttachment[],
		index: number
	) => {
		setViewData({ attachments, index });
	};

	if (selectedConversation.unreadMessageCount > 0) {
		setTimeout(() => {
			emit('unread.reset', selectedConversation);
		}, 0);
	}

	useEffect(() => {
		setTimeout(() => {
			if (conversationCtrRef.current) {
				conversationCtrRef.current.scrollTop =
					conversationCtrRef.current.scrollHeight;
			}
		}, 10);

		setScrollFromBottom(0);
		setNoOlderMessages(false);
	}, [selectedConversation]);

	useEffect(() => {
		if (conversationCtrRef.current) {
			conversationCtrRef.current.scrollTop =
				conversationCtrRef.current.scrollHeight -
				conversationCtrRef.current.offsetHeight -
				scrollFromBottom;
		}

		if (noOlderMessages) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach(
					(entry) => entry.isIntersecting && loadOlderMessages()
				),
			{
				rootMargin: '0px 0px 250px 0px',
			}
		);

		if (loadOlderMessageIntercept.current) {
			setTimeout(() => {
				observer.observe(
					loadOlderMessageIntercept.current as HTMLDivElement
				);
			}, 100);
		}

		return () => {
			observer.disconnect();
		};
	}, [messages]);

	return (
		<>
			<DisplayModal data={viewData} onClose={() => setViewData(null)} />

			<div
				ref={conversationCtrRef}
				className='max-h-full px-2 py-5 space-y-2 overflow-y-auto custom-scrollbar'
			>
				<div ref={loadOlderMessageIntercept}></div>
				{messages.map((message) => {
					const displayableAttachments = message.attachments?.filter(
						(att) => isImage(att) || isVideo(att)
					);

					const unDisplayableAttachments =
						message.attachments?.filter(
							(att) => !isImage(att) && !isVideo(att)
						);

					const hasText =
						messages.find((m) => m.id === message.id)?.message !==
						'';

					return (
						<div
							key={message.id}
							className={cn(
								'chat',
								message.senderId === user.id
									? 'chat-end'
									: 'chat-start'
							)}
						>
							<div
								className={cn(
									'chat-header flex items-center gap-x-1',
									message.senderId === user.id
										? 'mr-1'
										: 'ml-1'
								)}
							>
								{message.groupId && (
									<div className='font-semibold inline'>
										{message.sender.name !== user.name
											? message.sender.name
											: 'You'}
									</div>
								)}
								<time className='text-[0.8rem]'>
									{format(
										message.createdAt,
										'MMM dd, hh:mm aa'
									)}
								</time>
							</div>
							<div
								className={cn(
									'size-full max-w-[90%] flex flex-col',
									message.senderId === user.id
										? 'col-start-1 items-end'
										: 'col-start-2'
								)}
							>
								<div
									className={cn(
										'chat-bubble max-w-full shadow-sm rounded-xl before:size-0',
										message.senderId === user.id
											? 'bg-periBlue text-secondary'
											: 'chat-bubble-primary',
										message.attachments && !message.message
											? 'hidden'
											: ''
									)}
								>
									<p>{message.message}</p>
								</div>
								{displayableAttachments &&
									displayableAttachments.length > 0 && (
										<div
											className={cn(
												'mt-1 grid w-fit',
												displayableAttachments.length >
													1
													? 'grid-cols-2 mobile:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 justify-end gap-3'
													: 'grid-cols-1',
												message.senderId === user.id
													? ' [direction:rtl]'
													: '[direction:ltr]'
											)}
										>
											<MessageAttachment
												attachments={
													displayableAttachments as ServerAttachment[]
												}
												senderIsUser={
													message.senderId === user.id
												}
												onAttachmentClick={(
													index: number
												) =>
													onAttachmentClick(
														displayableAttachments as ServerAttachment[],
														index
													)
												}
											/>
										</div>
									)}
								{unDisplayableAttachments &&
									unDisplayableAttachments.length > 0 && (
										<div
											className={cn('mt-1 grid gap-y-2')}
										>
											<MessageAttachment
												senderIsUser={
													message.senderId === user.id
												}
												attachments={
													unDisplayableAttachments as ServerAttachment[]
												}
												hasText={hasText}
											/>
										</div>
									)}
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default ConversationMessages;
