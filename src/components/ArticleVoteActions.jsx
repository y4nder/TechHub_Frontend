import {BiCommentDetail, BiDownvote, BiUpvote} from "react-icons/bi";
import {RxDividerVertical} from "react-icons/rx";
import {MdBookmarkBorder} from "react-icons/md";
import {PiShareFatLight} from "react-icons/pi";
import {useEffect, useState} from "react";
import {
	bookmarkArticle,
	downVoteArticle,
	removeArticleVote,
	unBookmarkArticle,
	upVoteArticle
} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";

export default function ArticleVoteActions(
	{
		article,
		onlyVote,
	})
{
	const upvote = "up";
	const downVote = "down";

	const [voteType, setVoteType] = useState(null);
	const [voteCount, setVoteCount] = useState(article.voteCount);
	const [commentCount, setCommentCount] = useState(article.commentCount);
	const [bookmarked, setBookmarked] = useState(article.bookmarked);

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

	const handleUpvote = async () => {
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

	const onCommentClick = () => {

	}

	const onBookmarkToggle = async() => {
		if(bookmarked){
			console.log("removing bookmark");
			await unBookmarkArticle(getUserIdFromToken(), article.articleId);
		} else {
			console.log("adding bookmark")
			await bookmarkArticle(getUserIdFromToken(), article.articleId);
		}
		setBookmarked(prevState => !prevState);
	}

	const onShareClick = () => {

	}
	
	return (
		<div className="flex pt-2">
			{/* Vote actions */}
			<div className="flex items-center bg-surface-500 rounded-xl">
				<div
					className={`
            flex flex-row 
            gap-2 cursor-pointer 
            py-2 px-2 
            rounded-xl
            ${voteType === upvote ? "bg-green-200 text-green-500" : ""} 
            hover:bg-green-200
            hover:text-green-500
            transition-all duration-200 
          `}
					onClick={handleUpvote}
				>
					<BiUpvote size={20} />
					<p>{voteCount}</p>
				</div>
				<RxDividerVertical size={20} className="text-black-75 flex" />
				<div
					className={`
            flex flex-row 
            gap-2 cursor-pointer 
            py-2 px-2 
            rounded-xl 
            ${voteType === downVote ? "bg-red-100 text-red-500" : ""}
            hover:bg-red-100 
            hover:text-red-500
            transition-all duration-200 
          `}
					onClick={handleDownVote}
				>
					<BiDownvote size={20} />
				</div>
			</div>

			{!onlyVote && (
				<>
					<div className="flex flex-grow items-center gap-4 pl-4">
						<div
							className="flex items-center gap-1 cursor-pointer rounded-xl py-2 px-2 text-black-100 hover:bg-cyan-100 hover:text-cyan-500 transition-all duration-200"
							onClick={onCommentClick}
						>
							<BiCommentDetail size={20} />
							<p className="text-md font-bold">{commentCount}</p>
						</div>
						<div
							className={`flex items-center gap-1 cursor-pointer rounded-xl py-2 px-2 transition-all duration-200 ${
								bookmarked
									? "bg-orange-100 text-orange-500"
									: "text-black-100 hover:bg-orange-100 hover:text-orange-500"
							}`}
							onClick={onBookmarkToggle}
						>
							<MdBookmarkBorder size={20} />
						</div>
						<div
							className="flex items-center gap-1 cursor-pointer rounded-xl py-2 px-2 text-black-100 hover:bg-purple-100 hover:text-purple-800 transition-all duration-200"
							onClick={onShareClick}
						>
							<PiShareFatLight size={20} />
						</div>
					</div>
				</>
			)}
		</div>
	);
}