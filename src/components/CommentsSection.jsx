import CommentInput from "@/components/CommentInput.jsx";
import CommentsList from "@/components/CommentList.jsx";
import { useSelector } from "react-redux";
import { getUserIdFromToken } from "@/utils/token/token.js";
import { useComments } from "@/hooks/useComments.jsx";
import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCommentsByArticleId } from "@/utils/http/comments.js";

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

export default function CommentSection({ articleId }) {
	const { comments, addComment } = useComments();

	// Infinite query for fetching paginated comments
	const {
		data: commentsData,
		isLoading: isCommentsLoading,
		error: commentsError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["comments", articleId],
		queryFn: ({ pageParam = 1 }) => fetchCommentsByArticleId(articleId, pageParam, 10),
		getNextPageParam: (lastPage) =>
			lastPage.comments?.totalPages > lastPage.comments?.pageNumber
				? lastPage.comments?.pageNumber + 1
				: undefined,
	});

	// Ref for detecting scroll
	const loadMoreRef = useRef();

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 1.0 }
		);

		if (loadMoreRef.current) observer.observe(loadMoreRef.current);

		return () => {
			if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const { userProfilePicUrl, username, reputationPoints } = useSelector(
		(state) => state.user
	);

	const handleCreateComment = (commentBody) => {
		const tempId = generateId();
		const newComment = {
			commentId: tempId,
			userProfileImageUrl: userProfilePicUrl,
			userInfo: {
				userId: getUserIdFromToken(),
				username: username,
				userProfilePicUrl: userProfilePicUrl,
				reputationPoints: reputationPoints,
			},
			commentBody: commentBody,
		};

		addComment(newComment);
	};

	// Combine fetched comments with local comments
	const combinedComments = [
		...(commentsData?.pages.flatMap((page) => page.comments.items) || []),
		...comments,
	];

	return (
		<div className="mt-8 flex flex-col gap-2">
			<CommentInput onPost={handleCreateComment} />

			{/* Display comments */}
			<CommentsList comments={combinedComments} />

			{/* Infinite scroll loader */}
			{hasNextPage && (
				<div ref={loadMoreRef} className="loader">
					{isFetchingNextPage && <p>Loading more comments...</p>}
				</div>
			)}

			{/* Error display */}
			{commentsError && (
				<p className="text-red-500">
					Error loading comments: {commentsError.message}
				</p>
			)}

			{/* Loading state */}
			{isCommentsLoading && <p>Loading comments...</p>}
		</div>
	);
}
