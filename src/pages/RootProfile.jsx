import {NavLink, Outlet} from "react-router-dom";
export default function RootProfilePage() {

	return (
		<div className={ `
			gradient-bg-light
			w-screen
			
			grid grid-cols-4
			pr-[350px]
			pl-[375px]		
		` }>
			<div className="col-span-3">
				<ProfileNavbar/>
				<Outlet/>
			</div>
			<div className="bg-surface-200">
				Side Content
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
				<nav className="flex space-x-4 p-4 bg-gray-100 font-bold">
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