import {createContext, useState, useContext, useEffect} from "react";

// Create the context
const CommentContext = createContext();

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;


// Context Provider component
export const CommentProvider = ({ children, fetchComments  }) => {
	const [comments, setComments] = useState([]);

	// Fetch initial comments from the database
	useEffect(() => {
		const loadComments = async () => {
			try {
				const initialComments = await fetchComments();
				console.log(initialComments);
				setComments(initialComments);
			} catch (error) {
				console.error("Failed to fetch comments:", error);

			}
		};
		loadComments();
	}, [fetchComments]);

	// Add a comment
	const addComment = (comment) => {
		const newComment = {
			commentId: generateId(), // Generate a unique ID (or use something more robust)
			...comment,
			createdDateTime: new Date().toISOString(),
			updatedDateTime: new Date().toISOString(),
			replies: [],
			voteCount: 0,
		};

		setComments((prevComments) => [newComment, ...prevComments]);
		console.log("created Comment",newComment);
	};

	const replyComment = (parentCommentId, comment) => {
		const newComment = {
			commentId: generateId(), // Generate a unique ID (or use something more robust)
			...comment,
			createdDateTime: new Date().toISOString(),
			updatedDateTime: new Date().toISOString(),
			replies: [],
			voteCount: 0,
		};

		console.log(newComment);

		setComments((prevComments) =>
			prevComments.map((c) =>
				c.commentId === parentCommentId
					? {
						...c,
						replies: [...c.replies, newComment],
					}
					: {
						...c,
						replies: replyCommentNested(c.replies, parentCommentId, newComment),
					}
			)
		);
	};

	// Helper function to handle nested replies
	const replyCommentNested = (replies, parentCommentId, comment) => {
		return replies.map((reply) =>
			reply.commentId === parentCommentId
				? {
					...reply,
					replies: [...reply.replies, comment],
				}
				: {
					...reply,
					replies: replyCommentNested(reply.replies, parentCommentId, comment),
				}
		);
	};

	// Update a comment
	const updateComment = (commentId, updatedFields) => {
		setComments((prevComments) =>
			prevComments.map((comment) =>
				comment.commentId === commentId
					? { ...comment, ...updatedFields }
					: comment
			)
		);
	};

	// Delete a comment
	const deleteComment = (commentId) => {
		setComments((prevComments) =>
			prevComments.filter((comment) => comment.commentId !== commentId)
		);
	};



	return (
		<CommentContext.Provider
			value={{
				comments,
				addComment,
				updateComment,
				deleteComment,
				replyComment
			}}
		>
			{children}
		</CommentContext.Provider>
	);
};

// Custom hook for using the context
export const useComments = () => {
	return useContext(CommentContext);
};
