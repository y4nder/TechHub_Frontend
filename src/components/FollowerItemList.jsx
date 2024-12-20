import { useState } from "react";
import {followUser, unFollowUser} from "@/utils/http/users.js";
import Avatar from "@/components/ui/Avatar.jsx";
import {SiDgraph} from "react-icons/si";
import {formatNumberToK as formatter} from "@/utils/formatters/numberFomatter.js";

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
        <div className="follower-info flex justify-between pb-4 min-w-fit flex-row border-collapse border-b-black-75 items-center">
            <div className=" flex flex-row gap-3 items-center">
                <div>
                    <Avatar
                       imageUrl={user.userProfilePicUrl}
                       userName={user.username}
                       userId={user.userId}
                       // variant="commentProfile"
                    />
                </div>
                <div className="text-sm flex flex-col">
                    <div className="flex gap-1 items-center">
                        <strong>{user.username}</strong>
                        <div className="flex gap-1 items-center">
                            <SiDgraph
                               size={ 15 }
                               color="purple"
                            />
                            <p className="text-lg gradient-text font-bold">{ formatter(user.reputationPoints) }</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xxs">{ user.email }</p>
                </div>
            </div>
            <div className="">
                { followed ? (
                   <button
                        className=" f border px-4 text-clip py-1 rounded-xl h-fit w-full border-darkPurple-500 text-white bg-darkPurple-500 hover:bg-lightPurple-200 hover:text-darkPurple-500 transition-all duration-200"
                        onClick={handleUnfollow}
                    >
                        Following
                    </button>
                ) : (
                    <button
                        className="flex-shrink-0 border px-4 py-1 text-clip rounded-xl h-fit w-full border-darkPurple-500 text-darkPurple-500 hover:bg-darkPurple-500 hover:text-white transition-all duration-200"
                        onClick={handleFollow}
                    >
                        Follow
                    </button>
                )}
            </div>
        </div>
    );
}
