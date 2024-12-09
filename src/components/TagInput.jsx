import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "@/utils/http/tags.js";

export default function TagInput({ onTagsChange, initialTags = [] }) {
	const [inputValue, setInputValue] = useState("");
	const [tags, setTags] = useState(initialTags); // Stores selected tags as { tagId, tagName }
	const [customTags, setCustomTags] = useState([]); // Stores custom tags as strings
	const [suggestions, setSuggestions] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [allTags, setAllTags] = useState([]); // State to store all tags once fetched

	// Query to fetch tags
	const { data, isLoading, isError } = useQuery({
		queryKey: ["tags"],
		queryFn: getAllTags,
	});

	useEffect(() => {
		if (data && !isLoading) {
			setAllTags(data?.tags || []); // Store the fetched tags in the allTags state
		}
	}, [data, isLoading]);

	useEffect(() => {
		if (inputValue.trim()) {
			// Filter out tags that are already selected (both predefined and custom tags)
			const selectedTagIds = [
				...tags.map((tag) => tag.tagId),
				...customTags, // Custom tags are strings, so we check for their presence in suggestions
			];

			// Filter the allTags array to create suggestions based on inputValue
			const filteredSuggestions = allTags.filter(
				(suggestion) =>
					!selectedTagIds.includes(suggestion.tagId) && // Exclude already selected predefined tags
					!customTags.includes(suggestion.tagName) && // Exclude custom tags
					suggestion.tagName.toLowerCase().includes(inputValue.toLowerCase()) // Filter by inputValue
			);

			// Limit the suggestions to the first 10
			setSuggestions(filteredSuggestions.slice(0,5));
			setIsDropdownOpen(true);
		} else {
			setSuggestions([]);
			setIsDropdownOpen(false);
		}
	}, [inputValue, tags, customTags, allTags]); // Depend on allTags instead of data

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleTagSelection = (tag) => {
		if (!tags.some((selectedTag) => selectedTag.tagId === tag.tagId)) {
			setTags((prevTags) => [...prevTags, { tagId: tag.tagId, tagName: tag.tagName }]);
		}
		setInputValue(""); // Clear input after selection
		setSuggestions([]); // Close the dropdown
		setIsDropdownOpen(false);
	};

	const handleCustomTagAdd = () => {
		if (inputValue.trim() && !customTags.includes(inputValue)) {
			setCustomTags((prevTags) => [...prevTags, inputValue]);
		}
		setInputValue(""); // Clear input after adding custom tag
		setIsDropdownOpen(false); // Close the dropdown
	};

	const handleTagRemove = (tagIdOrString) => {
		if (typeof tagIdOrString === "string") {
			// Remove custom tag by string value
			setCustomTags(customTags.filter((tag) => tag !== tagIdOrString));
		} else {
			// Remove predefined tag by tagId
			setTags(tags.filter((tag) => tag.tagId !== tagIdOrString));
		}
	};

	useEffect(() => {
		// Map only the tagIds in selectedTags
		const selectedTagIds = tags.map((tag) => tag.tagId);

		onTagsChange({ selectedTags: selectedTagIds, customTags: customTags });
	}, [tags, customTags, onTagsChange]);

	if (isLoading) {
		return <div>Loading tags...</div>;
	}

	if (isError) {
		return <div>Error fetching tags!</div>;
	}

	return (
		<div className="relative">
			{/* Display selected tags */}
			<div className="flex flex-wrap gap-2 mb-4">
				{[...tags, ...customTags].map((tag, index ) => (
					<span
						key={index}
						className="bg-surface-500 py-1 px-2 rounded-xl text-sm flex items-center text-black-300 border border-black-50"
					>
            {typeof tag === "string" ? tag : tag.tagName} {/* Display tagName */}
						<button
							type="button"
							className="ml-2 text-xs font-bold"
							onClick={() => handleTagRemove(tag.tagId || tag)}
						>
              &times;
            </button>
          </span>
				))}
			</div>

			<div className="flex items-center">
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					className="bg-surface-500 rounded-xl py-2 px-4 w-full text-md"
					placeholder="Add a tag"
				/>
				<button
					type="button"
					onClick={handleCustomTagAdd}
					className="bg-lightPurple-50 text-darkPurple-500 py-2 px-4 ml-2 rounded-lg h-fit text-nowrap text-sm hover:bg-lightPurple-200 hover:text-white"
				>
					Add New Tag #
				</button>
			</div>

			{/* Display dropdown if there are suggestions */}
			{isDropdownOpen && suggestions.length > 0 && (
				<ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
					{suggestions.map((suggestion) => (
						<li
							key={suggestion.tagId}
							onClick={() => handleTagSelection(suggestion)}
							className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-xxs"
						>
							{suggestion.tagName}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
