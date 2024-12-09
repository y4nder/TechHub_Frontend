import { useRef, useEffect } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import FollowerItemList from "./FollowerItemList";

export default function FollowersList({fetchFn, fetchKey}) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
        queryKey: ["user", "follows", fetchKey],
        queryFn: ({ pageParam = 1 }) => fetchFn(pageParam, 10),
        getNextPageParam: (lastPage) => {
            const { pageNumber, totalPages } = lastPage.users;
            return pageNumber < totalPages ? pageNumber + 1 : undefined;
        },
    });

    const loadMoreRef = useRef();

    // Infinite scrolling with Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) return <div>Loading followers...</div>;
    if (isError) return <div>Something went wrong while loading followers.</div>;

    return (
        <div className="followers-list">
            <ul>
                {data.pages.map((page, pageIndex) =>
                    page.users.items.map((user, index) => (
                        <li
                            key={`${pageIndex}-${index}`}
                            className="follower-item"
                        >
                            <FollowerItemList user={user} />
                        </li>
                    ))
                )}
            </ul>

            <div
                ref={loadMoreRef}
                className="load-more"
            >
                {isFetchingNextPage ? <p>Loading more...</p> : hasNextPage ? <p>Scroll down to load more</p> : <p></p>}
            </div>
        </div>
    );
}
