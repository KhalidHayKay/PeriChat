import { cn } from '@/utils/utils';
import {
	forwardRef,
	InputHTMLAttributes,
	useEffect,
	useImperativeHandle,
	useRef,
} from 'react';

export default forwardRef(function TextInput(
	{
		type = 'text',
		className = '',
		isFocused = false,
		...props
	}: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
	ref
) {
	const localRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => ({
		focus: () => localRef.current?.focus(),
	}));

	useEffect(() => {
		if (isFocused) {
			localRef.current?.focus();
		}
	}, [isFocused]);

	return (
		<input
			{...props}
			type={type}
			className={cn(
				'rounded-lg border-secondary-content shadow-sm focus:border-periBlue/70 bg-primary text-primary-content',
				className
			)}
			ref={localRef}
		/>
	);
});
