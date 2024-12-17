import {del, get, patch, post} from "@/utils/http/http.js";

export async function fetchProfileNav(userId) {
    return await get({
        endpoint: "/me",
        queryParams: {
            UserId: userId,
        },
    });
}

export async function getUserFollowInfo(userId) {
    return await get({
        endpoint: "/GetFollowerInfo",
        queryParams: {
            UserId: userId,
        },
    });
}

export async function getFollowers(pageNumber, pageSize) {
    return await get({
        endpoint: "/getFollowers",
        queryParams: {
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });
}

export async function getFollowing(pageNumber, pageSize) {
    return await get({
        endpoint: "/getFollowing",
        queryParams: {
            PageNumber: pageNumber,
            PageSize: pageSize,
        },
    });
}

export async function followUser(followingId) {
    return await post({
        endpoint: "/follow",
        body: {
            FollowingId: followingId,
        },
    });
}

export async function unFollowUser(followingId) {
    return await post({
        endpoint: "/unfollow",
        body: {
            FollowingId: followingId,
        },
    });
}

export async function getSelfUserAdditionalInfo(){
    return await get({
        endpoint: "/me/profile",
    })
}

export async function uploadProfile(imageData){
    return await post({
        endpoint: "/uploadImage",
        body: imageData,
    })
}

export async function removeUploadedProfile(publicId){
    return await del({
        endpoint: "/deleteImage",
        body: {
            PublicId: publicId,
        }
    })
}

export async function checkUsernameValidity(username){
    return await get({
        endpoint: "/usernameChecker",
        queryParams: {
            Username: username,
        }
    })
}

export async function updateUserData(userdata){
    return await patch({
        endpoint: "/me/profile/update",
        body: {
            ...userdata,
        },
    })
}

export async function getModerators(clubId){
    return await get({
        endpoint: "/getModerators",
        queryParams: {
            ClubId: clubId,
        }
    });
}

export async function getAllNotifications(){
    return await get({
        endpoint: "/getAllNotifications",
    });
}

export async function getRecommendedUsers(){
    return await get({
        endpoint: "/getRecommendedUsers",
    });
}
