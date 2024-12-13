import { FaHashtag } from "react-icons/fa6";
import {NavLink} from "react-router-dom";

export default function ArticleTag({ tag, altText, isTrending, isDiscover, onNavigate }) {
	// Default styles for the container and content
	let containerClass =
		"px-2.5 py-1 rounded-full cursor-pointer bg-blue-100 bg-opacity-20 border border-blue-200";
	let contentClass =
		"text-nowrap line-clamp-1  text-blue-800 text-opacity-70";
	let iconSize = 12;
	let fontSize = "text-xxs";


	// Styles for discover tags
	if (isDiscover) {
		contentClass =
			"text-nowrap line-clamp-1 hover:underline text-blue-800 text-opacity-70";
		fontSize = "text-sm";
		iconSize = 14;
	}

	// Styles for trending tags
	if (isTrending) {
		containerClass =
			"px-2.5 py-1 rounded-xl cursor-pointer bg-blue-100 bg-opacity-20 border border-blue-200";
		contentClass =
			"font-bold text-nowrap line-clamp-1 hover:underline text-blue-800 text-opacity-70";
		fontSize = "text-md";
		iconSize = 18;
	}




	return (
		<div className={"w-fit " + containerClass}>
			{/*<NavLink*/}
			{/*	*/}
			{/*	to={`/tags/${tag.tagId}`}*/}
			{/*	className={"flex gap-1 items-center h-fit " + contentClass}>*/}
			{/*	/!* Show the hashtag icon if not trending or discover, otherwise show '#tag' *!/*/}
			{/*	{isDiscover || isTrending ? (*/}
			{/*		<FaHashtag size={iconSize} />*/}
			{/*	) : (*/}
			{/*		<p className={fontSize}>#</p>*/}
			{/*	)}*/}
			{/*	/!* Display the tag name or alt text *!/*/}
			{/*	<p className={fontSize}>{altText ? altText : tag.tagName}</p>*/}
			{/*	/!* Display tag count if it's trending *!/*/}
			{/*	{isTrending && <p>({tag.tagCount})</p>}*/}
			{/*</NavLink>*/}
			<TagWrapper>
				{/* Show the hashtag icon if not trending or discover, otherwise show '#tag' */}
				{isDiscover || isTrending ?  (
					<FaHashtag size={iconSize} />
				) : (
					!altText ? (<p className={ fontSize }>#</p>)  : ''

				) }
				{/* Display the tag name or alt text */}
				<p className={fontSize}>{altText ? altText : tag.tagName}</p>
				{/* Display tag count if it's trending */}
				{isTrending && <p>({tag.tagCount})</p>}
			</TagWrapper>
		</div>
	);

	function TagWrapper({children}){
		if(altText) {
			return  (
				<div className={"flex gap-1 items-center h-fit " + contentClass}>
					{children}
				</div>
			)
		} else {
			return (
				<NavLink
					onClick={onNavigate}
					className={"hover:underline flex gap-1 items-center h-fit " + contentClass}
					to={`/tags/${tag.tagId}`}
				>
					{children}
				</NavLink>
			)
		}
	}
}
