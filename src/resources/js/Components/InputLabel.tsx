import { cn } from '@/utils/utils';
import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
	value,
	className = '',
	children,
	...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
	return (
		<label
			{...props}
			className={cn(
				'block text-sm font-medium text-primary-content',
				className
			)}
		>
			{value ? value : children}
		</label>
	);
}
