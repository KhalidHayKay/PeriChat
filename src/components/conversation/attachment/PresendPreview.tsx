import { isAudio, isImage, isVideo } from '@/actions/file-check';
import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';
import AttachmentPreview from './AttachmentPreview';
import AudioPreview from './AudioPreview';
import VideoPreview from './VideoPreview';

const PresendPreview = ({
    files,
    removeFile,
}: {
    files: Attachment[];
    removeFile: (name: string) => void;
}) => {
    return (
        <div
            className={cn(
                'w-full max-h-[400px] overflow-y-auto custom-scrollbar p-2',
                'absolute bottom-0 -translate-y-[72px] bg-secondary'
            )}
        >
            <div
                className={cn(
                    'grid gap-2',
                    files.length === 1 && 'grid-cols-1',
                    files.length === 2 && 'grid-cols-2',
                    files.length === 3 && 'grid-cols-3',
                    files.length === 4 && 'grid-cols-2 grid-rows-2',
                    files.length >= 5 && 'grid-cols-3 auto-rows-fr'
                )}
            >
                {files.map((file) => (
                    <div
                        key={file.file.name}
                        className={cn(
                            'relative rounded-md overflow-hidden',
                            'min-h-32 flex items-center justify-center',
                            'border border-gray-100'
                        )}
                    >
                        {isImage(file) ? (
                            <img
                                src={file.url}
                                alt={file.file.name}
                                className='w-full h-full object-cover'
                            />
                        ) : isAudio(file) ? (
                            <AudioPreview file={file} />
                        ) : isVideo(file) ? (
                            <VideoPreview file={file} />
                        ) : (
                            <AttachmentPreview file={file} />
                        )}

                        <button
                            onClick={() => removeFile(file.file.name)}
                            className='absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70'
                        >
                            <XCircle className='w-5 h-5' />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PresendPreview;
