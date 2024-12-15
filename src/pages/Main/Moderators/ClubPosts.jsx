import {useInfiniteQuery} from "@tanstack/react-query";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {useParams} from "react-router-dom";
import DynamicList from "@/components/pagination/DynamicList.jsx";
import ArticleListItem from "@/components/pagination/paginatedItems/ArticleListItem.jsx";
import {getClubArticlesForMod} from "@/utils/http/moderators.js";

export default function ClubPostsPage() {
	const userId = getUserIdFromToken();
	const {clubId} = useParams();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["articles", "club", clubId],
		queryFn: ({ pageParam = 1 }) =>
			getClubArticlesForMod(clubId, userId, pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		}
	});

	const articles =
		data?.pages.flatMap((page) => page.articles.items) || [];

	const headerItems = ["Title", "Post Date", "Author", "Votes", "Comments","Status", "Pinned", "Actions"]

	return(
		<div className="border p-6 border-black-75 rounded-2xl mt-8">
			<div className={ `grid grid-cols-8 mb-8 mt-3 gap-3` }>
				{headerItems.map((header, index) => (
					<Cell label={header} key={index} />
				))}
			</div>
			<DynamicList
				items={ articles }
				hasNextPage={ hasNextPage }
				fetchNextPage={ fetchNextPage }
				isFetchingNextPage={ isFetchingNextPage }
				containerStyle="flex-col gap-3"
				renderItem={ (article, ref) => (
					<ArticleListItem ref={ ref } key={article.articleId.toString()} article={article} />
				)}
			/>
		</div>
	)

	function Cell({label}){
		return (
			<div className="pr-3 font-bold">
				<p>{label}</p>
			</div>
		)
	}
}