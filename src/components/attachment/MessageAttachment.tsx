import { isAppFile, isAudio, isImage, isVideo } from '@/actions/file-check';
import { Fragment } from 'react/jsx-runtime';
import { AudioPlayer } from './AudioPlayer';
import FileViewer from './FileViewer';
import ImageViewer from './ImageViewer';
import VideoPlayer from './VideoPlayer';

const MessageAttachment = ({
    attachments,
    senderIsUser,
    hasText,
    onAttachmentClick,
}: {
    attachments: ServerAttachment[] | Attachment[];
    senderIsUser: boolean;
    hasText?: boolean;
    onAttachmentClick?: (index: number) => void;
}) => {
    return attachments.map((attachment, i) => {
        const uniqueKey = `attachment-${'id' in attachment ? attachment.id : i}`;

        return (
            <Fragment key={uniqueKey}>
                {isImage(attachment) && (
                    <ImageViewer
                        attachment={attachment}
                        onClick={() =>
                            onAttachmentClick && onAttachmentClick(i)
                        }
                    />
                )}

                {isVideo(attachment) && (
                    <VideoPlayer
                        attachment={attachment}
                        onClick={() =>
                            onAttachmentClick && onAttachmentClick(i)
                        }
                    />
                )}

                {isAudio(attachment) && (
                    <div className='w-full max-w-md'>
                        <AudioPlayer
                            audioFile={attachment}
                            senderIsUser={senderIsUser}
                            hasText={hasText ?? false}
                        />
                    </div>
                )}

                {isAppFile(attachment) && (
                    <FileViewer
                        senderIsUser={senderIsUser}
                        hasText={hasText ?? false}
                        sourceFile={attachment}
                    />
                )}
            </Fragment>
        );
    });
};

export default MessageAttachment;
