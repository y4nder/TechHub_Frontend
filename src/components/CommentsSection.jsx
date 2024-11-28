import CommentInput from "@/components/CommentInput.jsx";
import CommentsList from "@/components/CommentList.jsx";
import {useSelector} from "react-redux";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {useComments} from "@/hooks/useComments.jsx";

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

export default function CommentSection() {
	// const [comments, setComments] = useState([]);
	const {comments, addComment} = useComments();


	const {
		userProfilePicUrl,
		username,
		reputationPoints
	}
		= useSelector(state => state.user);

	const handleCreateComment = (commentBody) => {
		const tempId = generateId();
		const newComment = {
			commentId : tempId,
			userProfileImageUrl: userProfilePicUrl,
			userInfo: {
				userId: getUserIdFromToken(),
				username: username,
				userProfilePicUrl: userProfilePicUrl,
				reputationPoints: reputationPoints,
			},
			commentBody: commentBody,
		}

		// console.log("created Comment",newComment);

		addComment(newComment);
	}

	return (
		<div className="mt-8 flex flex-col gap-2">
			<CommentInput onPost={handleCreateComment} />
			{/*<p>{JSON.stringify(comments)}</p>*/}
			<CommentsList comments={comments}/>
		</div>
	);
}
