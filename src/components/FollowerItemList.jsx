import { useState } from "react";
import {followUser, unFollowUser} from "@/utils/http/users.js";

export default function FollowerItemList({ user }) {
    const [followed, setFollowed] = useState(user.followed);

    async function handleUnfollow() {
        setFollowed(false);
        await unFollowUser(user.userId);
    }

    async function handleFollow() {
        setFollowed(true);
        await followUser(user.userId);
    }

    return (
        <div className="follower-info grid grid-cols-4 pb-4 min-w-fit flex-grow-0 border-collapse border-b-black-75 items-center">
            <div className="col-span-3 flex gap-2">
                <div>
                    <img
                        src={user.userProfilePicUrl}
                        alt="no profile"
                        className="w-8 h-8 object-cover rounded-full"
                    />
                </div>
                <div className="text-sm">
                    <div className="flex gap-2 ">
                        <strong>{user.username}</strong>
                        <span className="">{user.reputationPoints}</span>
                    </div>
                    <p className="text-gray-500 text-xxs">{user.email}</p>
                </div>
            </div>
            <div className="">
                {followed ? (
                    <button
                        className="border px-4 text-clip py-1 rounded-xl h-fit w-full border-darkPurple-500 text-white bg-darkPurple-500 hover:bg-lightPurple-200 hover:text-darkPurple-500 transition-all duration-200"
                        onClick={handleUnfollow}
                    >
                        Following
                    </button>
                ) : (
                    <button
                        className="border px-4 py-1 text-clip rounded-xl h-fit w-full border-darkPurple-500 text-darkPurple-500 hover:bg-darkPurple-500 hover:text-white transition-all duration-200"
                        onClick={handleFollow}
                    >
                        Follow
                    </button>
                )}
            </div>
        </div>
    );
}
