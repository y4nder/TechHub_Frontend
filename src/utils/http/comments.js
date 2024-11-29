import {paginationQuery} from "@/utils/http/articles.js";
import {get} from "@/utils/http/http.js";

export async function fetchCommentsByArticleId(articleId, pageNumber = 1, pageSize = 10){
	return await paginationQuery(
		({articleId, pageNumber, pageSize }) =>
			get({
				endpoint: "/getComments",
				queryParams: {
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