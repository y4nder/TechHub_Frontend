import {NavLink, useNavigate, useParams} from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { PlusIcon } from "lucide-react";
import { formatNumberToK } from "@/utils/formatters/numberFomatter.js";
import { useQuery } from "@tanstack/react-query";
import {getFollowers, getFollowing, getSelfUserAdditionalInfo, getUserFollowInfo} from "@/utils/http/users.js";
import Modal from "./ui/Modal";
import { useState } from "react";
import FollowersList from "./FollowersLists";
import { IoArrowBack } from "react-icons/io5";
import Avatar from "@/components/ui/Avatar.jsx";
import {
	FaFacebook,
	FaGithub,
	FaGlobe,
	FaLinkedin,
	FaReddit,
	FaStackOverflow,
	FaTwitter,
	FaYoutube
} from "react-icons/fa";
import SocialPill from "@/components/ui/SocialPill.jsx";
import {SiThreads} from "react-icons/si";


const linkMappings = {
	githubLink: { name: "GitHub", icon: <FaGithub /> },
	linkedInLink: { name: "LinkedIn", icon: <FaLinkedin /> },
	facebookLink: { name: "Facebook", icon: <FaFacebook /> },
	xLink: { name: "Twitter", icon: <FaTwitter /> },
	personalWebsiteLink: { name: "Website", icon: <FaGlobe /> },
	youtubeLink: { name: "YouTube", icon: <FaYoutube /> },
	stackOverflowLink: { name: "Stack Overflow", icon: <FaStackOverflow /> },
	redditLink: { name: "Reddit", icon: <FaReddit /> },
	threadsLink: { name: "Threads", icon: <SiThreads /> }, // Placeholder for Threads
};

export default function UserProfileCard() {
	const [followInfoModalOpen, setFollowInfoModalOpen] = useState({ isOpen: false, type: "followers" });

	const { userProfilePicUrl, username, reputationPoints } = useSelector((state) => state.user);
	const { clubs } = useSelector((state) => state.joinedClubs);

	const navigate = useNavigate();
	const params = useParams();

	const userId = params.profileId;

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["profile", userId],
		queryFn: () => getUserFollowInfo(+userId),
		enabled: !!userId, // Only run the query if userId is valid
	});

	const {
		data: addInfo,
		isPending: additionalInfoDataIsPending,
		isError: additionalInfoDataIsError,
	} = useQuery({
		queryKey: ["additionalInfo", userId],
		queryFn: getSelfUserAdditionalInfo
	})

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
						className="focus:outline-none"
					>
						<IoArrowBack />
					</button>
					<div className="flex-grow"></div>
					<p className="gradient-text text-xl font-medium">{ followInfoModalOpen.type }</p>
					<div className="flex-grow"></div>
				</div>
				{followInfoModalOpen.type === "followers"?
					(<FollowersList fetchFn={getFollowers} fetchKey={followInfoModalOpen.type} />) :
					(<FollowersList fetchFn={getFollowing} fetchKey={followInfoModalOpen.type} />)
				}

			</Modal>
		);
	};

	return (
		<div>
			{followerInfoModal()}
			<div className="UserProfileCard p-4 space-y-8   ">
				<div className="profile-header flex justify-between items-center flex-grow gap-8">
					<h1 className="text-3xl font-bold">Profile</h1>
					<div className="flex gap-2 items-center">
						<NavLink
							to={ `/profile/${ userId }/settings` }
							className="border border-black-75 py-1 px-3 rounded-xl text-nowrap hover:bg-lightPurple-200 hover:text-white transition-colors duration-150"
						>
							Edit profile
						</NavLink>
						<BsThreeDotsVertical/>
					</div>
				</div>
				<div className="profile-image">
					<Avatar
						imageUrl={ userProfilePicUrl }
						userName={ username }
						userId={ userId }
						variant='userProfileCard'
					/>
				</div>
				<div className="profile-info ">
					<h1 className="font-bold text-2xl">{ username }</h1>
					<p className="font-sans font-thin text-black-75">Joined on October 2024</p>
					<div className="flex gap-2 items-center pt-5">
						{ isPending && <p>Fetching user follow info...</p> }
						{ data && (
							<>
								<p
									className="cursor-pointer hover:text-darkPurple-500 hover:underline text-sm text-gray-500"
									onClick={ () =>
										setFollowInfoModalOpen((prevState) => ({
											...prevState,
											isOpen: true,
											type: "followers",
										}))
									}
								>
									<span className="font-bold text-lg text-obsidianBlack-500">{ data.userFollowInfo.followerCount }</span> followers
								</p>
								<p
									className="cursor-pointer hover:text-darkPurple-500 hover:underline text-sm text-gray-500"
									onClick={ () =>
										setFollowInfoModalOpen((prevState) => ({
											...prevState,
											isOpen: true,
											type: "following",
										}))
									}
								>
									<span className="font-bold text-lg text-obsidianBlack-500">{ data.userFollowInfo.followingCount }</span> following
								</p>
							</>
						) }
					</div>
					<p className="text-sm text-gray-500">
						<span className="font-bold text-lg text-obsidianBlack-500">{ formatNumberToK(reputationPoints) }</span> reputation points
					</p>
				</div>
				<div className="profile-bio">
					{ additionalInfoDataIsPending ? (
						<p>Fetching additional info...</p>
					) : additionalInfoDataIsError ? (
						<p>Failed to fetch additional info</p>
					) : addInfo && addInfo.userAdditionalInfo ? (
						addInfo.userAdditionalInfo.bio === "" ? (
							<NavLink
								to={ `/profile/${ userId }/settings` }
								className="flex items-center text-lg py-1 px-4 border border-black-75 rounded-lg w-fit hover:bg-surface-700 hover:text-white transition-colors duration-150">
								Add Bio
							</NavLink>
						) : (
							<p className="text-sm text-gray-500">{ addInfo.userAdditionalInfo.bio }</p>
						)
					) : (
						<p>No additional info available</p>
					) }
				</div>
				<div className="profile-links">
					{ additionalInfoDataIsPending ? (
						<p>Fetching additional info...</p>
					) : additionalInfoDataIsError ? (
						<p>Failed to fetch additional info</p>
					) : addInfo && addInfo.userAdditionalInfo ? (
						<div className="flex flex-wrap gap-2">
							{ Object.entries(addInfo.userAdditionalInfo)
								.filter(([key, value]) => (value !== null && value !=="") && linkMappings[key])
								.map(([key, value]) => {
									const {name, icon} = linkMappings[key];
									return <SocialPill key={ key } link={ value } icon={ icon } name={ name }/>;
								}) }
						</div>
					) : (
						<p>No additional links available</p>
					) }
				</div>
				<div className="profile-clubs space-y-2">
					<p className="text-sm font-bold">Active in these clubs</p>
					<div className="flex gap-2 items-center flex-wrap">
						<NavLink
							to={ `/clubs` }
							className="border border-black-75 rounded-lg p-2 hover:bg-gray-200">
							<PlusIcon/>
						</NavLink>
						{ clubs.map((club) => (
							<button
								key={ club.clubId }
								className="border border-black-75 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
								onClick={ () => navigate(`/club/${ club.clubId }`) }
							>
								<img
									src={ club.clubProfilePicUrl }
									className="w-10 h-10 object-cover rounded-lg"
									alt=""
								/>
							</button>
						)) }
					</div>
				</div>
			</div>
		</div>
	);
}
