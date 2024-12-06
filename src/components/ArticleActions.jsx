import { BiUpvote, BiDownvote, BiCommentDetail } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import { MdBookmarkBorder } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";

const ArticleActions = ({
	                        voteType,
	                        voteCount,
	                        bookmarked,
	                        commentCount,
	                        onUpvote,
	                        onDownvote,
	                        onBookmarkToggle,
	                        onCommentClick,
	                        onShareClick,
                        }) => {
	const upvote = "up";
	const downVote = "down";

	return (
		<div className="flex pt-2">
			{/* Vote actions */}
			<div className="flex items-center bg-surface-500 rounded-xl">
				<div
					className={`
            flex flex-row 
            gap-2 cursor-pointer 
            py-2 px-2 
            rounded-xl
            ${voteType === upvote ? "bg-green-200 text-green-500" : ""} 
            hover:bg-green-200
            hover:text-green-500
            transition-all duration-200 
          `}
					onClick={onUpvote}
				>
					<BiUpvote size={20} />
					<p>{voteCount}</p>
				</div>
				<RxDividerVertical size={20} className="text-black-75 flex" />
				<div
					className={`
            flex flex-row 
            gap-2 cursor-pointer 
            py-2 px-2 
            rounded-xl 
            ${voteType === downVote ? "bg-red-100 text-red-500" : ""}
            hover:bg-red-100 
            hover:text-red-500
            transition-all duration-200 
          `}
					onClick={onDownvote}
				>
					<BiDownvote size={20} />
				</div>
			</div>

			{/* Article actions */}
			<div className="flex flex-grow items-center justify-between pl-4">
				<div
					className={`
            flex items-center gap-1 cursor-pointer
            rounded-xl 
            py-2 px-2 
            text-black-100
            hover:bg-cyan-100
            hover:text-cyan-500
            transition-all duration-200 
          `}
					onClick={onCommentClick}
				>
					<BiCommentDetail size={20} />
					<p className="text-md font-bold">{commentCount}</p>
				</div>
				<div
					className={`
            flex items-center gap-1 cursor-pointer
            rounded-xl 
            py-2 px-2 
            transition-all duration-200
            ${
						bookmarked
							? "bg-orange-100 text-orange-500"
							: "text-black-100 hover:bg-orange-100 hover:text-orange-500"
					}
          `}
					onClick={onBookmarkToggle}
				>
					<MdBookmarkBorder size={20} />
				</div>
				<div
					className={`
            flex items-center gap-1 cursor-pointer
            rounded-xl 
            py-2 px-2 
            text-black-100
            hover:bg-purple-100
            hover:text-purple-800
            transition-all duration-200 
          `}
					onClick={onShareClick}
				>
					<PiShareFatLight size={20} />
				</div>
			</div>
		</div>
	);
};

export default ArticleActions;
