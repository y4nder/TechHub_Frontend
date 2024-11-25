import { useState } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { IconContext } from "react-icons";

export default function SearchBar({
	                                  id,
	                                  placeholder,
	                                  onKeystrokeSearch,
	                                  onSubmitSearch,
	                                  hasError,
	                                  ...props
                                  }) {
	const [query, setQuery] = useState("");

	// Handle query change
	const handleInputChange = (e) => {
		setQuery(e.target.value);
		if (onKeystrokeSearch) {
			onKeystrokeSearch(e.target.value); // Trigger search on each keystroke
		}
	};

	// Clear the search query
	const clearSearch = () => {
		setQuery("");
		if (onKeystrokeSearch) onKeystrokeSearch(""); // Reset search on clear
		if (onSubmitSearch) onSubmitSearch(""); // Reset search on clear
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		if (onSubmitSearch) {
			onSubmitSearch(query); // Trigger search on submit
		}
	};

	let classes =
		"bg-surface-500 p-4 text-black-500 rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out";

	if (hasError) {
		classes += " border border-red-400";
	}

	return (
		<form onSubmit={handleSubmit} className="relative flex items-center w-full">
			<IconContext.Provider value={{ size: "1.5em" }}>
        <span className="absolute left-3 text-gray-500">
          <AiOutlineSearch />
        </span>
			</IconContext.Provider>

			<input
				id={id}
				name={id}
				type="text"
				placeholder={placeholder || "Search..."}
				value={query}
				onChange={handleInputChange}
				className={`${classes} pl-10 pr-12`} // Add padding for icons
				{...props}
			/>

			{query && (
				<IconContext.Provider value={{ size: "1.2em" }}>
					<button
						type="button"
						onClick={clearSearch}
						className="absolute right-3 text-gray-500 hover:text-gray-700"
					>
						<AiOutlineClose />
					</button>
				</IconContext.Provider>
			)}
		</form>
	);
}
