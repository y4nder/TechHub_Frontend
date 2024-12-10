import {useSidebar} from "@/hooks/useSidebar.jsx";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getBookmarkedArticles} from "@/utils/http/articles.js";
import ArticleList from "@/components/ArticleList.jsx";

export default function BookmarkedArticlesPage() {
	const userId = getUserIdFromToken(); // Replace with the actual user ID

	// Infinite query for fetching articles
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["articles", "bookmarks"],
		queryFn: ({ pageParam = 1 }) =>
			getBookmarkedArticles(userId, pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		},
	});

	// Flatten articles from all pages
	const articles =
		data?.pages.flatMap((page) => page.articles.items) || [];

	return (
		<div className={`flex-1 transition-all`}>
			<div
				className={`justify-center py-10 px-8`}
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