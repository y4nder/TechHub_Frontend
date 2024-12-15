import {Children, cloneElement, useEffect, useRef, useState} from "react";

export const Dropdown = ({ trigger, children, className }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className={`relative inline-block ${className}`} ref={dropdownRef}>
			{/* Trigger component */}
			<div onClick={handleToggle} className="cursor-pointer">
				{trigger}
			</div>

			{/* Dropdown content */}
			{isOpen && (
				<div className="absolute -right-4 mt-2 w-52 bg-white border border-gray-300 rounded-xl drop-shadow-2xl z-50 overflow-visible">
					{/* Pointer */}
					<div
						className="absolute top-[-8px] right-4 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-300"
					/>
					{Children.map(children, (child) =>
						// Passing setIsOpen to each child to allow closing the dropdown
						cloneElement(child, { closeDropdown: () => setIsOpen(false) })
					)}
				</div>
			)}
		</div>
	);
};
