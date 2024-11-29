import { useState } from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import Button from "@/components/ui/Button.jsx";
import { useSelector } from "react-redux";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {useComments} from "@/hooks/useComments.jsx";

export default function CommentVoteActions({
	commentId,
	commentVoteCount,
	upvoteHandler,
	downVoteHandler,
	commentVoteType,
	replying,
	toggleReplying
}) {
	const [reply, setReply] = useState("");
	const { userProfilePicUrl, username, reputationPoints } = useSelector((state) => state.user);
	const {replyComment} = useComments();

	const handleInputChange = (e) => {
		setReply(e.target.value);
		e.target.style.height = "auto"; // Reset height
		e.target.style.height = `${e.target.scrollHeight}px`; // Set height dynamically
	};

	const handlePostReply = () => {
		const newReply = {
			userProfileImageUrl: userProfilePicUrl,
			userInfo: {
				userId: getUserIdFromToken(),
				username: username,
				userProfilePicUrl: userProfilePicUrl,
				reputationPoints: reputationPoints,
			},
			commentBody: reply,

		};
		console.log("for ", newReply);
		replyComment(commentId, newReply);
		setReply("");
		toggleReplying();
	}

	return (
		<>
			<div className="flex gap-2 items-center">
				<div className="flex items-center bg-surface-500 rounded-xl">
					<div
						className={`flex flex-row gap-2 cursor-pointer py-2 px-2 rounded-xl ${
							commentVoteType === "up" ? "bg-green-200 text-green-500" : ""
						} hover:bg-green-200 hover:text-green-500 transition-all duration-200`}
						onClick={upvoteHandler}
					>
						<BiUpvote size={20} />
						<p>{commentVoteCount}</p>
					</div>
					<RxDividerVertical size={20} className="text-black-75 flex" />
					<div
						className={`flex flex-row gap-2 cursor-pointer py-2 px-2 rounded-xl ${
							commentVoteType === "down" ? "bg-red-100 text-red-500" : ""
						} hover:bg-red-100 hover:text-red-500 transition-all duration-200`}
						onClick={downVoteHandler}
					>
						<BiDownvote size={20} />
					</div>
				</div>
				<Button
					className="bg-lightPurple-500 py-1 px-3 rounded-xl text-sm h-full text-white"
					onClick={toggleReplying}
				>
					Reply
				</Button>
			</div>
			{replying && (
				<div className="flex items-start mt-4 border-b border-darkPurple-500 pb-3 gap-1">
					<img
						src={userProfilePicUrl}
						alt="profile pic"
						className="w-8 h-8 object-cover rounded-full"
					/>
					<textarea
						className="flex-grow bg-transparent outline-none text-md text-black placeholder-gray-400 px-2 py-1 resize-none"
						rows={1}
						value={reply}
						onChange={handleInputChange}
						placeholder="Write a reply..."
					/>
					<div className="flex gap-1">
						<Button
							className="text-black-75 p-1 px-2 "
							onClick ={toggleReplying}
						>
							Cancel
						</Button>
						<Button
							className="bg-darkPurple-500 text-white p-1 px-2 rounded-xl disabled:bg-opacity-10"
							onClick={handlePostReply}
							disabled={reply.trim() === ''}
						>
							Reply
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
