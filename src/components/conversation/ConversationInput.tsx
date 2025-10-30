import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Plus, Send, Smile } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from '../ui/textarea';
import PresendPreview from './attachment/PresendPreview';

const EmojiPicker = React.lazy(() => import('emoji-picker-react'));

interface ConversationInputProps {
    conversation: Conversation;
    handleSend: (
        messageText: string,
        attachments: Attachment[],
        conversation: Conversation
    ) => Promise<
        void | Message | { conversation: Conversation; message: Message }
    >;
    sending: boolean;
}

const ConversationInput = ({
    conversation,
    handleSend,
    sending,
}: ConversationInputProps) => {
    const input = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [files, setFiles] = useState<Attachment[]>([]);

    const handleSendMessage = async () => {
        if (sending) return;
        if (value.trim() === '' && files.length === 0) return;

        const messageText = value;
        const messageFiles = [...files];

        setValue('');
        setFiles([]);

        try {
            await handleSend(messageText, messageFiles, conversation);

            setValue('');
            setFiles([]);
            files.forEach((file) => URL.revokeObjectURL(file.url));
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() !== '' || files.length > 0) {
                handleSendMessage();
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        setTimeout(adjustHeight, 10);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        const updatedFiles = [...selectedFiles].map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setFiles((prev) => [...prev, ...updatedFiles]);
    };

    const removeFile = (name: string) => {
        setFiles((prevFiles) => {
            const fileToRemove = prevFiles.find((f) => f.file.name === name);
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.url);
            }
            return prevFiles.filter((f) => f.file.name !== name);
        });
    };

    const adjustHeight = () => {
        if (input.current) {
            input.current.style.height = 'auto';
            input.current.style.height = `${input.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    useEffect(() => {
        input.current?.focus();
    }, [conversation]);

    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.url));
        };
    }, []);

    return (
        <div className={cn('flex flex-col transition duration-500')}>
            {files.length > 0 && (
                <PresendPreview files={files} removeFile={removeFile} />
            )}

            <div className='flex items-center gap-x-2 p-4'>
                <div className='flex-1 flex items-center rounded-full relative'>
                    <Popover
                        open={isPopoverOpen}
                        onOpenChange={setIsPopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                disabled={sending}
                                className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-transparent z-10'
                            >
                                <Smile className='size-5' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            side='top'
                            align='start'
                            className='w-auto p-0 border-0 shadow-lg'
                            sideOffset={10}
                        >
                            {isPopoverOpen && (
                                <EmojiPicker
                                    lazyLoadEmojis
                                    previewConfig={{ showPreview: false }}
                                    onEmojiClick={(ev) => {
                                        setValue(value + ev.emoji);
                                        setIsPopoverOpen(false);
                                    }}
                                />
                            )}
                        </PopoverContent>
                    </Popover>

                    <Textarea
                        ref={input}
                        autoFocus
                        value={value}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                        placeholder='Write a message'
                        className='bg-transparent max-h-20 flex-1 border-none shadow-none resize-none custom-scrollbar pl-12 min-h-[2.5rem] py-2 focus-visible:ring-0'
                        rows={1}
                        disabled={sending}
                    />
                </div>

                <label
                    className={cn(
                        'size-10 flex items-center justify-center border border-secondary-content rounded-full cursor-pointer',
                        sending && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <input
                        type='file'
                        multiple
                        onChange={handleFileChange}
                        className='hidden'
                        disabled={sending}
                    />
                    <Plus className='size-4' />
                </label>

                <Button
                    disabled={
                        (value.trim() === '' && files.length === 0) || sending
                    }
                    onClick={handleSendMessage}
                    className='size-10 p-0 bg-periBlue hover:bg-periBlue/90 disabled:bg-periBlue/50 rounded-full'
                >
                    <Send className='size-4 text-primary' />
                </Button>
            </div>
        </div>
    );
};

export default ConversationInput;
