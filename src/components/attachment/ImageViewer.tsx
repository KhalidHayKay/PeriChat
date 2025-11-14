const ImageViewer = ({
    attachment,
    onClick,
}: {
    attachment: Attachment | ServerAttachment;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className='size-[90px] mobile:size-[110px] md:size-[130px] lg:size-[150px] shadow-md hover:shadow-lg rounded-md overflow-hidden cursor-pointer message-image-hover-effect'
        >
            <img
                src={attachment.url}
                className='size-full object-fill shadow-lg opacity-95'
            />
        </div>
    );
};

export default ImageViewer;
