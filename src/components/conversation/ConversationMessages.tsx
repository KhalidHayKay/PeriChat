import { isImage, isVideo } from '@/actions/file-check';
import { loadOlderMessages } from '@/actions/message';
import useEventBus from '@/contexts/EventBus';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ConversationMessagesError from '../errors/ConversationMessagesError';
import ConversationMessagesSkeleton from '../skeletons/ConversationMessagesSkeleton';
import DisplayModal from './attachment/DisplayModal';
import MessageAttachment from './attachment/MessageAttachment';

interface ConversationMessagesProps {
    // From useMessages hook
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    loading: boolean;
    error: string | null;
    // Component specific props
    selectedConversation: Conversation | null;
    user: User;
}

const ConversationMessages = ({
    messages,
    setMessages,
    loading,
    error,
    selectedConversation,
    user,
}: ConversationMessagesProps) => {
    const conversationCtrRef = useRef<HTMLDivElement | null>(null);
    const loadOlderMessageIntercept = useRef<HTMLDivElement | null>(null);

    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [noOlderMessages, setNoOlderMessages] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [viewData, setViewData] = useState<{
        attachments: ServerAttachment[];
        index: number;
    } | null>(null);

    const { emit } = useEventBus();

    // Reset unread count
    useEffect(() => {
        if (
            selectedConversation?.unreadMessageCount &&
            selectedConversation.unreadMessageCount > 0
        ) {
            const timeoutId = setTimeout(() => {
                emit('unread.reset', selectedConversation);
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [selectedConversation, emit]);

    // Load older messages using hook's function
    const handleLoadOlderMessages = useCallback(async () => {
        if (noOlderMessages || loadingOlder || messages.length === 0) {
            return;
        }

        const lastMessage = messages[0];
        setLoadingOlder(true);

        try {
            const { messages: olderMessages, hasMore } =
                await loadOlderMessages(lastMessage.id);

            if (!hasMore) {
                setNoOlderMessages(true);
                return;
            }

            if (!conversationCtrRef.current) {
                throw new Error("'conversationCtrRef.current' is null");
            }

            // Preserve scroll position
            const scrollHeight = conversationCtrRef.current.scrollHeight;
            const scrollTop = conversationCtrRef.current.scrollTop;
            const clientHeight = conversationCtrRef.current.clientHeight;
            const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;

            setScrollFromBottom(tmpScrollFromBottom);
            setMessages((prev) => [...olderMessages, ...prev]);
        } catch (err) {
            console.error('Failed to load older messages:', err);
        } finally {
            setLoadingOlder(false);
        }
    }, [
        messages,
        noOlderMessages,
        loadingOlder,
        loadOlderMessages,
        setMessages,
    ]);

    const onAttachmentClick = useCallback(
        (attachments: ServerAttachment[], index: number) => {
            setViewData({ attachments, index });
        },
        []
    );

    // Auto-scroll to bottom on conversation change
    useEffect(() => {
        if (selectedConversation && !loading) {
            setTimeout(() => {
                if (conversationCtrRef.current) {
                    conversationCtrRef.current.scrollTop =
                        conversationCtrRef.current.scrollHeight;
                }
            }, 10);
        }

        setScrollFromBottom(0);
        setNoOlderMessages(false);
    }, [selectedConversation, loading]);

    // Restore scroll position and setup intersection observer
    useEffect(() => {
        if (conversationCtrRef.current && scrollFromBottom > 0) {
            conversationCtrRef.current.scrollTop =
                conversationCtrRef.current.scrollHeight -
                conversationCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noOlderMessages || loading) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach(
                    (entry) => entry.isIntersecting && handleLoadOlderMessages()
                ),
            {
                rootMargin: '0px 0px 250px 0px',
            }
        );

        if (loadOlderMessageIntercept.current) {
            const timeout = setTimeout(() => {
                if (loadOlderMessageIntercept.current) {
                    observer.observe(loadOlderMessageIntercept.current);
                }
            }, 100);

            return () => {
                clearTimeout(timeout);
                observer.disconnect();
            };
        }

        return () => observer.disconnect();
    }, [
        messages,
        loading,
        noOlderMessages,
        handleLoadOlderMessages,
        scrollFromBottom,
    ]);

    // Loading state
    if (loading) return <ConversationMessagesSkeleton />;

    // Error state
    if (error) return <ConversationMessagesError error={error} />;

    // Empty state
    if (messages.length === 0) {
        return (
            <div className='h-full flex items-center justify-center p-8'>
                <div className='text-center space-y-2'>
                    <p className='text-muted-foreground text-lg'>
                        No messages yet
                    </p>
                    <p className='text-muted-foreground text-sm'>
                        Start the conversation by sending a message
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <DisplayModal data={viewData} onClose={() => setViewData(null)} />

            <div
                ref={conversationCtrRef}
                className='max-h-full px-2 py-5 space-y-2 overflow-y-auto custom-scrollbar'
            >
                {/* Load older messages indicator */}
                <div
                    ref={loadOlderMessageIntercept}
                    className='flex justify-center py-2'
                >
                    {loadingOlder && (
                        <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Loading older messages...
                        </div>
                    )}
                    {noOlderMessages && messages.length > 10 && (
                        <div className='text-muted-foreground text-xs text-center py-2'>
                            No older messages
                        </div>
                    )}
                </div>

                {messages.map((message) => {
                    const displayableAttachments = message.attachments?.filter(
                        (att) => isImage(att) || isVideo(att)
                    );

                    const unDisplayableAttachments =
                        message.attachments?.filter(
                            (att) => !isImage(att) && !isVideo(att)
                        );

                    const hasText = message.message !== '';

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
