import {useQuery} from "@tanstack/react-query";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {getUserReplies} from "@/utils/http/comments.js";
import ReplyContainer from "@/components/ReplyContainer.jsx";
import {CommentProvider} from "@/hooks/useComments.jsx";

export default function ProfileRepliesPage() {

	const {
		data : repliesData,
		isLoading,
		isError,
		error
	} = useQuery({
		queryKey:['comments',getUserIdFromToken()],
		queryFn: () => getUserReplies(getUserIdFromToken(), 1, 10),
	})

	return(
		<CommentProvider>
			<div className={`
				
				${repliesData ? 'h-screen': 'h-full'}
				
			`}>
				{isLoading && (
					<p>Loading data</p>
				)}
				{isError && (
					<p>Error fetching data</p>
				)}
				{repliesData && (
					repliesData.replies.items.map(reply => (
						<ReplyContainer
							key={reply.articleId + ' ' + reply.commentId}
							reply={reply}
						/>
					))
				)}

				{repliesData && (repliesData.replies.items.length === 0 && (
					<div className="h-screen">no replies yet</div>
				))}
			</div>
		</CommentProvider>
	);
}