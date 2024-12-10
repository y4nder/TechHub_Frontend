import { NavLink, useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { PlusIcon } from "lucide-react";
import { formatNumberToK } from "@/utils/formatters/numberFomatter.js";
import { useQuery } from "@tanstack/react-query";
import { getUserIdFromToken } from "@/utils/token/token.js";
import {getFollowers, getFollowing, getUserFollowInfo} from "@/utils/http/users.js";
import Modal from "./ui/Modal";
import { useState, useMemo } from "react";
import FollowersList from "./FollowersLists";
import { IoArrowBack } from "react-icons/io5";
import Avatar from "@/components/ui/Avatar.jsx";

export default function UserProfileCard() {
    const [followInfoModalOpen, setFollowInfoModalOpen] = useState({ isOpen: false, type: "followers" });

    const { userProfilePicUrl, username, reputationPoints } = useSelector((state) => state.user);
    const { clubs } = useSelector((state) => state.joinedClubs);

    const navigate = useNavigate();

    // Memoize userId to avoid re-executing getUserIdFromToken on every render
    const userId = useMemo(() => getUserIdFromToken(), []);

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["profile", userId],
        queryFn: () => getUserFollowInfo(userId),
        enabled: !!userId, // Only run the query if userId is valid
    });

    const followerInfoModal = () => {
        return (
           <Modal
              className="follow-list p-4 rounded-2xl border border-lightPurple-200"
              open={followInfoModalOpen.isOpen}
              onClose={() => setFollowInfoModalOpen((prevState) => ({ ...prevState, isOpen: false }))}
           >
               <div className="text-center pb-2 flex justify-between">
                   <button
                      onClick={() => setFollowInfoModalOpen((prevState) => ({ ...prevState, isOpen: false }))}
                      className=""
                   >
                       <IoArrowBack />
                   </button>
                   <div className="flex-grow"></div>
                   <p className="gradient-text text-xl font-medium">{ followInfoModalOpen.type }</p>
                   <div className="flex-grow"></div>
               </div>
               {followInfoModalOpen.type === "followers"?
                  (<FollowersList fetchFn={getFollowers} fetchKey={"followers"} />) :
                  (<FollowersList fetchFn={getFollowing} fetchKey={"following"} />)
               }

           </Modal>
        );
    };

    return (
       <div>
           {followerInfoModal()}
           <div className="UserProfileCard p-4 space-y-8">
               <div className="profile-header flex justify-between items-center flex-grow gap-8">
                   <h1 className="text-4xl font-bold">Profile</h1>
                   <div className="flex gap-2 items-center">
                       <NavLink
                          to={`/profile/${userId}/settings`}
                          className="border border-black-75 py-1 px-3 rounded-xl text-nowrap hover:bg-lightPurple-200 hover:text-white transition-colors duration-150"
                       >
                           Edit profile
                       </NavLink>
                       <BsThreeDotsVertical />
                   </div>
               </div>
               <div className="profile-image">
                   {/*<img*/}
                   {/*   src={userProfilePicUrl}*/}
                   {/*   className="w-44 h-44 rounded-2xl object-cover"*/}
                   {/*   alt=""*/}
                   {/*/>*/}
                   <Avatar
                      imageUrl={userProfilePicUrl}
                      userName={username}
                      userId={userId}
                      variant='userProfileCard'
                   />
               </div>
               <div className="profile-info">
                   <h1 className="font-bold text-2xl">{username}</h1>
                   <p className="font-sans font-thin text-black-75">Joined on October 2024</p>
                   <div className="flex gap-2 items-center pt-5">
                       {isPending && <p>Fetching user follow info...</p>}
                       {data && (
                          <>
                              <p
                                 className="cursor-pointer hover:text-darkPurple-500 hover:underline"
                                 onClick={() =>
                                    setFollowInfoModalOpen((prevState) => ({
                                        ...prevState,
                                        isOpen: true,
                                        type: "followers",
                                    }))
                                 }
                              >
                                  <span className="font-bold">{data.userFollowInfo.followerCount}</span> followers
                              </p>
                              <p
                                 className="cursor-pointer hover:text-darkPurple-500 hover:underline"
                                 onClick={() =>
                                    setFollowInfoModalOpen((prevState) => ({
                                        ...prevState,
                                        isOpen: true,
                                        type: "following",
                                    }))
                                 }
                              >
                                  <span className="font-bold">{data.userFollowInfo.followingCount}</span> following
                              </p>
                          </>
                       )}
                   </div>
                   <p>
                       <span className="font-bold">{formatNumberToK(reputationPoints)}</span> reputation points
                   </p>
               </div>
               <div className="profile-bio">
                   <button className="flex items-center text-lg py-1 px-4 border border-black-75 rounded-lg">
                       Add Bio
                   </button>
               </div>
               <div className="profile-clubs space-y-2">
                   <p className="text-sm font-bold">Active in these clubs</p>
                   <div className="flex gap-2 items-center flex-wrap">
                       <NavLink
                          to={`/clubs`}
                          className="border border-black-75 rounded-lg p-2 hover:bg-gray-200">
                           <PlusIcon />
                       </NavLink>
                       {clubs.map((club) => (
                          <button
                             key={club.clubId}
                             className="border border-black-75 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
                             onClick={() => navigate(`/club/${club.clubId}`)}
                          >
                              <img
                                 src={club.clubProfilePicUrl}
                                 className="w-10 h-10 object-cover rounded-lg"
                                 alt=""
                              />
                          </button>
                       ))}
                   </div>
               </div>
           </div>
       </div>
    );
}
