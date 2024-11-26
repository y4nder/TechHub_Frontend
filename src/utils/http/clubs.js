import {get} from "@/utils/http/http.js";

export async function fetchJoinedClubs(userId) {
	return await get({
		endpoint: '/GetJoinedClubs',
		queryParams: {
			UserId: userId
		}
	})
}