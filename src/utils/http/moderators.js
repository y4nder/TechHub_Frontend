import {del, get, post} from "@/utils/http/http.js";

export async function removeArticle(articleId){
	return await post({
		endpoint: "/removeArticle",
		body:{
			ArticleId: articleId,
		}
	})
}

export async function publishArticle(articleId){
	return await post({
		endpoint: "/publishArticle",
		body:{
			ArticleId: articleId,
		}
	})
}


export async function getClubArticlesForMod(clubId, userId, pageNumber = 1, pageSize = 10){
	return await get({
		endpoint: "/getClubArticlesForModerator",
		queryParams: {
			ClubId: clubId,
			UserId: userId,
			PageNumber: pageNumber,
			PageSize: pageSize,
		},
	});
}

export async function pinArticle(articleId, pinned){
	return await post({
		endpoint: "/setPin",
		body:{
			ArticleId: articleId,
			Pinned: pinned
		}
	})
}

export async function getClubModeratorsFull(clubId){
	return await get({
		endpoint: "/getModeratorsFull",
		queryParams: {
			ClubId: clubId,
		}
	})
}

export async function getClubMembersForMod(clubId, searchTerm){
	return await get({
		endpoint: "/getClubMembersForModerator",
		queryParams: {
			ClubId: clubId,
			SearchTerm: searchTerm
		}
	})
}

export async function assignModerator(assigneeId, clubId){
	return await post({
		endpoint: "/assignModerator",
		body: {
			AssigneeId: assigneeId,
			ClubId: clubId,
		}
	})
}

export async function removeModerator(moderatorId, clubId){
	return await del({
		endpoint: "/removeModerator",
		body: {
			ModeratorId: moderatorId,
			ClubId: clubId,
		}
	})
}

export async function getReportsForArticle(articleId){
	return await get({
		endpoint: "/getReportsForArticle",
		queryParams: {
			ArticleId: articleId,
		}
	})
}

export async function evaluateReport(evaluationData){
	return await post({
		endpoint: "/evaluateArticle",
		body: {
			...evaluationData,
		}
	})
}