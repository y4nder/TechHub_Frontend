import {get} from "@/utils/http/http.js";

export async function fetchProfileNav(userId) {
	return await get({
		endpoint: '/me',
		queryParams: {
			UserId: userId
		}
	})
}