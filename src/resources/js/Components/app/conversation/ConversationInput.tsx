import { ConversationTypeEnum } from '@/enums/ConversationTypeEnum';
import { Textarea } from '@headlessui/react';
import { DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';
import axios, { AxiosError } from 'axios';
import { Plus, Send, Smile } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

const ConversationInput = ({
	conversation,
}: {
	conversation: Conversation;
}) => {
	const input = useRef<HTMLTextAreaElement>();
	const [value, setvalue] = useState('');
	const [sending, setSending] = useState(false);

	const sendMessage = async () => {
		if (sending) return;

		if (value.trim() !== '') {
			const formData = new FormData();
			formData.append('message', value);
			if (conversation.type === ConversationTypeEnum.PRIVATE) {
				formData.append('receiver_id', `${conversation.id}`);
			} else if (conversation.type === ConversationTypeEnum.GROUP) {
				formData.append('group_id', `${conversation.id}`);
			}

			setSending(true);

			try {
				const res = await axios.post(route('message.store'), formData, {
					onUploadProgress: (ProgressEvent) => {
						if (ProgressEvent.total) {
							const progress = Math.round(
								(ProgressEvent.loaded / ProgressEvent.total) *
									100
							);
							console.log('progress: ', progress);
						}
					},
				});

				// console.log(res);
				setvalue('');
				setSending(false);
			} catch (err) {
				if (err instanceof AxiosError) {
					console.log(err.response?.data);
				}
				console.log(err);
			}
		}

		return;
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (value.trim() !== '') {
				sendMessage();
			}
		}
	};

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setTimeout(() => {
			adjustHeight();
		}, 10);
		setvalue(e.target.value);
	};

	const adjustHeight = () => {
		setTimeout(() => {
			if (input.current) {
				input.current.style.height = 'auto';
				input.current.style.height = `${input.current.scrollHeight}px`;
			}
		}, 100);
	};

	useEffect(() => {
		adjustHeight();
	}, [value]);

	useEffect(() => {
		input.current?.focus();
	}, [conversation]);

	return (
		<div className='flex items-center gap-x-2 p-4'>
			<div className='flex-1  relative rounded-full'>
				<Smile className='absolute left-3 top-1/2 -translate-y-1/2 size-5 cursor-pointer' />
				<Textarea
					ref={input as React.Ref<HTMLTextAreaElement>}
					rows={1}
					autoFocus
					value={value}
					onKeyDown={(e) => handleKeyDown(e as any)}
					onChange={(e) => handleChange(e)}
					placeholder='Write a message'
					className='bg-transparent max-h-20 w-[90%] border-none focus:ring-0 float-right resize-none custom-scrollbar'
				/>
			</div>

			<div className='dropdown dropdown-top dropdown-left'>
				<div
					tabIndex={0}
					className='size-10 flex items-center justify-center border border-secondary-content rounded-full cursor-pointer'
				>
					<Plus className='size-4' />
				</div>
				<ul
					tabIndex={0}
					className='dropdown-content menu bg-primary rounded-box z-2 w-[220px] p-1 !px-0 shadow translate-x-1/3 -translate-y-2'
				>
					<li className='relative hover:bg-secondary/50'>
						<div className='flex items-center gap-x-2'>
							<PhotoIcon className='size-5 text-primary-content' />
							<p className='text-base'>Photos and Videos</p>
						</div>
						<input
							type='file'
							multiple
							className='absolute top-0 bottom-0 right-0 left-0 z-20 opacity-0 p-0'
						/>
					</li>
					<li className='relative hover:bg-secondary/50'>
						<input
							type='file'
							multiple
							className='absolute top-0 bottom-0 right-0 left-0 z-20 opacity-0'
						/>
						<div className='flex items-center gap-x-2'>
							<DocumentIcon className='size-5 text-primary-content' />
							<p className='text-base'>Documents</p>
						</div>
					</li>
				</ul>
			</div>
			<button
				disabled={value.trim() === ''}
				onClick={sendMessage}
				className='size-10 flex items-center justify-center bg-periBlue disabled:bg-periBlue/50 rounded-full cursor-pointer disabled:cursor-auto'
			>
				<Send className='size-4 text-primary' />
			</button>
		</div>
	);
};

export default ConversationInput;
