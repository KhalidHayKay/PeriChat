import { cn } from '@/utils/cn';
import axios, { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CheckCheck } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
		<div
			ref={conversationCtrRef}
			className=' max-h-full px-2 py-5 space-y-2 overflow-y-auto custom-scrollbar'
		>
			<div ref={loadOlderMessageIntercept}></div>
			{messages.map((message) => (
				<div
					key={message.id}
					className={cn(
						'chat',
						message.senderId === user.id ? 'chat-end' : 'chat-start'
					)}
				>
					<div
						className={cn(
							'chat-header flex items-center gap-x-1',
							message.senderId === user.id ? 'mr-1' : 'ml-1'
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
							{/* {format(message.createdAt, 'hh:mm aaa')} */}
							{format(message.createdAt, 'MMM dd, hh:mm aaa')}
						</time>
					</div>
					<div
						className={cn(
							'chat-bubble shadow-sm rounded-xl',
							message.senderId === user.id
								? 'bg-periBlue'
								: 'chat-bubble-primary'
						)}
					>
						{message.message}
					</div>
					{!message.groupId && message.senderId === user.id && (
						<div className='chat-footer'>
							<CheckCheck className='size-4 mt-0.5 text-periBlue/70' />
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default ConversationMessages;
