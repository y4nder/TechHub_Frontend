import {NavLink, useNavigate} from "react-router-dom";
import {BsThreeDotsVertical} from "react-icons/bs";
import {useSelector} from "react-redux";
import {PlusIcon} from "lucide-react";
import {formatNumberToK} from "@/utils/formatters/numberFomatter.js";
import {useQuery} from "@tanstack/react-query";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {getUserFollowInfo} from "@/utils/http/users.js";

export default function UserProfileCard() {
	const {
		userProfilePicUrl,
		username,
		reputationPoints
	} = useSelector((state) => state.user);

	const {clubs} = useSelector((state) => state.joinedClubs);

	const navigate = useNavigate();

	const {
		data,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['profile', getUserIdFromToken()],
		queryFn: () => getUserFollowInfo(getUserIdFromToken()),
	})

	return(
		<div className="UserProfileCard p-4 space-y-8">
			<div className="profile-header flex justify-between items-center flex-grow">
				<h1 className="text-4xl font-bold">Profile</h1>
				<div className="flex gap-2 items-center">
					<NavLink to={''}
						className="border border-black-75 py-1 px-3 rounded-xl text-nowrap"
					>
						Edit profile
					</NavLink>
					<BsThreeDotsVertical/>
				</div>
			</div>
			<div className="profile-image">
				<img
					src={userProfilePicUrl}
					className="w-44 h-44 rounded-2xl object-cover"
					alt=""
				/>
			</div>
			<div className="profile-info">
				<h1 className="font-bold text-2xl">{username}</h1>
				<p className="font-sans font-thin text-black-75">Joined on October 2024</p>
				<div className="flex gap-2 items-center pt-5">
					{isPending && (
						<p>Fetching user follow info...</p>
					)}
					{data && (
						<>
							<p><span className="font-bold">{ data.userFollowInfo.followerCount }</span> followers</p>
							<p><span className="font-bold">{ data.userFollowInfo.followingCount }</span> following</p>
						</>
					)}
				</div>
				<p><span className="font-bold">{ formatNumberToK(reputationPoints) }</span> reputation points</p>

			</div>
			<div className="profile-bio">
				<button className="flex items-center text-lg py-1 px-4 border border-black-75 rounded-lg">
					Add Bio
				</button>
			</div>
			<div className="profile-clubs space-y-2">
				<p className="text-sm font-bold">Active in these clubs</p>
				<div className="flex gap-2 items-center">
					<button
						className="border border-black-75 rounded-lg p-2 hover:bg-gray-200"
					>
						<PlusIcon/>
					</button>
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
					)) }
				</div>
			</div>
		</div>
	)
}

