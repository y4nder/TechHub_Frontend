import { useRef, useCallback } from "react";
import ArticleCard from "@/components/ArticleCard.jsx";

export default function ArticleList({
	                                    articles,
	                                    hasNextPage,
	                                    fetchNextPage,
	                                    isFetchingNextPage,
                                    }) {
	const observer = useRef();

	// IntersectionObserver to detect when scrolling reaches the bottom
	const lastArticleRef = useCallback(
		(node) => {
			if (isFetchingNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isFetchingNextPage, hasNextPage, fetchNextPage]
	);

	return (
		<div
			className="flex flex-wrap gap-6 sm:flex-col md:flex-row lg:flex-wrap"
		>
			{articles.map((article, index) => {
				// Attach ref to the last article for infinite scroll
				const isLastArticle = articles.length === index + 1;
				return (
					<ArticleCard
						ref={isLastArticle ? lastArticleRef : null}
						key={article.articleId.toString()}
						article={article}
					/>
				);
			})}
			{/* Show a loading indicator when fetching the next page */}
			{isFetchingNextPage && <p>Loading more...</p>}
		</div>
	);
}
