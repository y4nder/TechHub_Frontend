import ArticleTag from "@/components/ui/ArticleTag.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import {formatDateTimeVersion2} from "@/utils/formatters/dateFormatter.js";
import ArticleDisplay from "@/components/ArticleDisplay.jsx";

export default function PreviewArticle({ article }) {
	if (!article) {
		return <div>No article data available.</div>;
	}

	return (
		<div className="bg-surface-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
			{/* Article Title */ }
			<h2 className="text-xl font-semibold text-obsidianBlack-500">
				{ article.articleTitle }
			</h2>

			{/* Tags */ }
			<div className="flex flex-wrap gap-2 mt-2">
				{ article.tags.map((tag) => (
					<ArticleTag key={ tag.tagId } tag={ tag }/>
				)) }
			</div>

			{/* Metadata */ }
			<div className="mt-4 flex items-center gap-4">
				<Avatar
					imageUrl={ article.author.userProfilePicUrl }
					userName={ article.author.username }
					userId={ article.author.userId }
				/>
				<div>
					<p className="text-sm font-medium">{ article.author.username }</p>
					<p className="text-xs text-gray-500">
						{ `Posted on ${ formatDateTimeVersion2(article.createdDateTime) }` }
					</p>
				</div>
			</div>
			<div className="mt-6">
				{/*<p className="break-words">{article.articleContent}</p>*/ }
				<ArticleDisplay htmlContent={ article.articleHtmlContent }/>
			</div>
		</div>
	);
}
