import {Outlet} from "react-router-dom";

export default function AuthLayout() {
	return <div className="gradient-bg h-screen ">
		<Outlet/>
	</div>
}
