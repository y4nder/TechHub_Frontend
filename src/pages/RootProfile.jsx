import { NavLink, Outlet } from "react-router-dom";
import UserProfileCard from "@/components/UserProfileCard.jsx";

export default function RootProfilePage() {
	return (
		<div
			className={`
				gradient-bg-light
				min-h-screen
				flex
				justify-center
				p-8
			`}
		>
			<div className="grid grid-cols-10 max-w-screen-lg w-full bg-gray-100 rounded-xl">
				<div className="col-span-6 flex-1">
					<ProfileNavbar />
					<div className="rounded-lg">
						<Outlet />
					</div>
				</div>
				<div className="col-span-4 p-4 w-full">
					<UserProfileCard />
				</div>
			</div>
		</div>
	);

	function ProfileNavbar() {
		const activeButtonClass =
			"bg-lightPurple-200 text-white rounded-2xl px-4 py-2";
		const inactiveButtonClass =
			"text-black-300 rounded-2xl px-4 py-2";
		return (
			<div className="border-b-black-75">
				<nav className="flex space-x-4 p-4  font-bold">
					<NavLink
						to=""
						end
						className={({ isActive }) =>
							isActive ? activeButtonClass : inactiveButtonClass
						}
					>
						Posts
					</NavLink>
					<NavLink
						to="replies"
						className={({ isActive }) =>
							isActive ? activeButtonClass : inactiveButtonClass
						}
					>
						Replies
					</NavLink>
					<NavLink
						to="upvotes"
						className={({ isActive }) =>
							isActive ? activeButtonClass : inactiveButtonClass
						}
					>
						Upvotes
					</NavLink>
				</nav>
			</div>
		);
	}
}
