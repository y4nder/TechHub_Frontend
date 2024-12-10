import {forwardRef, useEffect, useState} from 'react';
import ArticleTag from "@/components/ui/ArticleTag.jsx";
import { BiCommentDetail, BiDownvote, BiUpvote } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import { MdBookmarkBorder } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import Button from "@/components/ui/Button.jsx";
import { parseDate } from "@/utils/formatters/dateFormatter.js";
import {useNavigate} from "react-router-dom";
import {
	bookmarkArticle,
	downVoteArticle,
	removeArticleVote,
	unBookmarkArticle,
	upVoteArticle
} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import Avatar from "@/components/ui/Avatar.jsx";

const upvote = "up";
const downVote = "down";

const ArticleCard = forwardRef(({ article }, ref) => {
	const visibleTags = article.tags.slice(0, 4);
	const overflowCount = article.tags.length - visibleTags.length;
	const [isHovered, setIsHovered] = useState(false);
	const [voteCount, setVoteCount] = useState(article.voteCount);
	const [voteType, setVoteType] = useState(null);
	const [bookmarked , setBookmarked] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if(article.voteType === 0){
			setVoteType(null);
		} else if(article.voteType === 1){
			setVoteType(upvote);
		}else {
			setVoteType(downVote)
		}
		setBookmarked(article.bookmarked);
	}, [article.voteType]);


	const toggleUpvote = async () => {
		if (voteType === upvote) {
			// Remove upvote
			setVoteCount((prev) => prev - 1);
			setVoteType(null);
			console.log("Upvote removed");
			await removeArticleVote(getUserIdFromToken(), article.articleId);
		} else {
			// Add or switch to upvote
			setVoteCount((prev) => (voteType === downVote ? prev + 2 : prev + 1));
			setVoteType(upvote);
			console.log("Upvoted");
			await upVoteArticle(getUserIdFromToken(), article.articleId);
		}
	};

	const handleDownVote = async () => {
		if (voteType === downVote) {
			// Remove downvote
			setVoteCount((prev) => prev + 1);
			setVoteType(null);
			console.log("Downvote removed");
			await removeArticleVote(getUserIdFromToken(), article.articleId);
		} else {
			// Add or switch to downvote
			setVoteCount((prev) => (voteType === upvote ? prev - 2 : prev - 1));
			setVoteType(downVote);
			console.log("Downvoted");
			await downVoteArticle(getUserIdFromToken(), article.articleId);
		}
	};

	const handleArticleClicked = () => {
		navigate(`/articles/${article.articleId}`);
	}

	const toggleBookmark = async() => {
		if(bookmarked){
			console.log("removing bookmark");
			await unBookmarkArticle(getUserIdFromToken(), article.articleId);
		} else {
			console.log("adding bookmark")
			await bookmarkArticle(getUserIdFromToken(), article.articleId);
		}

		setBookmarked(prevState => !prevState);
	}


	return (
		<div
			ref={ref}  // Attach the forwarded ref here
			className={`
               flex flex-col 
				  justify-between 
				  border 
				  ${isHovered ? 'border-lightPurple-200' : 'border-black-50'} 
				  rounded-3xl 
				  pt-6 px-4 pb-2
				  w-[325px] max-h-[500px]
				  bg-lightPurple-10
					drop-shadow-sm
				 
            `}
			onMouseEnter={() => setIsHovered(true)}  // Set hover state to true when mouse enters
			onMouseLeave={() => setIsHovered(false)} // Set hover state to false when mouse leaves
		>
			{/* Header part */}
			<div className="flex flex-col w-full gap-6"
			     onClick={handleArticleClicked}
			>
				{/* Profiles part */}
				<div className="flex gap-2">
					<div className="flex flex-row gap-2">
						<img
							src={article.clubImageUrl}
							alt="clubimage"
							className="w-8  rounded-full object-cover"
						/>
						{/*<img*/}
						{/*	src={article.userImageUrl}*/}
						{/*	alt={article.userImageUrl}*/}
						{/*	className="w-8 h-8 object-cover rounded-md"*/}
						{/*/>*/}
						<Avatar
							imageUrl={article.userImageUrl}
							userName={article.authorName}
							userId={article.authorId}
							// variant='navProfile'
						/>
					</div>
					{/* Dynamic content rendered on hover */}
					{isHovered && (
						<div className="article-card-header flex justify-end items-center w-full " onClick={() => console.log(article.articleId + " clicked")}>
							<Button className={`
                                text-md 
                                bg-obsidianBlack-500 text-white 
                                px-2 py-1 
                                rounded-lg 
                                text-center
                                hover:bg-gradient-to-tr from-darkPurple-500 to-brightOrange-500
                                hover:shadow-xl
                                transition-all duration-300
                            `}
								onClick={handleArticleClicked}
							>
								Read Post
							</Button>
						</div>
					)}
				</div>
				<div className="">
					<h1 className="text-xl font-semibold text-gray-900 break-word line-clamp-3">
						{article.articleTitle}
					</h1>
				</div>
			</div>
			{/* Tags Container */}
			<div className="flex flex-col ">
				<div className="flex items-center flex-wrap gap-2 py-2">
					{ visibleTags.map((tag) => (
						<ArticleTag key={ tag.tagId } tagName={ `#${ tag.tagName }` }/>
					)) }
					{/* Overflow indicator */ }
					{ overflowCount > 0 &&
						<ArticleTag tagName={ `+${ overflowCount }` }/>
					}
				</div>
				<p className="text-xxs pb-2 font-thin text-surface-900 pl-2">
					{ parseDate(article.createdDateTime) }
				</p>

				{/* Thumbnail part */ }
				<div className="flex items-center justify-center h-[180px] overflow-hidden rounded-3xl">
					<img
						src={ article.articleThumbnailUrl }
						alt="Thumbnail"
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
					/>
				</div>
				{/* Actions part */ }
				<div className="flex pt-2">
					{/* Vote actions */ }
					<div className="flex items-center bg-surface-500 rounded-xl">
						<div
							className={ `
                                flex flex-row 
                                gap-2 cursor-pointer 
                                py-2 px-2 
                                rounded-xl
                                ${ voteType === upvote ? 'bg-green-200 text-green-500' : ' ' } 
                                hover:bg-green-200
                                hover:text-green-500
                                transition-all duration-200 
                            ` }
							onClick={ toggleUpvote }
						>
							<BiUpvote size={ 20 }/>
							<p className="">{ voteCount }</p>
						</div>
						<RxDividerVertical size={ 20 } className="text-black-75 flex"/>
						<div
							className={ `
                                flex flex-row 
                                gap-2 cursor-pointer 
                                py-2 px-2 
                                rounded-xl 
                                ${ voteType === downVote ? 'bg-red-100 text-red-500' : ' ' }
                                hover:bg-red-100 
                                hover:text-red-500
                                transition-all duration-200 
                            ` }
							onClick={ handleDownVote }
						>
							<BiDownvote size={ 20 }/>
						</div>
					</div>
					{/* Article actions */ }
					<div className="flex flex-grow items-center justify-between pl-4">
						<div className={ `
                            flex items-center gap-1 cursor-pointer
                            rounded-xl 
                            py-2 px-2 
                            text-black-100
                            hover:bg-cyan-100
                            hover:text-cyan-500
                            transition-all duration-200 
                        ` }
						     onClick={ () => console.log("comment clicked") }
						>
							<BiCommentDetail size={ 20 }/>
							<p className="text-md font-bold">{ article.commentCount }</p>
						</div>
						<div
							className={ `
						      flex items-center gap-1 cursor-pointer
						      rounded-xl 
						      py-2 px-2 
						      transition-all duration-200
						      ${
								bookmarked
									? "bg-orange-100 text-orange-500"
									: "text-black-100 hover:bg-orange-100 hover:text-orange-500"
							}
					      ` }
							onClick={ toggleBookmark } // Disable click while loading
						>
							<MdBookmarkBorder size={ 20 }/>
						</div>
						<div className={ `
                            flex items-center gap-1 cursor-pointer
                            rounded-xl 
                            py-2 px-2 
                            text-black-100
                            hover:bg-purple-100
                            hover:text-purple-800
                            transition-all duration-200 
                        ` }
						     onClick={ () => console.log("share clicked") }
						>
							<PiShareFatLight size={ 20 }/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default ArticleCard;
