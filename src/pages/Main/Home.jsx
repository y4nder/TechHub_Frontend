import { useSidebar } from "@/hooks/useSidebar.jsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserIdFromToken } from "@/utils/token/token.js";
import { fetchHomeArticles } from "@/utils/http/articles.js";
import ArticleList from "@/components/ArticleList.jsx";

export default function HomePage() {
	const { expanded } = useSidebar();
	const userId = getUserIdFromToken(); // Replace with the actual user ID

	// Infinite query for fetching articles
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["homeArticles", userId],
		queryFn: ({ pageParam = 1 }) =>
			fetchHomeArticles(userId, pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		},
	});

	// Flatten articles from all pages
	const articles =
		data?.pages.flatMap((page) => page.articles.items) || [];

	return (
		<div className={`flex-1 bg-surface-500 transition-all 
		${
			expanded ? "pl-[375px] pr-[100px]" : "pl-[20px]"
		}`}>
			<div
				className={`justify-center pt-8 pb-8 min-h-screen pr-8 ${
					!expanded ? "pl-[80px]" : ""
				}`}
			>
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
