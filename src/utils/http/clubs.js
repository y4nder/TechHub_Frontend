import {get, post} from "@/utils/http/http.js";

export async function fetchJoinedClubs(userId) {
	return await get({
		endpoint: '/GetJoinedClubs',
		queryParams: {
			UserId: userId
		}
	})
}

export async function fetchClubCategories() {
	return await get({
		endpoint: '/GetAllClubCategories'
	})
}

export async function fetchFeaturedClubs() {
	return await get({
		endpoint: '/GetFeaturedClubs',
	})
}

export async function fetchCategorizedClubs() {
	return await get({
		endpoint: '/GetCategorizedClubs',
	})
}

export async function fetchSingleCategoryClub(categoryId) {
	return await get({
		endpoint: '/GetSingleCategoryClubs',
		queryParams: {
			CategoryId: categoryId
		}
	})
}

export async function fetchSingleClub(clubId){
	return await get({
		endpoint: '/GetSingleClub',
		queryParams: {
			ClubId: clubId
		}
	})
}

export async function createClub(clubFormData){
	return await post({
		endpoint: '/createClub',
		body: clubFormData,
	})
}

