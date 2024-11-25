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