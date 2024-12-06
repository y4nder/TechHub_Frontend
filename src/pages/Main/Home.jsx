import { useSidebar } from "@/hooks/useSidebar.jsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserIdFromToken } from "@/utils/token/token.js";
import { fetchHomeArticles } from "@/utils/http/articles.js";
import ArticleList from "@/components/ArticleList.jsx";

export default function HomePage() {
	const userId = getUserIdFromToken(); // Replace with the actual user ID

	// Infinite query for fetching articles
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["articles", "home", userId],
		queryFn: ({ pageParam = 1 }) =>
			fetchHomeArticles(pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		},
	});

	// Flatten articles from all pages
	const articles =
		data?.pages.flatMap((page) => page.articles.items) || [];

	return (
		<div className={`flex-1 bg-surface-500 transition-all p-8`}>
			<div className={`justify-center `}>
				<ArticleList
					articles={articles}
					hasNextPage={hasNextPage}
					fetchNextPage={fetchNextPage}
					isFetchingNextPage={isFetchingNextPage}
				/>
			</div>
		</div>
	);
}
