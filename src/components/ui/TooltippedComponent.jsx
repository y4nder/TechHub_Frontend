const TooltippedComponent = ({ children, tooltipText, placement = "top" }) => {
	const placementClasses = {
		top: "bottom-full mb-1 -translate-x-4",
		bottom: "top-full mt-2",
		left: "right-full mr-2 -translate-y-2",
		right: "left-full ml-2",
		topCenter: "top-full mb-1 translate-x-6 translate-y-1",
	};

	return (
		<div className="relative group flex-shrink-0">
			{/* Tooltip */}
			<span
				className={`absolute ${placementClasses[placement]} z-[99999] w-max px-3 py-1 text-sm text-white bg-surface-900 rounded-2xl opacity-0 group-hover:block group-hover:opacity-100 transition-opacity duration-300`}
			>
				{tooltipText}
			</span>
			{/* Children (icons) */}
			{children}
		</div>
	);
};

export default TooltippedComponent;
