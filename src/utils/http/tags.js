import {get, post} from "@/utils/http/http.js";

export async function getAllTags() {
	return await get({
		endpoint: "/allTags"
	})
}

export async function followManyTags(payload) {
	return await post({
		endpoint: "/followManyTags",
		body: payload,
	})
}

export async function getTrendingTags(){
	return await get({
		endpoint: "/trendingTags",
	})
}

export async function getDiscoverTags(){
	return await get({
		endpoint: "/discoverTags",
	})
}

export async function getTagPage(tagId){
	return await get({
		endpoint: "/tagPage",
		queryParams: {
			TagId: tagId,
		}
	})
}

export async function followTag(tagId){
	return await post ({
		endpoint : "/followTag",
		body: {
			TagId: tagId,
		},
	})
}

export async function unFollowTag(tagId){
	return await post ({
		endpoint : "/unfollowTag",
		body: {
			TagId: tagId,
		},
	})
}

export async function getSuggestedTags(searchTerm){
	return await get({
		endpoint: "/getSuggestedTags",
		queryParams: {
			TagSearchTerm: searchTerm,
		}
	})
}