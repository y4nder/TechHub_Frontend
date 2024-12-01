import {Outlet} from "react-router-dom";

export default function RootProfileDetailsPage() {
	return (
		<div>
			<Outlet/>
			<div>
				Right side content
			</div>
		</div>
	)
}