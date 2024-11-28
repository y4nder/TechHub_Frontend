import React, { useState, useCallback } from "react";
import CommentsList from "@/components/CommentList.jsx";
import { formatDateTimeVersion2 } from "@/utils/formatters/dateFormatter.js";
import CommentVoteActions from "./CommentVoteActions";

export default function CommentItem({ comment, isReply = true }) {
	const [commentVoteCount, setCommentVoteCount] = useState(comment.voteCount);
	const [commentVoteType, setCommentVoteType] = useState(null);
	const [replying, setReplying] = useState(false);

	const toggleCommentUpvote = useCallback(() => {
		setCommentVoteCount((prev) => {
			if (commentVoteType === "up") return prev - 1;
			return commentVoteType === "down" ? prev + 2 : prev + 1;
		});
		setCommentVoteType((prev) => (prev === "up" ? null : "up"));
	}, [commentVoteType]);

	const handleCommentDownVote = useCallback(() => {
		setCommentVoteCount((prev) => {
			if (commentVoteType === "down") return prev + 1;
			return commentVoteType === "up" ? prev - 2 : prev - 1;
		});
		setCommentVoteType((prev) => (prev === "down" ? null : "down"));
	}, [commentVoteType]);

	const toggleReplying = () => setReplying((prev) => !prev);

	return (
		<div
			className={`bg-surface-400 rounded-2xl pt-8 pb-4 pl-8 ${
				!isReply ? "pr-8" : ""
			} w-full`}
		>
			<div className="flex justify-between">
				<div className="flex gap-3">
					<img
						src={comment.userProfileImageUrl}
						alt=""
						className="w-10 h-10 object-cover rounded-full"
					/>
					<div className="self-center">
						<p className="text-sm font-bold">{comment.userInfo.username}</p>
					</div>
				</div>
				<p className="text-xxs font-bold text-black-300">
					{formatDateTimeVersion2(comment.createdDateTime)}
				</p>
			</div>
			<p className="py-6">{comment.commentBody}</p>
			<CommentVoteActions
				commentId = {comment.commentId}
				commentVoteCount={commentVoteCount}
				upvoteHandler={toggleCommentUpvote}
				downVoteHandler={handleCommentDownVote}
				commentVoteType={commentVoteType}
				replying={replying}
				toggleReplying={toggleReplying}
			/>
			{comment.replies.length > 0 && (
				<div className="pl-4 border-l rounded-b-3xl border-gray-400">
					<CommentsList comments={comment.replies} isReply={true} />
				</div>
			)}
		</div>
	);
}
