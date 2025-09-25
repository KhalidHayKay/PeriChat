import { ConversationTypeEnum } from '@/enums/enums';
import { cn } from '@/utils/utils';
import {
	Popover,
	PopoverButton,
	PopoverPanel,
	Textarea,
} from '@headlessui/react';
import axios, { AxiosError } from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { Plus, Send, Smile } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import PresendPreview from './attachment/PresendPreview';

const ConversationInput = ({
	conversation,
}: {
	conversation: Conversation;
}) => {
	const input = useRef<HTMLTextAreaElement>();
	const [value, setvalue] = useState('');
	const [sending, setSending] = useState(false);
	const [files, setFiles] = useState<Attachment[]>([]);
	const [uploadProgress, setUploadProgress] = useState(0);

	const sendMessage = async () => {
		if (sending) return;

		if (value.trim() !== '' || files.length > 0) {
			const formData = new FormData();

			files.forEach((file) =>
				formData.append('attachments[]', file.file)
			);
			formData.append('message', value);

			if (conversation.type === ConversationTypeEnum.PRIVATE) {
				formData.append('receiver_id', `${conversation.typeId}`);
			} else if (conversation.type === ConversationTypeEnum.GROUP) {
				formData.append('group_id', `${conversation.typeId}`);
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
							// console.log('progress: ', progress);
							setUploadProgress(progress);
						}
					},
				});

				setvalue('');
				setSending(false);
				setUploadProgress(0);
				setFiles([]);
			} catch (err) {
				setFiles([]);
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

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files;

		if (!selectedFiles) return;

		const updatedFiles = [...selectedFiles].map((file) => {
			return {
				file,
				url: URL.createObjectURL(file),
			};
		});

		setFiles((prev) => [...prev, ...updatedFiles]);
	};

	const removeFile = (name: string) => {
		setFiles((prevFiles) => {
			const fileToRemove = prevFiles.find((f) => f.file.name === name);
			if (fileToRemove) {
				URL.revokeObjectURL(fileToRemove.url); // Clean up URL
			}
			return prevFiles.filter((f) => f.file.name !== name);
		});
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
		<div className={cn('flex flex-col transition duration-500')}>
			{files.length > 0 && (
				<PresendPreview files={files} removeFile={removeFile} />
			)}

			<div className='flex items-center gap-x-2 p-4'>
				<div className='flex-1 flex rounded-full'>
					<Popover className='relative flex-1'>
						<PopoverButton>
							<Smile className='absolute left-3 top-1/2 -translate-y-1/2 size-5 cursor-pointer' />
						</PopoverButton>
						<PopoverPanel
							transition
							// anchor='bottom'
							className='absolute z-10 bottom-[110%] left-0 transition duration-200 ease-in-out'
						>
							<EmojiPicker
								lazyLoadEmojis
								previewConfig={{ showPreview: false }}
								onEmojiClick={(ev) =>
									setvalue(value + ev.emoji)
								}
							/>
						</PopoverPanel>
					</Popover>

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

				<div
					tabIndex={0}
					className='size-10 flex items-center justify-center border border-secondary-content rounded-full relative'
				>
					<input
						type='file'
						multiple
						onChange={handleFileChange}
						className='absolute top-0 bottom-0 right-0 left-0 z-20 opacity-0 p-0'
					/>
					<Plus className='size-4' />
				</div>
				<button
					disabled={value.trim() === '' && files.length === 0}
					onClick={sendMessage}
					className='size-10 flex items-center justify-center bg-periBlue disabled:bg-periBlue/50 rounded-full cursor-pointer disabled:cursor-auto'
				>
					<Send className='size-4 text-primary' />
				</button>
			</div>
		</div>
	);
};

export default ConversationInput;
