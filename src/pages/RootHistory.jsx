import {NavLink, Outlet} from "react-router-dom";

export default function RootHistoryLayout(){
	const activeButtonClass = "bg-lightPurple-200 text-white rounded-2xl px-4 py-2";
	const inactiveButtonClass = "text-black-300 font-bold rounded-2xl px-4 py-2";
	return (
		<div className={`
			gradient-bg-light
			pt-8
			flex
			items-center
			justify-center
		`}>
			<div className="bg-surface-200 rounded-t-3xl w-full max-w-screen-md">
				<div className="p-6 border border-b-black-75">
					<nav>
						<NavLink
							to="read"
							className={ ({isActive}) => (isActive ? activeButtonClass : inactiveButtonClass) }
						>
							Read History
						</NavLink>
						<NavLink
							to="searched"
							className={ ({isActive}) => (isActive ? activeButtonClass : inactiveButtonClass) }
						>
							Search History
						</NavLink>
					</nav>
				</div>
				<div className="overflow-y-auto">
					<Outlet/>
				</div>
			</div>
		</div>
	)
}