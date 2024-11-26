import { useState } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

export default function SearchBar({
	                                  id,
	                                  placeholder,
	                                  onKeystrokeSearch,
	                                  onSubmitSearch,
	                                  ...props
                                  }) {
	const [query, setQuery] = useState("");

	// Handle query change
	const handleInputChange = (e) => {
		setQuery(e.target.value);
		if (onKeystrokeSearch) {
			onKeystrokeSearch(e.target.value);
		}
	};

	// Clear the search query
	const clearSearch = () => {
		setQuery("");
		if (onKeystrokeSearch) onKeystrokeSearch("");
		if (onSubmitSearch) onSubmitSearch("");
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		if (onSubmitSearch) {
			onSubmitSearch(query);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="relative flex items-center w-full h-full"
		>
			{/* Search Icon */}
			<span className="absolute left-3 text-gray-500">
				<AiOutlineSearch size="1.5em" />
			</span>

			{/* Input Field */}
			<input
				id={id}
				name={id}
				type="text"
				placeholder={placeholder || "Search..."}
				value={query}
				onChange={handleInputChange}
				className={`
					w-full bg-surface-500 
					h-full pl-10 pr-10 py-3
					text-black-500 
					rounded-[20px] 
					text-sm 
					focus:outline-none 
					focus:ring-2 
					focus:ring-blue-500 
					focus:border-transparent 
					transition-all 
					duration-300 
					ease-in-out
				`}
				{...props}
			/>

			{/* Clear Icon */}
			{query && (
				<button
					type="button"
					onClick={clearSearch}
					className="absolute right-3 text-gray-500 hover:text-gray-700"
				>
					<AiOutlineClose size="1.2em" />
				</button>
			)}
		</form>
	);
}
