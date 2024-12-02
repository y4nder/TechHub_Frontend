import {paginationQuery} from "@/utils/http/articles.js";
import {del, get, post} from "@/utils/http/http.js";

export async function fetchCommentsByArticleId(userId, articleId, pageNumber = 1, pageSize = 10){
	return await paginationQuery(
		({articleId, pageNumber, pageSize }) =>
			get({
				endpoint: "/getComments",
				queryParams: {
					UserId: userId,
					ArticleId: articleId,
					PageNumber: pageNumber,
					PageSize: pageSize,
				},
			}),
		{articleId},
		pageNumber,
		pageSize
	)
}

export async function createComment(commentBody){
	return await post({
		endpoint: "/createComment",
		body: commentBody,
	})
}

export async function replyToComment(replyBody){
	return await post({
		endpoint: "/replyComment",
		body: replyBody,
	})
}

export async function upVoteComment(upvoteBody){
	return await post({
		endpoint: "/upvoteComment",
		body: upvoteBody,
	})
}

export async function downVoteComment(downVoteBoy){
	return await post({
		endpoint: "/downVoteComment",
		body: downVoteBoy,
	})
}

export async function removeCommentVote(removeCommentVoteBody){
	return await del({
		endpoint: "/removeCommentVote",
		body: removeCommentVoteBody,
	})
}

export async function getUserReplies(userId, pageNumber = 1, pageSize = 10){
	return await get({
		endpoint: "/getUserReplies",
		queryParams: {
			UserId: userId,
			PageNumber: pageNumber,
			PageSize: pageSize,
		}
	})
}