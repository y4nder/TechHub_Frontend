import {fetchDiscoverArticles} from "@/utils/http/articles.js";
import ArticleList from "@/components/ArticleList.jsx";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useSidebar} from "@/hooks/useSidebar.jsx";
import {getUserIdFromToken} from "@/utils/token/token.js";

export default function DiscoverArticlePage(){
	const { expanded } = useSidebar();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["taggedArticles"],
		queryFn: ({ pageParam = 1 }) => fetchDiscoverArticles( getUserIdFromToken() ,pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		},
	});

	const articles =
		data?.pages.flatMap((page) => page.articles.items) || [];

	return (
		<div 	className={`flex-1 bg-surface-500 transition-all ${
			expanded ? "pl-[375px] pr-[100px]" : "pl-[20px]"
		}`}>
			<div
				className={ `justify-center pt-8 pb-8 min-h-screen pr-8 ${
					!expanded ? "pl-[80px]" : ""
				}` }
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