import {
    formatBytes,
    isAppFile,
    isAudio,
    isImage,
    isVideo,
} from '@/actions/file-check';
import { capitalize, cn } from '@/lib/utils';
import { Download, File, PlayCircleIcon } from 'lucide-react';

import { Fragment } from 'react/jsx-runtime';

import { AudioPlayer } from './AudioPlayer';

const MessageAttachment = ({
    attachments,
    senderIsUser,
    hasText,
    onAttachmentClick,
}: {
    attachments: ServerAttachment[];
    senderIsUser: boolean;
    hasText?: boolean;
    onAttachmentClick?: (index: number) => void;
}) => {
    return attachments.map((attachment, i) => {
        return (
            <Fragment key={attachment.id ?? i}>
                {isImage(attachment) && (
                    <div
                        onClick={() => {
                            if (onAttachmentClick) {
                                onAttachmentClick(i);
                            }
                        }}
                        className='size-[90px] mobile:size-[110px] md:size-[130px] lg:size-[150px] shadow-md hover:shadow-lg rounded-md overflow-hidden cursor-pointer message-image-hover-effect'
                    >
                        <img
                            src={attachment.url}
                            className='size-full object-fill shadow-lg opacity-95'
                        />
                    </div>
                )}

                {isVideo(attachment) && (
                    <div
                        onClick={() =>
                            onAttachmentClick && onAttachmentClick(i)
                        }
                        className='relative size-[90px] mobile:size-[110px] md:size-[130px] lg:size-[150px] shadow-md hover:shadow-lg rounded-md overflow-hidden cursor-pointer message-image-hover-effect'
                    >
                        <PlayCircleIcon className='z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 text-secondary opacity-70' />
                        {/* <div className='absolute left-0 top-0 size-full bg-black/50 z-10'></div> */}
                        <video
                            src={attachment.url}
                            className='size-full'
                            // controls
                        ></video>
                    </div>
                )}

                {isAudio(attachment) && (
                    <div className='w-full max-w-md'>
                        <AudioPlayer
                            file={attachment}
                            senderIsUser={senderIsUser}
                            hasText={hasText ?? false}
                        />
                    </div>
                )}

                {isAppFile(attachment) && (
                    <div
                        className={cn(
                            'w-[300px] flex items-center p-3 rounded-lg border shadow-sm transition-colors',
                            senderIsUser
                                ? 'bg-periBlue hover:bg-periBlue/95'
                                : 'bg-primary hover:bg-primary/95',
                            hasText
                                ? senderIsUser
                                    ? 'rounded-tr-none'
                                    : 'rounded-tl-none'
                                : 'rounded-tr-lg'
                        )}
                    >
                        <div
                            className={cn(
                                'flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg mr-3',
                                senderIsUser
                                    ? 'bg-secondary/20'
                                    : 'bg-primary-content/20'
                            )}
                        >
                            <File size={24} className='text-primary/50' />
                        </div>

                        <div className='flex-1 min-w-0'>
                            <p
                                className={cn(
                                    'max-w-[200px] text-sm font-medium truncate',
                                    senderIsUser
                                        ? 'text-secondary'
                                        : 'text-primary-content'
                                )}
                            >
                                {attachment.name}
                            </p>
                            <p
                                className={cn(
                                    'text-xs space-x-1',
                                    senderIsUser
                                        ? 'text-secondary/70'
                                        : 'text-primary-content/70'
                                )}
                            >
                                <span>{formatBytes(attachment.size)},</span>
                                <span>
                                    {capitalize(attachment.mime.split('/')[1])}{' '}
                                    File
                                </span>
                            </p>
                        </div>

                        <button
                            onClick={
                                attachment.url
                                    ? () =>
                                          window.open(attachment.url, '_blank')
                                    : undefined
                            }
                            className={cn(
                                'ml-2 p-2 rounded-full transition-colors',
                                senderIsUser
                                    ? 'text-secondary hover:bg-secondary/50'
                                    : 'text-primary-content hover:bg-primary-content/50'
                            )}
                            title='Download file'
                            disabled={!attachment.url}
                        >
                            <Download size={18} />
                            <span className='sr-only'>
                                Download {attachment.name}
                            </span>
                        </button>
                    </div>
                )}
            </Fragment>
        );
    });
};

export default MessageAttachment;
