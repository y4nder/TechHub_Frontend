import { useState } from "react";

const AnimatedButton = ({ children, className, onClick }) => {
	const [isHolding, setIsHolding] = useState(false);

	const handleMouseDown = () => {
		setIsHolding(true);
	};

	const handleMouseUp = () => {
		setIsHolding(false);
	};

	const handleMouseLeave = () => {
		setIsHolding(false);
	};

	return (
		<button
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
			onClick={onClick}
			className={`transition-transform duration-200 ${isHolding ? "scale-90" : "scale-100"} ${className}`}
		>
			{children}
		</button>
	);
};

export default AnimatedButton;
