import { cn } from '@/lib/utils';
import { Download, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const AudioPlayer = ({
    file,
    senderIsUser,
    hasText,
}: {
    file: ServerAttachment;
    senderIsUser: boolean;
    hasText: boolean;
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const audio = new Audio(file.url);
        audioRef.current = audio;

        audio.addEventListener('loadedmetadata', () => {
            setAudioDuration(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentTime(0);
        });

        return () => {
            audio.pause();
            audio.src = '';
            audio.removeEventListener('loadedmetadata', () => {});
            audio.removeEventListener('timeupdate', () => {});
            audio.removeEventListener('ended', () => {});
        };
    }, [file.url]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && audioRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const clickPosition = e.clientX - rect.left;
            const progressPercentage = clickPosition / rect.width;
            const newTime = progressPercentage * audioDuration;

            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const progressPercentage = audioDuration
        ? (currentTime / audioDuration) * 100
        : 0;

    return (
        <div
            className={cn(
                'w-[250px] flex flex-col p-4 rounded-lg divide-y shadow-md',
                senderIsUser
                    ? 'bg-periBlue divide-secondary/50'
                    : 'bg-primary divide-primary-content/20',
                hasText
                    ? senderIsUser
                        ? 'rounded-tr-none'
                        : 'rounded-tl-none'
                    : 'rounded-tr-lg'
            )}
        >
            {/* Filename display */}
            <div
                className={cn(
                    'max-w-[200px] text-sm font-medium mb-1.5 truncate',
                    senderIsUser ? 'text-secondary' : 'text-primary-content'
                )}
            >
                {file.name}
            </div>

            <div className='flex items-center w-full pt-1.5'>
                <button
                    onClick={togglePlayPause}
                    className={cn(
                        'size-10 flex-shrink-0 flex items-center justify-center rounded-full mr-4 backdrop-blur-sm transition-colors duration-200',
                        senderIsUser
                            ? 'bg-secondary/20 hover:bg-secondary/30 '
                            : 'bg-primary-content/20 hover:bg-primary-content/30'
                    )}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <Pause
                            size={18}
                            className={cn(
                                senderIsUser
                                    ? 'text-secondary'
                                    : 'text-primary-content'
                            )}
                        />
                    ) : (
                        <Play
                            size={18}
                            className={cn(
                                'ml-1',
                                senderIsUser
                                    ? 'text-secondary'
                                    : 'text-primary-content'
                            )}
                        />
                    )}
                </button>

                <div className='flex-1 min-w-0'>
                    {/* Timer display above progress bar */}
                    <div
                        className={cn(
                            'flex justify-between text-xs font-medium mb-1',
                            senderIsUser
                                ? 'text-secondary/90'
                                : 'text-primary-content/90'
                        )}
                    >
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(audioDuration)}</span>
                    </div>

                    {/* Progress bar */}
                    <div
                        ref={progressRef}
                        className={cn(
                            'h-2 rounded-full cursor-pointer relative overflow-hidden',
                            senderIsUser
                                ? 'bg-secondary/30'
                                : 'bg-primary-content/30'
                        )}
                        onClick={handleProgressClick}
                    >
                        <div
                            className={cn(
                                'absolute top-0 left-0 h-full rounded-full transition-all duration-100',
                                senderIsUser
                                    ? 'bg-secondary'
                                    : 'bg-primary-content'
                            )}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <button
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = file.url;
                        link.download = file.name || 'attachment';
                        link.click();
                    }}
                    className={cn(
                        'ml-4 p-2 rounded-full transition-all duration-200 flex-shrink-0',
                        senderIsUser
                            ? 'text-secondary hover:text-secondary hover:bg-secondary/30'
                            : 'text-primary-content hover:text-primary-content hover:bg-primary-content/30'
                    )}
                    title={`Download ${file.name}`}
                >
                    <Download size={16} />
                    <span className='sr-only'>Download {file.name}</span>
                </button>
            </div>
        </div>
    );
};
