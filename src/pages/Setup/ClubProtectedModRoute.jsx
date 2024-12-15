import {Navigate, NavLink, Outlet, useParams} from "react-router-dom";
import { useSelector } from "react-redux";
import {useQuery} from "@tanstack/react-query";
import {fetchSingleClub} from "@/utils/http/clubs.js";
import {IoSettingsOutline} from "react-icons/io5";

export default function ClubProtectedModRoute({ role }) {
	const { clubId } = useParams();
	const { clubs: joinedClubs } = useSelector((state) => state.joinedClubs);
	const joined = joinedClubs.find((c) => c.clubId === +clubId);

	const {
		data: club,
		isLoading: isPendingClubDetails,
	} = useQuery({
		queryKey: ['clubs', clubId],
		queryFn: async () => {
			const data = await fetchSingleClub(clubId);
			return data.club; // Ensure this returns the correct club object
		},
	});

	if (!joined) {
		return <Navigate to="/not-a-member" replace={true} />;
	}

	if (clubId && joined && !joined.roles.find((r) => r.roleName === role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	const activeButtonClass =
		"bg-lightPurple-50 text-darkPurple-500 rounded-xl px-4 py-1";
	const inactiveButtonClass =
		"text-black-300 rounded-2xl px-4 py-2";

	return (
		<div className="py-4 pl-10 pr-8 gradient-bg-clubDetails-r">
			{isPendingClubDetails && (<p>Fetching Club Details</p>)}
			{!isPendingClubDetails && (<ModeratorsHeader/>)}
			<Outlet />
		</div>
	);

	function ModeratorsHeader() {
		return (
			<div className="club-moderation-header space-y-4">
				<div className="club-moderation-header-info">
					<div className="flex gap-4 items-center mb-">
						<img
							src={ club.clubProfilePicUrl }
							className="w-20 h-20 rounded-full object-cover self-center"
							alt=""
						/>
						<div className="space-y-2 flex gap-2 items-center py-2">
							<h1 className="font-bold text-4xl">{ club.clubName }</h1>
							<NavLink
								to={`/club/${clubId}/edit`}
								className="p-2 text-md rounded-xl bg-surface-500 text-nowrap hover:bg-lightPurple-200 hover:text-white transition-colors duration-150"
							>
								<IoSettingsOutline size={16}/>
							</NavLink>
						</div>
					</div>
				</div>

				<nav className="club-moderation-header-navigation flex gap-5 items-center border-b pb-4 border-gray-200">
					<NavLink to={ '' } end
			         className={ ({isActive}) =>
				         isActive ? activeButtonClass : inactiveButtonClass
			         }
					>
						Dashboard
					</NavLink>
					<NavLink to={ 'posts' }
			         className={ ({isActive}) =>
				         isActive ? activeButtonClass : inactiveButtonClass
			         }
					>
						Posts
					</NavLink>
					<NavLink to={ 'moderators' }
			         className={ ({isActive}) =>
				         isActive ? activeButtonClass : inactiveButtonClass
			         }
					>
						Members
					</NavLink>
					<NavLink to={ 'reports' }
			         className={ ({isActive}) =>
				         isActive ? activeButtonClass : inactiveButtonClass
			         }
					>
						Reports
					</NavLink>
				</nav>
			</div>
		)
	}
}
