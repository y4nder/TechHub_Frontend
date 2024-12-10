import {NavLink, Outlet, useParams} from "react-router-dom";

export default function RootEditProfilePage() {
	const params = useParams();
	const profileId = params.profileId;

	const activeButtonClass =
		"bg-darkOrange-500 text-white rounded-2xl px-4 py-2";
	const inactiveButtonClass =
		"text-black-300 rounded-2xl px-4 py-2";

	return (
		<div className="grid grid-cols-8 gradient-bg-light ">
			<div className="w-fit bg-surface-100 flex  ">
				<aside className="space-y-4 flex-grow h-[calc(100vh-4rem)] ">
					<h1 className="font-bold text-3xl p-10">Settings</h1>
					<nav className="flex flex-col gap-4 p-2">
						<NavLink
							to={`/profile/${profileId}/settings`}
							end
							className={({ isActive }) =>
								isActive ? activeButtonClass : inactiveButtonClass
							}
						>
							Account Details
						</NavLink>
						<NavLink
							to={`security`}
							className={({ isActive }) =>
								isActive ? activeButtonClass : inactiveButtonClass
							}
						>
							Security
						</NavLink>
						<NavLink
							to={`notifications`}
							className={({ isActive }) =>
								isActive ? activeButtonClass : inactiveButtonClass
							}
						>
							Notifications
						</NavLink>
					</nav>
				</aside>
			</div>
			<div className="col-start-3 col-end-7 overflow-x-hidden p-6 pb-9">
				<Outlet/>
			</div>
		</div>
	)
}