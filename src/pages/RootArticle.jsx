import {Outlet} from "react-router-dom";

export default function RootArticle() {
	return (
		<div className="min-h-screen max-h-full gradient-bg-light">
			<Outlet/>
		</div>
	)
}