import Avatar from "@/components/ui/Avatar.jsx";
import CommentActions from "@/components/CommentActions.jsx";
import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCommentReplies, replyToComment } from "@/utils/http/comments.js";
import { useParams } from "react-router-dom";
import {formatDateTimeVersion2} from "@/utils/formatters/dateFormatter.js";

export default function ArticleCommentItem({ comment, isReply = false }) {
	const [repliesViewed, setRepliesViewed] = useState(false);
	const params = useParams();
	const articleId = params.articleId;
	const queryClient = useQueryClient(); // Query client for cache manipulation

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["commentReplies", comment.commentId], // Unique key for this comment's replies
		queryFn: ({ pageParam = 1 }) => getCommentReplies(comment.commentId, pageParam, 10),
		getNextPageParam: (lastPage) => {
			// Ensure lastPage and lastPage.comments are defined before accessing properties
			if (!lastPage || !lastPage.comments) return undefined;
			const { pageNumber, totalPages } = lastPage.comments;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		},
		enabled: repliesViewed, // Only fetch when replies are viewed
		initialData: {
			pages: [], // Ensure pages array exists even if no data is fetched initially
			pageParams: [],
		},
	});

	const toggleViewReplies = () => {
		setRepliesViewed((prevState) => !prevState);
	};

	const handleScroll = (e) => {
		const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
		if (bottom && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const {
		mutate: replyCommentMutation,
	} = useMutation({
		mutationFn: replyToComment,
		onMutate: async (newReply) => {
			await queryClient.cancelQueries(["commentReplies", comment.commentId]);

			const previousReplies = queryClient.getQueryData(["commentReplies", comment.commentId]);

			// Ensure the optimistic update works even if there are no replies
			queryClient.setQueryData(["commentReplies", comment.commentId], (oldData) => {
				const defaultStructure = {
					pages: [
						{
							comments: {
								items: [],
							},
						},
					],
				};

				const data = oldData || defaultStructure;

				return {
					...data,
					pages: data.pages.map((page, index) =>
						index === 0
							? {
								...page,
								comments: {
									...page.comments,
									items: [
										{
											commentId: Date.now(), // Temporary ID
											userProfileImageUrl: newReply.userInfo.userProfilePicUrl,
											userInfo: {
												userId: newReply.userInfo.userId,
												username: newReply.userInfo.username,
												userProfilePicUrl: newReply.userInfo.userProfilePicUrl,
												reputationPoints: newReply.userInfo.reputationPoints,
												email: newReply.userInfo.email,
											},
											createdDateTime: new Date().toISOString(),
											updatedDateTime: new Date().toISOString(),
											commentBody: newReply.Content,
											voteCount: 0,
											voteType: 0, // Default vote type
											replyCount: 0,
										},
										...(page.comments.items || []),
									],
								},
							}
							: page
					),
				};
			});

			return { previousReplies };
		},
		onError: (err, newReply, context) => {
			queryClient.setQueryData(["commentReplies", comment.commentId], context.previousReplies);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["commentReplies", comment.commentId]);
		},
	});

	const onReply = (newReply) => {
		console.log(newReply);
		replyCommentMutation({
			ArticleId: articleId,
			ParentCommentId: comment.commentId,
			Content: newReply.commentBody,
			userInfo: {
				userId: newReply.userId,
				username: newReply.username,
				userProfilePicUrl: newReply.userProfilePicUrl,
			},
		});
		if(!repliesViewed) toggleViewReplies();
	};

	return (
		<div className="comment-container px-6 py-4 rounded-xl space-y-2">
			<div className="comment-header flex justify-between">
				<div className="comment-header-profile-info flex gap-2 items-center">
					<Avatar
						imageUrl={comment.userInfo.userProfilePicUrl}
						userName={comment.userInfo.username}
						userId={comment.userInfo.userId}
						variant="commentProfile"
					/>
					<div className="comment-header-profile-names flex flex-col">
						<p className="font-bold text-md">{comment.userInfo.username}</p>
						<p className="text-sm text-gray-600">{comment.userInfo.email}</p>
					</div>
				</div>
				<div className="comment-header-date-posted text-xxs font-bold">
					<p>{formatDateTimeVersion2(comment.createdDateTime)}</p>
				</div>
			</div>
			<div className="comment-body">{comment.commentBody}</div>
			<div className="comment-actionsgap-2">
				<CommentActions comment={comment} onReply={onReply} />
			</div>
			{comment.replyCount > 0 && (
				<button
					onClick={toggleViewReplies}
					className="hover:text-red-500 hover:underline text-sm gradient-text pl-2"
				>
					{repliesViewed ? "Hide Replies" :
					(
						<p>
							View Replies
							<span className="">{` (${comment.replyCount})`}</span>
						</p>)}

				</button>
			)}

			{/* Render replies with infinite scroll */}
			{repliesViewed && (
				<div
					className="comment-replies pl-8"
					onScroll={handleScroll}
					style={{ overflowY: "auto" }}
				>
					{data?.pages.map((page) =>
						page?.comments?.items?.map((reply) => (
							<ArticleCommentItem key={reply.commentId} comment={reply} isReply />
						))
					)}
					{isFetchingNextPage && <p>Loading more...</p>}
					{!isFetchingNextPage && !hasNextPage && data?.pages?.[0]?.comments?.totalCount === 0 && (
						<p>No more replies</p>
					)}
				</div>
			)}
		</div>
	);
}
