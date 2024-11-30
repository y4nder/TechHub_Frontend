import {useState, useCallback, useEffect} from "react";
import CommentsList from "@/components/CommentList.jsx";
import { formatDateTimeVersion2 } from "@/utils/formatters/dateFormatter.js";
import CommentVoteActions from "./CommentVoteActions";
import {downVoteComment, removeCommentVote, upVoteComment} from "@/utils/http/comments.js";
import {getUserIdFromToken} from "@/utils/token/token.js";

export default function CommentItem({ comment, isReply = true }) {
	const [commentVoteCount, setCommentVoteCount] = useState(comment.voteCount);
	const [commentVoteType, setCommentVoteType] = useState(null);
	const [replying, setReplying] = useState(false);

	useEffect(() => {
		if(comment.voteType === 1){
			setCommentVoteType("up");
		} else if(comment.voteType === -1){
			setCommentVoteType("down")
		} else {
			setCommentVoteType(null)
		}
	}, [comment.voteType]);

	const toggleCommentUpvote = useCallback(async () => {
		try {
			if (commentVoteType === "up") {
				console.log("Removed upvote");
				await removeCommentVote({
					commentId: comment.commentId,
					userId: getUserIdFromToken(),
				});
				setCommentVoteCount((prev) => prev - 1);
			} else if (commentVoteType === "down") {
				console.log("Switching to upvote");
				await upVoteComment({
					commentId: comment.commentId,
					userId: getUserIdFromToken(),
				});
				setCommentVoteCount((prev) => prev + 2);
			} else {
				console.log("Upvoted");
				await upVoteComment({
					commentId: comment.commentId,
					userId: getUserIdFromToken(),
				});
				setCommentVoteCount((prev) => prev + 1);
			}
			setCommentVoteType((prev) => (prev === "up" ? null : "up"));
		} catch (error) {
			console.error("Error during upvote:", error);
		}
	}, [commentVoteType]);

	const handleCommentDownVote = useCallback(async () => {
		try {
			// Handle downvote logic
			if (commentVoteType === "down") {
				console.log("Removed downvote");
				await removeCommentVote({
					commentId: comment.commentId,
					userId: getUserIdFromToken(),
				});
				setCommentVoteCount((prev) => prev + 1); // Revert vote count if removing downvote
			} else if (commentVoteType === "up") {
				console.log("Switched to downvote");
				await downVoteComment({
					commentId: comment.commentId,
					userId: getUserIdFromToken(),
				});
				setCommentVoteCount((prev) => prev - 2); // Decrease vote count for switching to downvote
			} else {
				console.log("Downvoted");
				await downVoteComment({
					commentId: comment.commentId,
					userId: getUserIdFromToken(),
				});
				setCommentVoteCount((prev) => prev - 1); // Subtract 1 for a new downvote
			}

			// Update the vote type state
			setCommentVoteType((prev) => (prev === "down" ? null : "down"));
		} catch (error) {
			console.error("Error during downvote:", error);
			// Optionally handle errors (e.g., show error message to the user)
		}
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
