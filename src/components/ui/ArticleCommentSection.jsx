import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, getParentComments } from "@/utils/http/comments.js";
import ArticleCommentItem from "@/components/ArticleCommentItem.jsx";
import CommentInput from "@/components/CommentInput.jsx";
import { useParams } from "react-router-dom";
import { getUserIdFromToken } from "@/utils/token/token.js";
import { useSelector } from "react-redux";

export default function ArticleCommentSection() {
	const params = useParams();
	const articleId = params.articleId;
	const { userProfilePicUrl, username, reputationPoints } = useSelector(
		(state) => state.user
	);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["parentComments", articleId], // Unique key for the article's comments
		queryFn: ({ pageParam = 1 }) => getParentComments(articleId, pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.comments;
			return pageNumber < totalPages ? pageNumber + 1 : undefined; // Pagination check
		},
	});

	const handleScroll = (e) => {
		const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
		if (bottom && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	// Set up mutation for posting a comment
	const queryClient = useQueryClient(); // For cache manipulation
	const {
		mutate: postCommentMutation,
		isPending: isPostingComment,
		isError: isPostingCommentError,
		error: postCommentError,
	} = useMutation({
		mutationFn: createComment,
		// Optimistically update the UI before mutation completes
		onMutate: async (newComment) => {
			// Cancel any ongoing fetches to prevent inconsistent UI
			await queryClient.cancelQueries(["parentComments", articleId]);

			// Snapshot the previous comments
			const previousComments = queryClient.getQueryData(["parentComments", articleId]);

			// Optimistically add the new comment to the query data
			queryClient.setQueryData(["parentComments", articleId], (oldData) => {
				return {
					...oldData,
					pages: [
						{
							comments: {
								...oldData.pages[0].comments,
								items: [
									{
										commentId: Date.now(), // Temporary ID for optimism
										userProfilePicUrl,
										userInfo: {
											userId: getUserIdFromToken(),
											username,
											userProfilePicUrl,
											reputationPoints,
										},
										createdDateTime: new Date().toISOString(),
										commentBody: newComment.content,
										voteCount: 0,
										replyCount: 0,
									},
									...oldData.pages[0].comments.items, // Existing comments
								],
							},
						},
					],
				};
			});

			// Return a rollback function to undo optimistic update if mutation fails
			return { previousComments };
		},
		// If mutation fails, rollback the optimistic update
		onError: (err, newComment, context) => {
			queryClient.setQueryData(
				["parentComments", articleId],
				context.previousComments
			);
		},
		// Refetch the comments after the mutation succeeds
		onSuccess: () => {
			queryClient.invalidateQueries(["parentComments", articleId]);
		},
	});

	// Flatten comments from all pages
	const comments = data?.pages.flatMap((page) => page.comments.items) || [];

	const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

	const onPostComment = (commentBody) => {
		postCommentMutation({
			commentCreatorId: getUserIdFromToken(),
			articleId: articleId,
			content: commentBody,
		});
	};

	return (
		<div className="pt-8 space-y-4">
			<CommentInput
				articleId={articleId}
				onPost={onPostComment}
				isPostingComment={isPostingComment}
			/>
			<div className="overflow-y-auto " onScroll={handleScroll}>
				{comments.length === 0 && !isFetchingNextPage && <p></p>}
				{comments.map((comment) => (
					<div key={comment.commentId}
					     className="mb-3 bg-surface-100 rounded-3xl overflow-hidden"
					>
						<ArticleCommentItem comment={comment} />
					</div>
				))}
				{/* Show loading indicator when fetching the next page */}
				{isFetchingNextPage && <p>Loading more comments...</p>}
				{/* If there are no more comments */}
				{!isFetchingNextPage && !hasNextPage && <p></p>}
			</div>
		</div>
	);
}
