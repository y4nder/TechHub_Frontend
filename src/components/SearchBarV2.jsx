import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {getSuggestedArticles} from "@/utils/http/articles.js";
import {getSuggestedClubs} from "@/utils/http/clubs.js";
import {getSuggestedTags} from "@/utils/http/tags.js";
import Divider from "@/components/ui/Divider.jsx";
import ArticleTag from "@/components/ui/ArticleTag.jsx";
import {CiSearch} from "react-icons/ci";
import {NavLink} from "react-router-dom";
import {AiOutlineSearch} from "react-icons/ai";

// Mock API calls
const fetchPostSuggestions = async (query) => {
	// Replace with your API endpoint

	console.log("fetch post ran with ", query);
	return await getSuggestedArticles(query);
};

const fetchClubSuggestions = async (query) => {
	// Replace with your API endpoint

	console.log("fetch club ran with ", query);
	return await getSuggestedClubs(query);
};

const fetchTagSuggestions = async (query) => {
	// Replace with your API endpoint

	console.log("fetch tag ran with ", query);
	return await getSuggestedTags(query);
};


export default function SearchBarV2(){
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	// Debounce logic
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query.trim());
		}, 300); // Adjust delay as needed

		return () => {
			clearTimeout(handler);
		};
	}, [query]);

	const { data: articleSuggestions, isFetching: isFetchingArticleSuggestions } = useQuery({
		queryKey: ['postSuggestions', query],
		queryFn: () => fetchPostSuggestions(query),
      enabled: !!debouncedQuery, // Fetch only when debouncedQuery is not empty
	})

	const { data: clubSuggestions, isFetching: isFetchingClubs } = useQuery({
		queryKey: ['clubSuggestions', query],
		queryFn: () => fetchClubSuggestions(query),
      enabled: !!debouncedQuery, // Fetch only when debouncedQuery is not empty
	})

	const { data: tagSuggestions, isFetching: isFetchingTags } = useQuery({
		queryKey: ['tagSuggestions', query],
		queryFn: () => fetchTagSuggestions(query),
      enabled: !!debouncedQuery, // Fetch only when debouncedQuery is not empty
	})

	const isLoading = isFetchingArticleSuggestions || isFetchingClubs || isFetchingTags;

	const handleClear = () => {
		setQuery("");
		setDebouncedQuery("");
	};

	return (
		<div className="relative w-full max-w-2xl mx-auto">
			{/* Search Input */}
			<div className="relative flex items-center w-full h-full">
				<span className="absolute left-3 text-gray-500">
					<AiOutlineSearch size="1.5em"/>
				</span>
				<input
					type="text"
					className={ `
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
					` }
					placeholder="Search..."
					value={ query }
					onChange={ (e) => setQuery(e.target.value) }
				/>
				{ query && (
					<button
						className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
						onClick={ handleClear }
					>
						✕
					</button>
				) }
			</div>

			{/* Suggestions */ }
			{ debouncedQuery && (
				<div
					className="absolute bg-lightPurple-10 border pt-4  pb-2 border-lightPurple-50 rounded-2xl mt-2 w-full z-10 shadow-lg space-y-3 backdrop-blur-sm">
					<button className="px-4 flex gap-2 items-center w-full py-2 hover:bg-gray-200">
						<CiSearch size={20}/>
						<div className="bg-lightPurple-50 text-darkPurple-500 p-1 rounded-xl px-2">
							{query}
						</div>
						<p className="font-thin text-gray-600 text-sm" >
							Search keyword
						</p>
					</button>
					{/* Tag Suggestions */}
					{tagSuggestions?.tags.length > 0 && (
						<div>
							<Divider text="Tags" variant="left" textClassName="text-sm font-semibold"/>
							<div className="flex flex-wrap gap-2 p-2">
								{tagSuggestions.tags.map((tag) => (
									<ArticleTag key={tag.tagId} tag={tag} isDiscover={true} onNavigate={handleClear} />
								))}
							</div>
						</div>
					)}


					{/* Post Suggestions */}
					{articleSuggestions?.articles.length > 0 && (
						<div>
							{/*<p className="px-4 py-2 text-sm font-semibold text-gray-700">*/}
							{/*	Posts*/}
							{/*</p>*/}
							<Divider text="Articles" variant="left" textClassName="text-sm font-semibold"/>

							{articleSuggestions.articles.map((article, index) => (
								<NavLink
									onClick={handleClear}
									to={`/articles/${article.articleId}`}
									key={`article-${index}`}
									className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1"
								 >
									<CiSearch size={20}/>
									<p className="font-thin text-gray-600">
										{article.articleTitle}
									</p>
								</NavLink>
							))}
						</div>
					)}

					{/* Club Suggestions */}
					{clubSuggestions?.clubs.length > 0 && (
						<div>
							<Divider text="Clubs" variant="left" textClassName="text-sm font-semibold"/>
							{clubSuggestions.clubs.map((club, index) => (
								<NavLink
									key={`club-${index}`}
									className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center"
									to={`/club/${club.clubId}`}
									onClick={handleClear}
								>
									<img
										src={club.clubProfilePicUrl}
										className="w-6 h-6 rounded-full object-cover object-center "
										alt=""
									/>
									<p className="font-bold  text-gray-600">
										{club.clubName}
									</p>
								</NavLink>
							))}
						</div>
					)}



					{/* Loading State */}
					{isLoading && (
						<p className="px-4 py-2 text-gray-500">Loading suggestions...</p>
					)}

					{/*/!* No Suggestions *!/*/}
					{/*{!isLoading &&*/}
					{/*	!articleSuggestions?.articles.length &&*/}
					{/*	!clubSuggestions?.clubs.length &&*/}
					{/*	!tagSuggestions?.tags.length && (*/}
					{/*		<p className="px-4 py-2 text-gray-500">No suggestions found.</p>*/}
					{/*	)}*/}
				</div>
			)}
		</div>
	)
}