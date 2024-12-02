import {formatDateTimeVersion2, parseDate} from "@/utils/formatters/dateFormatter.js";
import ArticleDetailTag from "@/components/ui/ArticleDetailTag.jsx";
import ArticleVoteActions from "@/components/ArticleVoteActions.jsx";

export default function UpVotedContainer({article}) {
	return (
		<div className="p-4 border border-b-black-75 space-y-4">
			<div className="upvote-header flex gap-4">
				<img
					src={ article.clubImageUrl }
					className="w-12 h-12 object-cover rounded-full"
					alt=""
				/>
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-md">{ article.clubName }</h1>
					<p className="text-sm font-thin">Posted on {parseDate(article.createdDateTime)}</p>
				</div>
			</div>
			<div className="upvote-body">
				<h1 className="font-bold text-lg">{article.articleTitle}</h1>
				{article.tags.map(tag => (
					<ArticleDetailTag
						key={tag.tagId}
						tag={tag}
					/>
				))}
			</div>
			<div className="upvote-actions">
				<ArticleVoteActions article={article} />
			</div>
		</div>
	)
}