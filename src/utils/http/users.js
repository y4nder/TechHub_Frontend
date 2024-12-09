import { get, post } from "@/utils/http/http.js";

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
