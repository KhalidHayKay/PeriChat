import { Play } from 'lucide-react';
import { useRef, useState } from 'react';

const VideoPreview = ({ file }: { file: Attachment }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<div className='relative w-full h-full flex items-center justify-center bg-black'>
			<div className='absolute inset-0 flex items-center justify-center'>
				<video
					ref={videoRef}
					src={file.url}
					className='max-h-full max-w-full object-contain'
					onClick={togglePlay}
					onEnded={() => setIsPlaying(false)}
					controls={isPlaying}
				/>
			</div>

			{/* Play button overlay - only shown when video is not playing */}
			{!isPlaying && (
				<div
					className='absolute inset-0 flex items-center justify-center cursor-pointer'
					onClick={togglePlay}
				>
					<div className='w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center'>
						<Play className='w-6 h-6 text-white' fill='white' />
					</div>
				</div>
			)}

			{/* File name (only shown when not playing) */}
			{!isPlaying && (
				<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2'>
					<p className='text-white text-xs truncate'>
						{file.file.name}
					</p>
				</div>
			)}
		</div>
	);
};

export default VideoPreview;
