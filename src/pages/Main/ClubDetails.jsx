import {useParams} from "react-router-dom";
import {useSidebar} from "@/hooks/useSidebar.jsx";
import {dummySingleClub} from "@/utils/dummies/dummyClubs.js";
import {parseDate} from "@/utils/formatters/dateFormatter.js";
import {useSelector} from "react-redux";
import Button from "@/components/ui/Button.jsx";
import {formatNumberToK} from "@/utils/formatters/numberFomatter.js";
import ModeratorCard from "@/components/ModeratorCard.jsx";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {fetchSingleClub} from "@/utils/http/clubs.js";
import {fetchClubArticles} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import ArticleList from "@/components/ArticleList.jsx";

export default function ClubDetailsPage() {
	const userId = getUserIdFromToken();
	const params = useParams();
	const clubId = params.clubId;
	const { expanded } = useSidebar();
	const joinedClubs = useSelector((state) => state.joinedClubs.clubs);
	const joined = joinedClubs.find((c) => c.clubId === +clubId);

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

	return (
		<div
			className={`
			pt-8 pr-[80px] 
			${expanded ? 'pl-[255px]' : 'pl-[65px]'}
		`}>
			<div className="header space-y-5 border-b border-black-75 w-screen pl-16">
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
						}>
						{joined ? 'Joined' : 'Join Club'}
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
				<div className="header-moderatos space-y-2 pb-5">
					<p>Moderators</p>
					<div className="flex gap-4">
						<ModeratorCard moderator={club.clubCreator} isClubCreator />
						{club.moderators.length > 0 &&
							club.moderators.map((moderator, index) => (
								<ModeratorCard key={index} moderator={moderator} />
							))}
					</div>
				</div>
			</div>
			<div
				className={ `justify-center pt-8 pb-8 min-h-screen  ${
					!expanded ? "pl-[40px] " : "pl-[80px] pr-[250px]"
				}` }
			>
				{articles.length === 0 ? (
					<p className="text-center text-gray-500">No articles found for this club.</p>
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
	);
}
