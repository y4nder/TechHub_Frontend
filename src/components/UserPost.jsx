import ArticleDetailTag from "@/components/ui/ArticleDetailTag.jsx";
// import ArticleActions from "@/components/ArticleActions.jsx";
import {useEffect, useState} from "react";
import {
	bookmarkArticle,
	downVoteArticle,
	removeArticleVote,
	unBookmarkArticle,
	upVoteArticle
} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {useNavigate} from "react-router-dom";
import ArticleVoteActions from "@/components/ArticleVoteActions.jsx";
import Avatar from "@/components/ui/Avatar.jsx";

export default function UserPost({article}) {
	const [voteCount, setVoteCount] = useState(article.voteCount);
	const [voteType, setVoteType] = useState(null);
	const [bookmarked , setBookmarked] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if(article.voteType === 0){
			setVoteType(null);
		} else if(article.voteType === 1){
			setVoteType("up");
		}else {
			setVoteType("down")
		}
		setBookmarked(article.bookmarked);
	}, [article.voteType, article.bookmarked]);

	const handleReadPost = () => {
		navigate(`/articles/${article.articleId}`);
	}


	const toggleUpvote = async () => {
		if (voteType === "up") {
			// Remove upvote
			setVoteCount((prev) => prev - 1);
			setVoteType(null);
			console.log("Upvote removed");
			await removeArticleVote(getUserIdFromToken(), article.articleId);
		} else {
			// Add or switch to upvote
			setVoteCount((prev) => (voteType === "down" ? prev + 2 : prev + 1));
			setVoteType("up");
			console.log("Upvoted");
			await upVoteArticle(getUserIdFromToken(), article.articleId);
		}
	};

	const handleDownVote = async () => {
		if (voteType === "down") {
			// Remove downvote
			setVoteCount((prev) => prev + 1);
			setVoteType(null);
			console.log("Downvote removed");
			await removeArticleVote(getUserIdFromToken(), article.articleId);
		} else {
			// Add or switch to downvote
			setVoteCount((prev) => (voteType === "up" ? prev - 2 : prev - 1));
			setVoteType("down");
			console.log("Downvoted");
			await downVoteArticle(getUserIdFromToken(), article.articleId);
		}
	};

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

	return(
		<div className="p-4 space-y-4 border border-b-black-75">
			<div className="header flex justify-between items-center">
				<div className="flex gap-2">
					<img
						src={ article.clubImageUrl }
						className="w-8 h-8 object-cover rounded-full"
						alt=""
					/>
					{/*<img*/}
					{/*	src={ article.userImageUrl }*/}
					{/*	className="w-8 h-8 object-cover rounded-lg"*/}
					{/*	alt=""*/}
					{/*/>*/}
					<Avatar
						imageUrl={article.userImageUrl}
						userName={article.authorName}
						userId={article.authorId}
						variant=''
					/>
				</div>
				<button
					className="bg-darkOrange-500 text-white text-sm px-3 py-2 rounded-xl hover:bg-brightOrange-500"
					onClick={handleReadPost}
				>
					Read Post
				</button>
			</div>
			<div className="article-body flex justify-between gap-2">
				<div className="article-details flex w-full flex-col justify-between">
					<h1 className="text-2xl font-bold">{article.articleTitle}</h1>
					<div className="article-tag-container flex gap-2 flex-wrap">
						{article.tags.map((tag) => (
							<ArticleDetailTag key={tag.tagId} tag={tag}/>
						))}
					</div>
				</div>
				<div className="article-thumbnail">
					<img
						src={ article.articleThumbnailUrl }
						className="h-24 object-cover rounded-2xl"
						alt=""
					/>
				</div>
			</div>
			<div className="actions">
				<ArticleVoteActions article={article} />
			</div>
		</div>
	)
}