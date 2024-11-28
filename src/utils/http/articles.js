import { get } from "@/utils/http/http.js";

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
export async function fetchHomeArticles(userId, pageNumber = 1, pageSize = 10) {
	return await paginationQuery(
		({ userId, pageNumber, pageSize }) =>
			get({
				endpoint: "/getHomeArticles",
				queryParams: {
					UserId: userId,
					PageNumber: pageNumber,
					PageSize: pageSize,
				},
			}),
		{ userId },
		pageNumber,
		pageSize
	);
}

export async function fetchDiscoverArticles(pageNumber = 1, pageSize = 10) {
	return await paginationQuery(
		({ pageNumber, pageSize }) =>
			get({
				endpoint: "/discoverArticles",
				queryParams: {
					PageNumber: pageNumber,
					PageSize: pageSize,
				}
			}),
		{},
		pageNumber,
		pageSize
	);
}
