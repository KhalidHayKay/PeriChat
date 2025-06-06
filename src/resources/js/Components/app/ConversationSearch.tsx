import Avatar from '@/Components/app/Avatar';
import { cn } from '@/utils/utils';
import { Link } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

const ConversationSearch = ({
	user,
	online,
	search,
}: {
	user: User;
	online: boolean;
	search: {
		text: string;
		set: Dispatch<SetStateAction<string>>;
	};
}) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (isExpanded && inputRef.current) {
			inputRef.current.focus();
		}

		if (!isExpanded) {
			search.set('');
		}
	}, [isExpanded]);

	return (
		<div className='relative w-full h-[60px] flex items-center justify-between'>
			<div
				className={cn(
					'absolute left-1 flex items-center gap-3 transition-all duration-300',
					isExpanded ? 'opacity-0 invisible' : 'opacity-100 visible'
				)}
			>
				<Avatar
					avatarUrl={user.avatar ?? null}
					online={online}
					isProfile={true}
				/>
				<div>
					<h1 className='text-lg font-semibold'>{user.name}</h1>
					<p className='text-primary-content'>
						<Link
							href={route('account.profile')}
							className='text-primary-content hover:underline'
						>
							Account
						</Link>
					</p>
				</div>
			</div>

			{/* Search Field (overlays entire container when active) */}
			<div
				className={cn(
					'absolute right-0 transition-all duration-300 flex items-center justify-end',
					isExpanded ? 'w-full' : 'w-auto'
				)}
			>
				<div
					className={cn(
						'relative transition-all duration-500 ease-in-out',
						isExpanded ? 'w-full' : 'w-12'
					)}
				>
					<input
						ref={inputRef}
						type='text'
						value={search.text}
						onChange={(e) => search.set(e.target.value)}
						placeholder='Type to search...'
						className={cn(
							'w-full h-12 pl-4 pr-10 rounded-full border border-secondary-content bg-transparent text-primary-content placeholder:text-primary-content outline-none transition-all duration-300 ease-in-out)',
							isExpanded
								? 'opacity-100'
								: 'opacity-0 pointer-events-none'
						)}
					/>

					<Search
						onClick={() => setIsExpanded(true)}
						className={cn(
							'absolute right-2 top-1/2 -translate-y-1/2 size-5 text-secondary-content cursor-pointer transition-opacity duration-200',
							isExpanded
								? 'opacity-0 pointer-events-none'
								: 'opacity-100'
						)}
					/>
					<X
						onClick={() => setIsExpanded(false)}
						className={cn(
							'absolute right-3 top-1/2 -translate-y-1/2 size-5 text-secondary-content cursor-pointer transition-opacity duration-200',
							isExpanded
								? 'opacity-100'
								: 'opacity-0 pointer-events-none'
						)}
					/>
				</div>
			</div>
		</div>
	);
};

export default ConversationSearch;
