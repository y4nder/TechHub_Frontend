import {NavLink, Outlet} from "react-router-dom";
import UserProfileCard from "@/components/UserProfileCard.jsx";
export default function RootProfilePage() {

	return (
		<div className={ `
			gradient-bg-light
			w-screen
			h-full
			pt-6 
			grid grid-cols-6
			pl-[475px]		
			pr-[400px]
			overflow-y-hidden
		` }>
			<div className="col-span-4">
				<ProfileNavbar/>
				<div className="h-screen max-h-full bg-surface-200 overflow-y-auto ">
					<Outlet/>
				</div>
			</div>
			<div className="bg-surface-200 rounded-tr-2xl col-span-2">
				<UserProfileCard/>
			</div>
		</div>
	)

	function ProfileNavbar(){
		const activeButtonClass = "bg-lightPurple-200 text-white rounded-2xl px-4 py-2";
		const inactiveButtonClass = "text-black-300 rounded-2xl px-4 py-2";
		return (
			<div className={`
				border border-b-black-75
			   
			`}>
				<nav className="flex space-x-4 p-4 bg-gray-100 rounded-tl-2xl font-bold">
					<NavLink
						to=""
						end
						className={ ({isActive}) => (isActive ? activeButtonClass : inactiveButtonClass) }
					>
						Posts
					</NavLink>
					<NavLink
						to="replies"
						className={ ({isActive}) => (isActive ? activeButtonClass : inactiveButtonClass) }
					>
						Replies
					</NavLink>
					<NavLink
						to="upvotes"
						className={ ({isActive}) => (isActive ? activeButtonClass : inactiveButtonClass) }
					>
						Upvotes
					</NavLink>
				</nav>
			</div>
		)
	}
}