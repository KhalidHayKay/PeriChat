import { PlayCircleIcon } from 'lucide-react';

const VideoPlayer = ({
    attachment,
    onClick,
}: {
    attachment: Attachment | ServerAttachment;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
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
    );
};

export default VideoPlayer;
