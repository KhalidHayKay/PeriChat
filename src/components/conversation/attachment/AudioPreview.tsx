import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const AudioPreview = ({ file }: { file: Attachment }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (audio) {
			const updateTime = () => setCurrentTime(audio.currentTime);
			const handleLoadedMetadata = () => setDuration(audio.duration);

			audio.addEventListener('timeupdate', updateTime);
			audio.addEventListener('loadedmetadata', handleLoadedMetadata);

			return () => {
				audio.removeEventListener('timeupdate', updateTime);
				audio.removeEventListener(
					'loadedmetadata',
					handleLoadedMetadata
				);
			};
		}
	}, []);

	// Format time in mm:ss
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	// Calculate progress percentage
	const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

	return (
		<div className='relative w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4'>
			{/* Hidden audio element */}
			<audio
				ref={audioRef}
				src={file.url}
				onEnded={() => setIsPlaying(false)}
			/>

			{/* Waveform visualization (simplified) */}
			<div className='w-full h-16 flex items-center justify-center mb-4'>
				<div className='w-full h-5 bg-gray-200 rounded-lg relative overflow-hidden'>
					{/* Progress bar */}
					<div
						className='absolute top-0 left-0 h-full bg-blue-500 rounded-l-lg'
						style={{ width: `${progressPercentage}%` }}
					/>

					{/* Simple waveform effect */}
					<div className='absolute inset-0 flex items-center justify-around px-2'>
						{[...Array(20)].map((_, i) => (
							<div
								key={i}
								className='w-1 bg-white bg-opacity-50'
								style={{
									height: `${20 + Math.sin(i * 0.5) * 20}%`,
								}}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Controls */}
			<div className='w-full flex items-center justify-between px-2'>
				{/* Play/Pause button */}
				<button
					onClick={togglePlay}
					className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center'
				>
					{isPlaying ? (
						<Pause className='w-5 h-5 text-white' />
					) : (
						<Play className='w-5 h-5 text-white' fill='white' />
					)}
				</button>

				{/* Time display */}
				<div className='text-sm text-gray-600'>
					{formatTime(currentTime)} / {formatTime(duration || 0)}
				</div>
			</div>

			{/* File name */}
			<div className='w-full mt-4'>
				<p className='text-gray-800 text-sm font-medium truncate'>
					{file.file.name}
				</p>
			</div>
		</div>
	);
};

export default AudioPreview;
