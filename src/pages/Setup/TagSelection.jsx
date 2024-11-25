import Button from "@/components/ui/Button.jsx";
import SearchBar from "@/components/ui/Searchbar.jsx";
import SelectableTag from "@/components/ui/SelectableTag.jsx";
import { useState, useEffect } from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {followManyTags, getAllTags} from "@/utils/http/tags.js";
import SelectableTagSkeleton from "@/components/ui/skeletons/SelectableTagSkeleton.jsx";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

export default function TagSelectionPage() {
	const [selectedTagIds, setSelectedTagIds] = useState([]);
	const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
	const [filteredTags, setFilteredTags] = useState([]); // State for filtered tags
	const userId = useSelector((state) => state.user.userId);
	const navigate = useNavigate();

	const { data, isPending, isError } = useQuery({
		queryKey: ['tags'],
		queryFn: getAllTags,
	});

	useEffect(() => {
		if (data && data.tags) {
			setFilteredTags(
				data.tags.filter((tag) =>
					tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
				)
			);
		}
	}, [searchQuery, data]);

	const {
		mutate,
		isPending: isFollowing,
		isError: isFollowingError,
		error: followError,
	} = useMutation({
		mutationFn: followManyTags,
		onSuccess: () => {
			navigate("/home");
		}
	});

	const handleTagToggle = (tagId) => {
		setSelectedTagIds((prev) =>
			prev.includes(tagId)
				? prev.filter((id) => id !== tagId)
				: [...prev, tagId]
		);
	};

	const handleSearch = (query) => {
		setSearchQuery(query); // Update the search query as the user types
	};

	const handleContinue = () => {
		const payload = {
			userId,
			tagIdsToFollow: selectedTagIds
		}
		console.log("Selected tags:", payload);
		mutate(payload);
	};

	return (
		<div className="p-10 space-y-20">
			<header className="flex justify-end">
				<Button
					className="bg-brightOrange-500 text-surface-50 font-sans font-light py-5 px-14 rounded-[20px] hover:bg-darkPurple-500 duration-200"
					onClick={handleContinue}
					disabled={isFollowing}
				>
					{ isFollowing ? "Following tags.." : "Continue" }
				</Button>
			</header>
			<main className="flex flex-col gap-10 items-center">
				<h1 className="text-5xl font-bold text-center gradient-text py-2">
					Pick tags that are relevant to you
				</h1>
				<div className="flex justify-center">
					<SearchBar
						id="search"
						placeholder="Search javascript, php, git etc..."
						onKeystrokeSearch={handleSearch} // Real-time search on keystroke
						hasError={false}
					/>
				</div>
				<div className="flex flex-wrap gap-3 justify-center max-w-screen-lg">
					{isPending && <SelectableTagSkeleton />}

					{isError && (
						<p className="gradient-text text-3xl font-bold">
							Failed to fetch tags :((</p>
					)}

					{filteredTags.length > 0 ? (
						filteredTags.map((tag) => (
							<SelectableTag
								key={tag.tagId}
								tag={tag}
								isSelected={selectedTagIds.includes(tag.tagId)}
								onToggle={() => handleTagToggle(tag.tagId)}
							/>
						))
					) : (
						<p className="text-xl">No tags found for your search.</p>
					)}
				</div>
				{isFollowingError && <p>Following tags failed {followError.detail || 'error following tags'}</p>}
			</main>
		</div>
	);
}
