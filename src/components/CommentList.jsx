import CommentItem from "@/components/CommentItem.jsx";

export default function CommentsList({ comments , isReply = false}) {
	return (
		<div className="flex flex-col gap-6 mt-8 mb-8">
			{comments.map((comment) => (
				<CommentItem key={comment.commentId} comment={comment} isReply={isReply} />
			))}
		</div>
	);
}