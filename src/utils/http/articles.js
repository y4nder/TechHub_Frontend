import {del, get, post, put} from "@/utils/http/http.js";
import { getToken } from "../token/token";

/**
 * Generic function to handle paginated queries.
 * @param {Function} fetchFunction - Function to fetch data, accepts pageNumber and pageSize as arguments.
 * @param {Object} params - Additional parameters to pass to the fetch function (e.g., userId).
 * @param {number} pageNumber - Current page number (default: 1).
 * @param {number} pageSize - Number of items per page (default: 10).
 * @returns {Promise<Object>} - The paginated data response.
 */
export async function paginationQuery(fetchFunction, params = {}, pageNumber = 1, pageSize = 10) {
    return await fetchFunction({ ...params, pageNumber, pageSize });
}

/**
 * Example usage for fetching home articles.
 */
export async function fetchHomeArticles(pageNumber = 1, pageSize = 10) {
    return await get({
        endpoint: "/getHomeArticles",
        queryParams: {
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    })
}

export async function fetchDiscoverArticles(pageNumber = 1, pageSize = 10) {
    return await get({
        endpoint: "/discoverArticles",
        queryParams: {
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });
}

export async function fetchArticle(articleId) {
    return await get({
        endpoint: "/getSingleArticle",
        queryParams: {
            ArticleId: articleId,
        },
    });
}

// export async function fetchClubArticles(clubId, userId, pageNumber = 1, pageSize = 10) {
// 	return await paginationQuery(
// 		({ clubId, userId, pageNumber, pageSize }) =>
// 			get({
// 				endpoint: "/clubArticles",
// 				queryParams: {
// 					ClubId: clubId,
// 					UserId: userId,
// 					PageNumber: pageNumber,
// 					PageSize: pageSize,
// 				}
// 			}),
// 		{},
// 		pageNumber,
// 		pageSize
// 	)
// }

export async function fetchClubArticles(clubId, userId, pageNumber = 1, pageSize = 10) {
    return await get({
        endpoint: "/clubArticles",
        queryParams: {
            ClubId: clubId,
            UserId: userId,
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });
}

export async function upVoteArticle(userId, articleId) {
    return await post({
        endpoint: "/upvoteArticle",
        body: {
            userId: userId,
            articleId: articleId,
        },
    });
}

export async function downVoteArticle(userId, articleId) {
    return await post({
        endpoint: "/downVoteArticle",
        body: {
            userId: userId,
            articleId: articleId,
        },
    });
}

export async function removeArticleVote(userId, articleId) {
    return await del({
        endpoint: "/removeArticleVote",
        body: {
            userId: userId,
            articleId: articleId,
        },
    });
}

export async function bookmarkArticle(userId, articleId) {
    return await post({
        endpoint: "/bookmarkArticle",
        body: {
            articleId: articleId,
            userId: userId,
        },
    });
}

export async function unBookmarkArticle(userId, articleId) {
    return await post({
        endpoint: "/unBookmarkArticle",
        body: {
            articleId: articleId,
            userId: userId,
        },
    });
}

export async function getUserArticles(userId, pageNumber = 1, pageSize = 10) {
    return await get({
        endpoint: "/getUserArticles",
        queryParams: {
            UserId: userId,
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });
}

export async function getUserUpVotedArticles(userId, pageNumber = 1, pageSize = 10) {
    return await get({
        endpoint: "/getUpVotedArticles",
        queryParams: {
            UserId: userId,
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });
}

export async function getBookmarkedArticles(userId, pageNumber = 1, pageSize = 10) {
    return await get({
        endpoint: "/getBookmarkedArticles",
        queryParams: {
            UserId: userId,
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });
}

export async function getReadArticles(userId, pageNumber = 1, pageSize = 10) {
    return await get({
        endpoint: "/getReadArticles",
        queryParams: {
            UserId: userId,
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });
}

export async function createArticle(articleFormData){
    return await post({
        endpoint : "/addArticle",
        body: articleFormData,
    })
}

export async function getArticleForEdit(articleId){
    return await get({
        endpoint: "/getArticleForEdit",
        queryParams: {
            ArticleId: articleId,
        }
    })
}

export async function updateArticle(articleFormData){
    return await put({
        endpoint : "/updateArticle",
        body: articleFormData,
    })
}

export async function getTagArticles(tagId, pageNumber = 1, pageSize = 10) {
    return await get({
        endpoint: "/getTagArticles",
        queryParams: {
            TagId: tagId,
            PageNumber: pageNumber,
            PageSize: pageSize,
        }
    })
}

export async function getSuggestedArticles(searchTerm){
    return await get({
        endpoint: "/getSuggestedArticles",
        queryParams: {
            SearchTerm: searchTerm,
        }
    })
}

export async function reportArticle(reportData){
    return await post({
        endpoint: "/reportArticle",
        body: reportData
    })
}

export async function getReportedArticles(clubId) {
    return await get({
        endpoint: "/getReportedArticles",
        queryParams: {
            ClubId: clubId,
        }
    })
}

export async function getTenReportedArticles(clubId) {
    return await get({
        endpoint: "/getTenReportedArticles",
        queryParams: {
            ClubId: clubId,
        }
    })
}

export async function getReportsForArticle(articleId) {
    return await get({
        endpoint: "/getReportsForArticle",
        queryParams: {
            ArticleId: articleId,
        }
    })
}