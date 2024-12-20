import ArticleVoteActions from "@/components/ArticleVoteActions.jsx";
import {useNavigate} from "react-router-dom";

export default function ReadHistoryContainer({article}) {
	const navigate = useNavigate();
	return(
		<div className="p-4 " onClick={() => navigate(`/articles/${article.articleId}`)}>
			<div className="readHistoryContainer flex gap-3 justify-between p-4 bg-surface-500 hover:bg-lightPurple-10 rounded-3xl">
				<div className="readHistoryContainer__header flex gap-3">
					<div className="read-thumbnail">
						<img
							src={article.articleThumbnailUrl}
							className="w-44 object-cover rounded-2xl"
							alt="articleThumbnail"
						/>
					</div>
					<div className="read-articleBody">
						<img
							src={ article.clubImageUrl }
							className="w-8 h-8 rounded-full object-cover"
							alt="articleThumbnail"
						/>
						<h1>{article.articleTitle}</h1>
						<p>{article.voteCount} upvotes</p>
					</div>
				</div>
				<div className="read-actions">
					<ArticleVoteActions article={article} onlyVote/>
				</div>
			</div>
		</div>
	)
}