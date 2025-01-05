import { cn } from '@/utils/cn';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from 'lucide-react';

const Avatar = ({
	avatarUrl,
	online,
	isGroup = false,
	isProfile = false,
}: {
	avatarUrl: string | null;
	online: boolean;
	isGroup?: boolean;
	isProfile?: boolean;
}) => {
	return (
		<>
			<div
				className={cn(
					'avatar',
					'before:!top-auto before:bottom-[7%]',
					online ? 'online' : 'offline'
				)}
			>
				<div
					className={cn(
						'ring-secondary/50 ring-offset-base-100 w-11 rounded-full ring ring-offset-2',
						isProfile && 'w-12'
					)}
				>
					{avatarUrl && avatarUrl !== '' ? (
						<img src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' />
					) : !isGroup ? (
						<UserCircleIcon className='size-full' />
					) : (
						<UserGroupIcon className='size-full' />
					)}
				</div>
			</div>
		</>
	);
};

export default Avatar;
