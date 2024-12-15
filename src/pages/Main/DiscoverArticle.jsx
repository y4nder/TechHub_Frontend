import { fetchDiscoverArticles } from "@/utils/http/articles.js";
import { useInfiniteQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/ArticleCard.jsx";
import DynamicList from "@/components/pagination/DynamicList.jsx";

export default function DiscoverArticlePage() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["taggedArticles"],
        queryFn: ({ pageParam = 1 }) => fetchDiscoverArticles(pageParam, 10),
        getNextPageParam: (lastPage) => {
            const { pageNumber, totalPages } = lastPage.articles;
            return pageNumber < totalPages ? pageNumber + 1 : undefined;
        },
    });

    const articles = data?.pages.flatMap((page) => page.articles.items) || [];

    return (
        <div className={`flex-1 bg-surface-50 min-h-screen max-h-full transition-all p-8`}>
            <div className={`justify-center `}>
                {/*<ArticleList*/}
                {/*    articles={articles}*/}
                {/*    hasNextPage={hasNextPage}*/}
                {/*    fetchNextPage={fetchNextPage}*/}
                {/*    isFetchingNextPage={isFetchingNextPage}*/}
                {/*/>*/}
                <DynamicList
                   items={articles}
                   hasNextPage={hasNextPage}
                   fetchNextPage={fetchNextPage}
                   isFetchingNextPage={isFetchingNextPage}
                   containerStyle="flex flex-wrap sm:flex-col md:flex-row lg:flex-wrap gap-8"
                   renderItem={(article, ref) => (
                      <ArticleCard ref={ref} key={article.articleId.toString()} article={article} />
                   )}
                />
            </div>
        </div>
    );
}
