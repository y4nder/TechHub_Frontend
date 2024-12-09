import {NavLink, useParams} from "react-router-dom";
import {useSidebar} from "@/hooks/useSidebar.jsx";
import {dummySingleClub} from "@/utils/dummies/dummyClubs.js";
import {parseDate} from "@/utils/formatters/dateFormatter.js";
import {useDispatch, useSelector} from "react-redux";
import Button from "@/components/ui/Button.jsx";
import {formatNumberToK} from "@/utils/formatters/numberFomatter.js";
import ModeratorCard from "@/components/ModeratorCard.jsx";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {fetchSingleClub, joinClub, leaveClub} from "@/utils/http/clubs.js";
import {fetchClubArticles} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import ArticleList from "@/components/ArticleList.jsx";
import {useToast} from "@/hooks/use-toast.js";
import {useState} from "react";
import {dispatchFetchJoinedClubs} from "@/store/joined-clubs-slice.js";
import Modal from "@/components/ui/Modal.jsx";

export default function ClubDetailsPage() {
	const userId = getUserIdFromToken();
	const params = useParams();
	const clubId = params.clubId;
	const joinedClubs = useSelector((state) => state.joinedClubs.clubs);
	const {userProfilePicUrl} = useSelector(state => state.user);
	const joined = joinedClubs.find((c) => c.clubId === +clubId);
	const dispatch = useDispatch()
	const {toast} = useToast();

	const [leaveModalOpen, setLeaveModalOpen] = useState(false);

	const {
		data: club,
		isLoading: isPendingClubDetails,
		isError,
		error,
	} = useQuery({
		queryKey: ['clubs', clubId],
		queryFn: async () => {
			const data = await fetchSingleClub(clubId);
			return data.club; // Ensure this returns the correct club object
		},

	});

	// Infinite query for fetching articles
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["articles", "club", clubId],
		queryFn: ({ pageParam = 1 }) =>
			fetchClubArticles(clubId, userId, pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		}
	});

	const {
		mutate : joinMutation,
	} = useMutation({
		mutationFn: joinClub,
		onSuccess: () => {
			toast({
				description: "Club Joined!",
			})
			dispatch(dispatchFetchJoinedClubs(getUserIdFromToken()))
		}
	})

	const {
		mutate : leaveMutation,
	} = useMutation({
		mutationFn: leaveClub,
		onSuccess: () => {
			dispatch(dispatchFetchJoinedClubs(getUserIdFromToken()))
		}
	})

	// Flatten articles from all pages
	const articles =
		data?.pages.flatMap((page) => page.articles.items) || [];

	if (isPendingClubDetails) {
		return <p>Fetching club details...</p>;
	}

	if (isError) {
		return <p>Error: {error.message}</p>; // Show error message
	}

	if (!club) {
		return <p>Club not found.</p>;
	}



	const handleCancelLeave = () => {
		setLeaveModalOpen(false);
	}

	const handleStartleaving = () => {
		setLeaveModalOpen(true);
	}

	const handleLeave = () => {
		leaveMutation(club.clubId);
	}

	const handleClubButtonAction = () => {
		// event.stopPropagation();
		console.log(joined ? "Leave Club" : "Join Club");

		if(joined){
			handleStartleaving();
		} else {
			joinMutation(club.clubId);
		}
	}


	const LeaveConfirmationModal = () => {
		return(
			<Modal
				open={leaveModalOpen}
				onClose={handleCancelLeave}
				className="p-6 rounded-2xl space-y-4"
			>
				<div>
					<h1 className="text-lg text-brightOrange-500">Leave Club</h1>
					<p className="text-sm text-gray-500">Are you sure you want to leave the club?</p>
				</div>
				<div className="leave-modal-actions flex gap-4 justify-end">
					<button className="py-1 px-3 bg-surface-500 rounded-xl text-sm hover:bg-surface-700 hover:text-white" onClick={handleCancelLeave}>Cancel</button>
					<button className="py-1 px-3 bg-red-50 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white" onClick={handleLeave}>Leave</button>
				</div>
			</Modal>
		)
	}

	return (
		<div>
			{LeaveConfirmationModal()}
			<div
				className={`
				pt-8 
				bg-surface-50 
				
			`}>
				<div className="header space-y-5 border-b border-black-75 w-screen pl-16 ">
					<div className="head-header flex gap-4">
						<img
							src={club.clubProfilePicUrl}
							className="w-20 h-20 rounded-full object-cover self-center"
							alt=""
						/>
						<div className="head-details flex flex-col">
							<h1 className="font-bold text-4xl">{club.clubName}</h1>
							<p> Created On {parseDate(club.clubCreatedDateTime)}</p>
							<p>
								<span className="font-bold">{club.postCount}</span> Posts
								<span className="font-bold"> {club.clubViews}</span> Views
								<span className="font-bold"> {club.clubUpVoteCount}</span> Upvotes
							</p>
						</div>
					</div>
					<div className="head-description w-full">
						<p className="max-w-2xl break-words">{club.clubIntroduction}</p>
					</div>
					<div className="header-actions flex gap-4">
						<Button
							className={
								'bg-lightPurple-500 text-white px-14 rounded-xl text-md hover:bg-brightOrange-500'
							}
							onClick={handleClubButtonAction}
						>
							{joined ? 'Leave Club' : 'Join Club'}
						</Button>
						<div className="border border-black-75 rounded-xl self-end p-1 flex gap-2">
							<div className="flex -space-x-2 ">
								{club.recentMemberProfilePics.map((pf, index) => (
									<img
										key={pf + ' ' + index}
										src={pf}
										className="w-8 h-8 rounded-full object-cover self-center"
										alt=""
									/>
								))}
							</div>
							<p className="text-lg text-black-200 font-medium">
								{formatNumberToK(club.memberCount)}
							</p>
						</div>
					</div>
					<div className="header-moderators space-y-2 pb-5">
						<p>Moderators</p>
						<div className="flex gap-4">
							<ModeratorCard moderator={club.clubCreator} isClubCreator />
							{club.moderators.length > 0 &&
								club.moderators.map((moderator, index) => (
									<ModeratorCard key={index} moderator={moderator} />
								))}
						</div>
					</div>
					{club.joined && (
						<div className="header-new-post flex gap-4 border w-fit p-4 rounded-2xl items-center translate-y-8 bg-surface-200">
							<img
								src={userProfilePicUrl}
								alt={""}
								className="w-12 h-12 object-cover rounded-lg"
							/>
							<p className="text-sm text-gray-500">Anything to Share?</p>
							<NavLink
								to={`/articles/new/${clubId}`}
								className="bg-lightPurple-500 text-white px-4 py-2 rounded-2xl hover:bg-pink-400 transition-colors duration-200">
								New Post
							</NavLink>
						</div>
					)}
				</div>
				<div
					className={ `justify-center py-20 px-20` }
				>
					{articles.length === 0 ? (
						<p className="text-center text-gray-500 ">No articles found for this club.</p>
					) : (
						<ArticleList
							articles={ articles }
							hasNextPage={ hasNextPage }
							fetchNextPage={ fetchNextPage }
							isFetchingNextPage={ isFetchingNextPage }
						/>
					)}
				</div>
			</div>
		</div>
	);
}
