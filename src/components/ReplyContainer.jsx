import {SiDgraph} from "react-icons/si";
import {formatNumberToK} from "@/utils/formatters/numberFomatter.js";
import CommentVoteActions from "@/components/CommentVoteActions.jsx";
import CommentActions from "@/components/CommentActions.jsx";
import Avatar from "@/components/ui/Avatar.jsx";


export default function ReplyContainer({ reply }) {
	return (
		<div className={`
			border border-b-black-75 p-4 space-y-4
		`}>
			<div className="reply-sub-header">
				<p className="font-thin">
					<span className="text-black-75">commented on</span>
					<span className="font-bold"> {reply.articleTitle}</span>
				</p>
			</div>
			<div className="reply-header flex gap-6">
				{/*<img*/}
				{/*	src={reply.userInfo.userProfilePicUrl}*/}
				{/*	className="h-12 w-12 object-cover rounded-xl"*/}
				{/*	alt=""*/}
				{/*/>*/}
				<Avatar
					imageUrl={reply.userInfo.userProfilePicUrl}
					userName={reply.userInfo.username}
					userId={reply.userInfo.userId}
					variant='largeSemiRounded'
				/>
				<div className="flex flex-col">
					<p className="flex items-center gap-2">
						<span>{reply.userInfo.username}</span>
						<div className="flex items-center">
							<SiDgraph size={15} color="purple" />
							<span className="font-bold">{formatNumberToK(reply.userInfo.reputationPoints)}</span>
						</div>
					</p>
					<p className="font-thin text-black-75">{reply.userInfo.email}</p>
				</div>
			</div>
			<div className="reply-body">
				<p>{reply.commentBody}</p>
			</div>
			<div className="reply-actions">
				<CommentActions
					comment={reply}
					shouldReply={false}
				/>
			</div>

		</div>
	)
}