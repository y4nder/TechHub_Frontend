import {useInfiniteQuery} from "@tanstack/react-query";
import {getReadArticles} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import ReadHistoryContainer from "@/components/ReadHistoryContainer.jsx";

export default function ReadHistoryPage(){
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["articles", "read"],
		queryFn: ({ pageParam = 1 }) =>
			getReadArticles(getUserIdFromToken(), pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		},
	});

	const articles =
		data?.pages.flatMap((page) => page.articles.items) || [];

	return(
		<div>
			{articles.map(article => (
				<ReadHistoryContainer
					key={article.articleId}
					article={article}
				/>
			))}
		</div>
	)
}