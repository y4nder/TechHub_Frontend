import {useEffect, useRef, useState} from "react";
import {dummySingleArticleData as article} from "@/utils/dummies/dummyArticles.js";
import Button from "@/components/ui/Button.jsx";

export default function CommentInput({onPost}) {
	const [comment, setComment] = useState(""); // State to manage comment text
	const textInputRef = useRef(null);
	const handlePostComment = () => {
		onPost(comment);
		setComment("");
	}

	const handleInputChange = (e) => {
		setComment(e.target.value);
		e.target.style.height = "auto"; // Reset height
		e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll
	};

	// Reset the height when the comment is cleared
	useEffect(() => {
		if (comment === "") {
			textInputRef.current.style.height = "auto";
		}
	}, [comment]);

	return (
		<div
			className={`
        flex justify-between
        bg-surface-400
        p-4
        rounded-3xl
        border border-black-75
        items-start
      `}
		>
			<div className="mr-4">
				<img
					src={article.author.userProfilePicUrl}
					alt={article.author.username}
					className="w-10 h-10 object-cover rounded-full items-start"
				/>
			</div>
			<div className="flex-grow">
			        <textarea
				        ref={textInputRef}
				        className={`
			            w-full h-full resize-none
			            bg-transparent
			            outline-none
			            text-md text-black
			            placeholder-gray-400
			            px-2 py-1
			            self-center
			          `}
				        rows={1} // Initial height is one row
				        value={comment}
				        onChange={handleInputChange}
				        placeholder="Write a comment..."
			        />
			</div>
			<div className="ml-4">
				<Button
					className={`
			            h-full bg-brightOrange-500 text-surface-50 px-4 py-2
			            rounded-2xl font-bold hover:bg-brightOrange-600
			            hover:bg-darkPurple-500 transition-all duration-200
			          `}
					onClick={handlePostComment}
					disabled={!comment.trim()} // Disable button if input is empty
				>
					Post
				</Button>
			</div>
		</div>
	);
}