import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function RootLayout(){
	return (
		<>
			<h1>Root Layout</h1>
			<Navbar/>
			<Sidebar/>
			<main>
				<Outlet/>
			</main>
		</>
	)
}