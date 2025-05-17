const Overlay = ({
	isVisible,
	onClose,
}: {
	isVisible: boolean;
	onClose: () => void;
}) => {
	if (!isVisible) return null;

	return (
		<div
			className='fixed inset-0 sizefull opacity-0 z-20'
			onClick={(e) => {
				e.stopPropagation();
				onClose();
			}}
			aria-hidden='true'
		/>
	);
};

export default Overlay;
