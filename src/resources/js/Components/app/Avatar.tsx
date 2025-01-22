import { cn } from '@/utils/cn';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { User } from 'lucide-react';

const Avatar = ({
	avatarUrl,
	online,
	isGroup = false,
	isProfile = false,
}: {
	avatarUrl: string | null;
	online?: boolean;
	isGroup?: boolean;
	isProfile?: boolean;
}) => {
	return (
		<>
			<div
				className={cn(
					'avatar cursor-pointer',
					'before:!top-auto before:bottom-[7%] before:!size-2 before:!outline-0',
					online === undefined
						? 'before:!size-0'
						: online === true
							? 'online'
							: 'offline before:!bg-gray-400'
				)}
			>
				<div
					className={cn(
						'w-11 bg-secondary/80 !flex items-center justify-center rounded-full',
						isProfile && 'w-12'
					)}
				>
					{avatarUrl && avatarUrl !== '' ? (
						<img src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' />
					) : !isGroup ? (
						<User className='size-[70%] text-opacity-50' />
					) : (
						<UserGroupIcon className='size-[60%] text-opacity-50' />
					)}
				</div>
			</div>
		</>
	);
};

export default Avatar;
