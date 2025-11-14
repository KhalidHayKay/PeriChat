import { formatBytes } from '@/actions/file-check';
import { capitalize, cn, normalizeAttachment } from '@/lib/utils';
import { Download, File } from 'lucide-react';

const FileViewer = ({
    senderIsUser,
    hasText,
    sourceFile,
}: {
    senderIsUser: boolean;
    hasText: boolean;
    sourceFile: Attachment | ServerAttachment;
}) => {
    const file = normalizeAttachment(sourceFile);

    return (
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
                    senderIsUser ? 'bg-secondary/20' : 'bg-primary-content/20'
                )}
            >
                <File size={24} className='text-primary/50' />
            </div>

            <div className='flex-1 min-w-0'>
                <p
                    className={cn(
                        'max-w-[200px] text-sm font-medium truncate',
                        senderIsUser ? 'text-secondary' : 'text-primary-content'
                    )}
                >
                    {file.name}
                </p>
                <p
                    className={cn(
                        'text-xs space-x-1',
                        senderIsUser
                            ? 'text-secondary/70'
                            : 'text-primary-content/70'
                    )}
                >
                    <span>{formatBytes(file.size)},</span>
                    <span>{capitalize(file.mime.split('/')[1])} File</span>
                </p>
            </div>

            <button
                onClick={
                    file.url ? () => window.open(file.url, '_blank') : undefined
                }
                className={cn(
                    'ml-2 p-2 rounded-full transition-colors',
                    senderIsUser
                        ? 'text-secondary hover:bg-secondary/50'
                        : 'text-primary-content hover:bg-primary-content/50'
                )}
                title='Download file'
                disabled={!file.url}
            >
                <Download size={18} />
                <span className='sr-only'>Download {file.name}</span>
            </button>
        </div>
    );
};

export default FileViewer;
