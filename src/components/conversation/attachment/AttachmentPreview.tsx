import { formatBytes } from '@/actions/file-check';
import { FileIcon } from 'lucide-react';

const AttachmentPreview = ({ file }: { file: Attachment }) => {
    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toUpperCase();
    };

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-3'>
            <div className='mb-3 flex items-center justify-center'>
                {/* Generic file icon for all file types */}
                <div className='bg-gray-100 p-3 rounded-md'>
                    <FileIcon className='w-10 h-10 text-gray-500' />
                </div>
            </div>
            <div className='w-full text-center'>
                <h3 className='text-sm font-medium text-gray-800 truncate max-w-full'>
                    {file.file.name}
                </h3>
                <p className='text-xs text-gray-500'>
                    {formatBytes(file.file.size)},{' '}
                    {getFileExtension(file.file.name)}
                </p>
            </div>
        </div>
    );
};

export default AttachmentPreview;
