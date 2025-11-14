import { loadOlderMessages } from '@/actions/message';
import { useAppEventContext } from '@/contexts/AppEventsContext';
import { Loader2 } from 'lucide-react';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import ConversationMessagesError from '../errors/ConversationMessagesError';
import ConversationMessagesSkeleton from '../skeletons/ConversationMessagesSkeleton';

import DisplayModal from '../attachment/DisplayModal';
import MessageBubble from './MessageBubble';

interface ConversationMessagesProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    refreshMessages: () => void;
    loading: boolean;
    error: string | null;
    selectedConversation: Conversation;
    user: User;
    onRetryMessage?: (message: Message & { tempId: string }) => void;
}

const ConversationMessages = ({
    messages,
    setMessages,
    refreshMessages,
    loading,
    error,
    selectedConversation,
    user,
    onRetryMessage,
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

    const { emit } = useAppEventContext();

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

    const handleLoadOlderMessages = useCallback(async () => {
        if (noOlderMessages || loadingOlder) {
            return;
        }

        const lastMessage = messages[0];
        setLoadingOlder(true);

        try {
            const { messages: olderMessages, hasMore } =
                (await loadOlderMessages(
                    selectedConversation.id,
                    lastMessage.id
                )) || { messages: [], hasMore: false };

            if (!hasMore) {
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
        selectedConversation.id,
        setMessages,
    ]);

    const onAttachmentClick = useCallback(
        (attachments: ServerAttachment[], index: number) => {
            setViewData({ attachments, index });
        },
        []
    );

    useEffect(() => {
        setTimeout(() => {
            if (conversationCtrRef.current) {
                conversationCtrRef.current.scrollTop =
                    conversationCtrRef.current.scrollHeight;
            }
        }, 10);

        setScrollFromBottom(0);
        setNoOlderMessages(false);
    }, []);

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

        const isScrollable = conversationCtrRef.current
            ? conversationCtrRef.current.scrollHeight >
              conversationCtrRef.current.clientHeight
            : false;

        if (!isScrollable) {
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

    if (loading) return <ConversationMessagesSkeleton />;

    if (error)
        return (
            <ConversationMessagesError
                error={error}
                refresh={refreshMessages}
            />
        );

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

                {messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        onAttachmentClick={onAttachmentClick}
                        user={user}
                        onRetryMessage={onRetryMessage}
                    />
                ))}
            </div>
        </>
    );
};

export default ConversationMessages;
