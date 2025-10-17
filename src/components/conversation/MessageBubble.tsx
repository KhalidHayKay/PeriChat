import { isImage, isVideo } from '@/actions/file-check';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import MessageAttachment from './attachment/MessageAttachment';

interface MessageBubbleProps {
    message: Message;
    onAttachmentClick: (attachments: ServerAttachment[], index: number) => void;
    user: User;
    onRetryMessage?: (message: Message & { tempId: string }) => void;
}

const MessageBubble = ({
    message,
    onAttachmentClick,
    user,
}: MessageBubbleProps) => {
    // const messageStatus = message.status;
    // const isSending = messageStatus === 'sending';
    // const isFailed = messageStatus === 'failed';
    const isUserMessage = message.senderId === user.id;

    const displayableAttachments = message.attachments?.filter(
        (att) => isImage(att) || isVideo(att)
    );

    const unDisplayableAttachments = message.attachments?.filter(
        (att) => !isImage(att) && !isVideo(att)
    );

    const hasText = message.message !== null;
    const hasAttachments =
        message.attachments && message.attachments.length > 0;

    return (
        <div
            key={message.id}
            className={cn(
                'chat',
                isUserMessage ? 'chat-end' : 'chat-start'
                // isSending && 'opacity-60 transition-opacity',
                // isFailed && 'opacity-80'
            )}
        >
            <div
                className={cn(
                    'chat-header flex items-center gap-x-1',
                    isUserMessage ? 'mr-1' : 'ml-1'
                )}
            >
                {message.groupId && !isUserMessage && (
                    <div className='font-semibold inline'>
                        {message.sender.name}
                    </div>
                )}
                <time className='text-[0.8rem]'>
                    {format(message.createdAt, 'MMM dd, hh:mm aa')}
                </time>
                {/* {isSending && (
                                    <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />
                                )}
                                {isFailed && (
                                    <AlertCircle className='h-3 w-3 text-destructive' />
                                )} */}
            </div>
            <div
                className={cn(
                    'size-full max-w-[90%] flex flex-col',
                    isUserMessage ? 'col-start-1 items-end' : 'col-start-2'
                )}
            >
                {hasText && (
                    <div
                        className={cn(
                            'chat-bubble max-w-full shadow-sm rounded-xl before:size-0',
                            isUserMessage
                                ? 'bg-periBlue text-secondary'
                                : 'chat-bubble-primary'
                        )}
                    >
                        <p>{message.message}</p>
                    </div>
                )}

                {displayableAttachments &&
                    displayableAttachments.length > 0 && (
                        <div
                            className={cn(
                                'mt-1 grid w-fit',
                                displayableAttachments.length > 1
                                    ? 'grid-cols-2 mobile:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 justify-end gap-3'
                                    : 'grid-cols-1',
                                isUserMessage
                                    ? '[direction:rtl]'
                                    : '[direction:ltr]'
                            )}
                        >
                            <MessageAttachment
                                attachments={
                                    displayableAttachments as ServerAttachment[]
                                }
                                senderIsUser={isUserMessage}
                                onAttachmentClick={(index: number) =>
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
                        <div className='mt-1 grid gap-y-2'>
                            <MessageAttachment
                                senderIsUser={isUserMessage}
                                attachments={
                                    unDisplayableAttachments as ServerAttachment[]
                                }
                                hasText={hasText}
                            />
                        </div>
                    )}

                {/* {isFailed && onRetryMessage && (
                                    <button
                                        onClick={() =>
                                            onRetryMessage(message as any)
                                        }
                                        className={cn(
                                            'mt-1 flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors',
                                            isUserMessage && 'self-end'
                                        )}
                                    >
                                        <RefreshCw className='h-3 w-3' />
                                        Retry
                                    </button>
                                )} */}
            </div>
        </div>
    );
};

export default MessageBubble;
