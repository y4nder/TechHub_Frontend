import ArticleVoteActions from "@/components/ArticleVoteActions.jsx";

export default function ReadHistoryContainer({article}) {
	return(
		<div className="p-4 ">
			<div className="readHistoryContainer flex gap-3 justify-between p-4 bg-surface-500 rounded-3xl">
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