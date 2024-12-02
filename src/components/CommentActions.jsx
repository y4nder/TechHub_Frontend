import {useCallback, useEffect, useState} from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import Button from "@/components/ui/Button.jsx";
import { useSelector } from "react-redux";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {useComments} from "@/hooks/useComments.jsx";
import {downVoteComment, removeCommentVote, replyToComment, upVoteComment} from "@/utils/http/comments.js";
import {useMutation} from "@tanstack/react-query";

export default function CommentActions({comment, shouldReply = true}) {
	const [replyMessage, setReplyMessage] = useState("");
	const [isReplying, setIsReplying] = useState(false);
	const {userProfilePicUrl, username, reputationPoints } = useSelector((state) => state.user);
	const {replyComment, currentArticleId} = useComments();
	const [commentVoteType, setCommentVoteType] = useState(comment.voteType);
	const [commentVoteCount, setCommentVoteCount] = useState(comment.voteCount);

	const handleInputChange = (e) => {
		setReplyMessage(e.target.value);
		e.target.style.height = "auto"; // Reset height
		e.target.style.height = `${e.target.scrollHeight}px`; // Set height dynamically
	};

	const toggleReplyingState = () => setIsReplying(prevState => !prevState);

	useEffect(() => {
		if(comment.voteType === 1){
			setCommentVoteType("up");
		} else if(comment.voteType === -1){
			setCommentVoteType("down")
		} else {
			setCommentVoteType(null)
		}
	}, [comment.voteType]);

	const {
		mutate,
		isPending: isPostReplying,
		isError,
		error,
	}
		= useMutation({
		mutationFn: replyToComment,
		onMutate: (data) => {
			replyComment(comment.commentId, data);
			setReplyMessage("");
			toggleReplyingState();
		}
	})

	const handlePostReply = async () => {
		const newReply = {
			userProfileImageUrl: userProfilePicUrl,
			userInfo: {
				userId: getUserIdFromToken(),
				username: username,
				userProfilePicUrl: userProfilePicUrl,
				reputationPoints: reputationPoints,
			},
			commentBody: replyMessage,

		};
		console.log("for ", newReply);
		mutate({
			commentCreatorId: getUserIdFromToken(),
			articleId: currentArticleId,
			parentCommentId: comment.commentId,
			content: replyMessage
		})
		// replyComment(comment.commentId, newReply);
		// setReplyMessage("");
		// toggleReplyingState();
		// await replyToComment({
		// 	commentCreatorId: getUserIdFromToken(),
		// 	articleId: currentArticleId,
		// 	parentCommentId: comment.commentId,
		// 	content: replyMessage
		// })
	}

	const handleUpvote = useCallback(async () => {
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

	return (
		<>
			<div className="flex gap-2 items-center">
				<div className="flex items-center bg-surface-500 rounded-xl">
					<div
						className={`flex flex-row gap-2 cursor-pointer py-2 px-2 rounded-xl ${
							commentVoteType === "up" ? "bg-green-200 text-green-500" : ""
						} hover:bg-green-200 hover:text-green-500 transition-all duration-200`}
						onClick={handleUpvote}
					>
						<BiUpvote size={20} />
						<p>{commentVoteCount}</p>
					</div>
					<RxDividerVertical size={20} className="text-black-75 flex" />
					<div
						className={`flex flex-row gap-2 cursor-pointer py-2 px-2 rounded-xl ${
							commentVoteType === "down" ? "bg-red-100 text-red-500" : ""
						} hover:bg-red-100 hover:text-red-500 transition-all duration-200`}
						onClick={handleCommentDownVote}
					>
						<BiDownvote size={20} />
					</div>
				</div>
				{shouldReply && (
					<Button
						className="bg-lightPurple-500 py-1 px-3 rounded-xl text-sm h-full text-white"
						onClick={toggleReplyingState}
					>
						Reply
					</Button>
				)}
			</div>
			{isReplying && (
				<div className="flex items-start mt-4 border-b border-darkPurple-500 pb-3 gap-1">
					<img
						src={userProfilePicUrl}
						alt="profile pic"
						className="w-8 h-8 object-cover rounded-full"
					/>
					<textarea
						className="flex-grow bg-transparent outline-none text-md text-black placeholder-gray-400 px-2 py-1 resize-none"
						rows={1}
						value={replyMessage}
						onChange={handleInputChange}
						placeholder="Write a reply..."
					/>
					<div className="flex gap-1">
						<Button
							className="text-black-75 p-1 px-2 "
							onClick ={toggleReplyingState}
						>
							Cancel
						</Button>
						<Button
							className="bg-darkPurple-500 text-white p-1 px-2 rounded-xl disabled:bg-opacity-10"
							onClick={handlePostReply}
							disabled={replyMessage.trim() === ''}
						>
							Reply
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
