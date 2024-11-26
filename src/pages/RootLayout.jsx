import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar, {SidebarItem, SidebarItemGroup} from "../components/Sidebar.jsx";
import { GroupIcon, History,} from "lucide-react";
import {SiSamsclub} from "react-icons/si";
import {TbArticleFilled} from "react-icons/tb";
import {PiTagFill} from "react-icons/pi";
import {BsBookmarkFill} from "react-icons/bs";


export default function RootLayout(){
	return (
		<>
			<Navbar />
			<div className="flex">
				<Sidebar>
					<SidebarItemGroup headerText="Clubs">
						<SidebarItem icon={<GroupIcon size={20} />} text="Java Programming" active />
						<SidebarItem icon={<GroupIcon size={20} />} text=".NET"  />
						<SidebarItem icon={<GroupIcon size={20} />} text="Python"  />
						<SidebarItem icon={<GroupIcon size={20} />} text="React"  />
						<SidebarItem icon={<GroupIcon size={20} />} text="Tailwind CSS"  />
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