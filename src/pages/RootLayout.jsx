import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar, { SidebarItem, SidebarItemGroup } from "../components/Sidebar.jsx";
import { History } from "lucide-react";
import { SiSamsclub } from "react-icons/si";
import { TbArticleFilled } from "react-icons/tb";
import { PiTagFill } from "react-icons/pi";
import { BsBookmarkFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { dispatchFetchJoinedClubs } from "@/store/joined-clubs-slice.js";
import { getUserIdFromToken } from "@/utils/token/token.js";
import { ProfileNavDispatcher } from "@/store/user-slice.js";
import { SidebarProvider, useSidebar } from "@/hooks/useSidebar.jsx";

export default function RootLayout() {
	const [activeItem, setActiveItem] = useState(""); // Track the active sidebar item
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { clubs, hasError } = useSelector((state) => state.joinedClubs);
	const user = useSelector((state) => state.user);
	const id = getUserIdFromToken();

	useEffect(() => {
		if (!id && id === null) {
			navigate("/auth/sign-in");
			return;
		}
		dispatch(ProfileNavDispatcher(id));
	}, [dispatch, id, navigate]);

	useEffect(() => {
		if (id) {
			dispatch(dispatchFetchJoinedClubs(id));
		}
	}, [dispatch, id]);

	const handleNavigation = (path, itemName) => {
		setActiveItem(itemName); // Set the active item
		navigate(path); // Navigate to the specified path
	};

	return (
		<>
			<Navbar user={user} />
			<SidebarProvider>
				<div className="flex pt-16">
					<Sidebar>
						<SidebarItemGroup headerText="Clubs">
							{hasError ? (
								<p>Error Fetching clubs</p>
							) : clubs.length > 0 ? (
								clubs.map((club) => (
									<SidebarItem
										key={club.clubId}
										imageUrl={club.clubProfilePicUrl}
										text={club.clubName}
										active={activeItem === club.clubName}
										sidebarAction={() => {
											setActiveItem(club.clubName)
											navigate(`/club/${club.clubId}`);
										}}
									/>
								))
							) : (
								<p>No clubs joined.</p>
							)}
						</SidebarItemGroup>
						<SidebarItemGroup headerText="Discover">
							<SidebarItem
								icon={<SiSamsclub size={20} />}
								text="Clubs"
								iconColor="darkPurple-500"
								textColor="text-darkPurple-500"
								active={activeItem === "Clubs"}
								sidebarAction={() => handleNavigation("/clubs", "Clubs")}
							/>
							<SidebarItem
								icon={<TbArticleFilled size={20} />}
								text="Articles"
								iconColor="darkOrange-500"
								textColor="text-darkOrange-500"
								active={activeItem === "Articles"}
								sidebarAction={() => handleNavigation("/articles", "Articles")}
							/>
							<SidebarItem
								icon={<PiTagFill size={20} />}
								text="Tags"
								iconColor="obsidianBlack-500"
								textColor="text-obsidianBlack-500"
								active={activeItem === "Tags"}
								sidebarAction={() => handleNavigation("/tags", "Tags")}
							/>
						</SidebarItemGroup>
						<SidebarItemGroup headerText="Recents">
							<SidebarItem
								icon={<BsBookmarkFill size={20} />}
								text="Bookmarks"
								iconColor="obsidianBlack-500"
								textColor="text-obsidianBlack-500"
								active={activeItem === "Bookmarks"}
								sidebarAction={() => handleNavigation("/bookmarks", "Bookmarks")}
							/>
							<SidebarItem
								icon={<History size={20} />}
								text="History"
								iconColor="obsidianBlack-500"
								textColor="text-obsidianBlack-500"
								active={activeItem === "History"}
								sidebarAction={() => handleNavigation("/history", "History")}
							/>
						</SidebarItemGroup>
					</Sidebar>
					<MainContent />
				</div>
			</SidebarProvider>
		</>
	);

	// Separate component for MainContent
	function MainContent() {
		const { expanded } = useSidebar(); // Access sidebar state

		return (
			<main

			>
				<Outlet />
			</main>
		);
	}
}
