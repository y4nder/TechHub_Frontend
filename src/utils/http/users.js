import {get} from "@/utils/http/http.js";

export async function fetchProfileNav(userId) {
	return await get({
		endpoint: '/me',
		queryParams: {
			UserId: userId
		}
	})
}

export async function getUserFollowInfo(userId) {
	return await get({
		endpoint: '/GetFollowerInfo',
		queryParams: {
			UserId: userId
		}
	})
}