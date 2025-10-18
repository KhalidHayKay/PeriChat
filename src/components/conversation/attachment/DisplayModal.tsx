import { isImage, isVideo } from '@/actions/file-check';
import { env } from '@/config/env';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
} from 'lucide-react';

import { useEffect, useState } from 'react';

interface DisplayModalProps {
    data: {
        attachments: ServerAttachment[];
        index: number;
    } | null;
    onClose: () => void;
}

const DisplayModal = ({ data, onClose }: DisplayModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(data?.index ?? 0);

    useEffect(() => {
        if (data) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [data]);

    useEffect(() => {
        setCurrentIndex(data?.index ?? 0);
    }, [data]);

    if (!data) return null;

    const current = data.attachments[currentIndex];

    const prev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? data.attachments.length - 1 : prev - 1
        );
    };

    const next = () => {
        setCurrentIndex((prev) =>
            prev === data.attachments.length - 1 ? 0 : prev + 1
        );
    };
    return (
        <div className='absolute inset-0 z-50 flex items-center justify-center'>
            {/* Backdrop */}
            <div
                className='fixed inset-0 bg-black/50'
                onClick={onClose}
                aria-hidden='true'
            />

            {/* Modal content */}
            <div className='relative grid grid-rows-[auto,1fr] bg-white rounded-lg shadow-xl px-6 py-3 h-5/6 w-full max-w-xl mx-auto z-10'>
                <div className='flex items-center justify-between px-4 z-20'>
                    {/* Back button */}
                    <button
                        onClick={onClose}
                        className='p-2 rounded-full hover:bg-gray-200 transition'
                    >
                        <ArrowLeft className='w-5 h-5' />
                    </button>

                    {/* Pagination text */}
                    <h3 className='font-bold text-lg text-center'>
                        {currentIndex + 1} of {data.attachments.length}
                    </h3>

                    {/* Dropdown menu */}
                    <div className='dropdown dropdown-end'>
                        <button
                            tabIndex={0}
                            className='p-2 rounded-full hover:bg-gray-200 transition'
                        >
                            <MoreVertical className='w-5 h-5' />
                        </button>
                        <ul
                            tabIndex={0}
                            className='dropdown-content menu menu-sm bg-white shadow-md rounded-md w-36 mt-2 z-30'
                        >
                            <li>
                                <button
                                    onClick={() => {
                                        const link =
                                            document.createElement('a');
                                        link.href = env.api.base + current.url; // assuming `current` is the current attachment
                                        link.download =
                                            current.name || 'attachment';
                                        link.click();
                                    }}
                                >
                                    Download
                                </button>
                            </li>
                            <li>
                                <button disabled>Report</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='relative flex justify-center items-center max-h-[330px]'>
                    {current ? (
                        <>
                            {/* Left arrow */}
                            {data.attachments.length > 1 && (
                                <button
                                    onClick={prev}
                                    className='absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full'
                                >
                                    <ChevronLeft />
                                </button>
                            )}

                            {/* Media */}
                            {isImage(current) && (
                                <img
                                    src={env.api.base + current.url}
                                    alt='image'
                                    className='max-h-full max-w-full rounded-md object-contain'
                                />
                            )}

                            {isVideo(current) && (
                                <video
                                    src={env.api.base + current.url}
                                    controls
                                    autoPlay
                                    className='max-h-full max-w-full rounded-md object-contain'
                                />
                            )}

                            {/* Right arrow */}
                            {data.attachments.length > 1 && (
                                <button
                                    onClick={next}
                                    className='absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full'
                                >
                                    <ChevronRight />
                                </button>
                            )}
                        </>
                    ) : (
                        <p>No valid media found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DisplayModal;
