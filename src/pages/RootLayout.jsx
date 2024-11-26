import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar, {SidebarItem, SidebarItemGroup} from "../components/Sidebar.jsx";
import { GroupIcon, History,} from "lucide-react";
import {SiSamsclub} from "react-icons/si";
import {TbArticleFilled} from "react-icons/tb";
import {PiTagFill} from "react-icons/pi";
import {BsBookmarkFill} from "react-icons/bs";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {dispatchFetchJoinedClubs} from "@/store/joined-clubs-slice.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {dispatchFetchProfileNav} from "@/store/user-slice.js";


export default function RootLayout(){
	const dispatch = useDispatch();
	const {clubs, hasError} = useSelector(state => state.joinedClubs);
	const user = useSelector(state => state.user);

	useEffect(() => {
		dispatch(dispatchFetchProfileNav(getUserIdFromToken()));
	},[dispatch]);

	useEffect(() => {
		dispatch(dispatchFetchJoinedClubs(getUserIdFromToken()));
	}, [dispatch]);

	return (
		<>
			<Navbar user={user}/>
			<div className="flex">
				<Sidebar>
					<SidebarItemGroup headerText="Clubs">
						{hasError ? (
							<p>Error Fetching clubs</p>
						)
						: clubs.length > 0 ? (
							clubs.map((club) => (
								<SidebarItem
									key={club.clubId}
									imageUrl={club.clubProfilePicUrl}
									text={club.clubName}
								/>
							))
						)
						: (
							<p>No clubs joined.</p>
						)}
					</SidebarItemGroup>
					<SidebarItemGroup headerText="Discover">
						<SidebarItem
							icon={<SiSamsclub size={20} />}
							text="Clubs"
							iconColor="darkPurple-500"
							textColor="text-darkPurple-500"/>
						<SidebarItem
							icon={<TbArticleFilled size={20} />}
		               text="Articles"
							iconColor="darkOrange-500"
		               textColor="text-darkOrange-500"/>
						<SidebarItem
							icon={<PiTagFill
							size={20} />}
							text="Tags"
							iconColor="obsidianBlack-500"
							textColor="text-obsidianBlack-500"/>
					</SidebarItemGroup>
					<SidebarItemGroup headerText="Recents">
						<SidebarItem
							icon={<BsBookmarkFill size={20} />}
							text="Bookmarks"
							iconColor="obsidianBlack-500"
							textColor="text-obsidianBlack-500"/>
						<SidebarItem
							icon={<History size={20} />}
							text="History"
							iconColor="obsidianBlack-500"
							textColor="text-obsidianBlack-500"/>
					</SidebarItemGroup>
				</Sidebar>
				<main className="flex-1 overflow-auto p-4">
					<Outlet />
				</main>
			</div>
		</>
	)
}