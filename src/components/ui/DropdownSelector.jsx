import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function DropdownSelector({
	                                         options,
	                                         onSelect,
	                                         label,
	                                         icon,
	                                         hasError,
	                                         initialValue = null,
	                                         dropdownColor = "bg-surface-200",
	                                         textColor = "text-black",
	                                         transitionDuration = "300ms", // You can adjust this for speed
	                                         disabled = false,
                                         }) {
	const [selectedOption, setSelectedOption] = useState(initialValue);
	const [isOpen, setIsOpen] = useState(false);

	// Create refs for dropdown container to detect clicks outside and scrolling
	const dropdownRef = useRef(null);

	// Close the dropdown if a click outside of it occurs
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false); // Close the dropdown if clicked outside
			}
		};

		// Close dropdown on scroll
		const handleScroll = () => {
			setIsOpen(false); // Close dropdown when user scrolls
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("scroll", handleScroll); // Add scroll listener

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("scroll", handleScroll); // Clean up scroll listener
		};
	}, []);

	const handleOptionSelect = (option) => {
		setSelectedOption(option);
		onSelect(option);
		console.log("from dropdown: => ", option);
		setIsOpen(false); // Close the dropdown after selection
	};

	const handleToggleDropdown = () => {
		if (disabled) return; // Do nothing if the dropdown is disabled
		setIsOpen((prevState) => !prevState);
	};

	// Ensure the selectedOption is updated if the initialValue changes
	useEffect(() => {
		setSelectedOption(initialValue);
	}, [initialValue]);

	return (
		<div className="relative w-fit min-w-[200px]" ref={dropdownRef}>
			<div
				className={`cursor-pointer py-4 px-6 rounded-2xl ${dropdownColor} ${textColor} flex items-center justify-between gap-4 ${
					disabled ? "cursor-not-allowed opacity-50 pointer-events-none" : ""
				} ${hasError ? "border border-red-500" : ""}`}
				onClick={handleToggleDropdown} // Toggle dropdown visibility
			>
				{selectedOption && selectedOption.image && (
					<img
						src={selectedOption.image}
						className="w-6 h-6 rounded-full object-cover object-center"
						alt=""
					/>
				)}
				<span className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
					{selectedOption && selectedOption.label ? selectedOption.label : label}
        </span>
				<span className="text-xl">
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
			</div>

			<div
				className={`absolute top-full mt-2 w-full bg-surface-500 rounded-md shadow-lg z-50 overflow-hidden transition-all ease-out`}
				style={{
					maxHeight: isOpen ? "500px" : "0", // Set max-height based on open state
					transitionDuration: transitionDuration, // Apply custom transition duration
				}}
			>
				{options.map((option, index) => (
					<div
						key={option.id}
						className={`cursor-pointer p-2 hover:bg-lightPurple-50  ${textColor} ${
							disabled ? "cursor-not-allowed opacity-50" : ""
						} flex gap-2 items-center`}
						onClick={() => handleOptionSelect(option)}
					>
						{option.image && (
							<img
								src={option.image}
								className="w-6 h-6 rounded-full object-cover object-center"
								alt=""
							/>
						)}
						{option.label}
					</div>
				))}
			</div>
		</div>
	);
}
