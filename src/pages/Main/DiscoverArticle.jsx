import {fetchDiscoverArticles} from "@/utils/http/articles.js";
import ArticleList from "@/components/ArticleList.jsx";
import {useInfiniteQuery} from "@tanstack/react-query";


export default function DiscoverArticlePage(){

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["taggedArticles"],
		queryFn: ({ pageParam = 1 }) => fetchDiscoverArticles(pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		},
	});

	const articles =
		data?.pages.flatMap((page) => page.articles.items) || [];

	return (
		<div 	className={`flex-1 bg-surface-500 transition-all p-8`}>
			<div
				className={ `justify-center ` }
			>
				<ArticleList
					articles={ articles }
					hasNextPage={ hasNextPage }
					fetchNextPage={ fetchNextPage }
					isFetchingNextPage={ isFetchingNextPage }
				/>
			</div>
		</div>
	)
}