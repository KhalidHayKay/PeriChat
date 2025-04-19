import { cn } from '@/utils/utils';
import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
	className = '',
	disabled,
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={cn(
				'inline-flex items-center justify-center rounded-md border border-transparent bg-periBlue/90 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-periBlue/80 focus:bg-periBlue/80 focus:outline-none focus:ring-2 focus:ring-offset-periBlue focus:ring-offset-2 active:bg-periBlue',
				disabled && 'opacity-50',
				className
			)}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
