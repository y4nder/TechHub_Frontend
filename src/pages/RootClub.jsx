import {Outlet} from "react-router-dom";
// import {useSidebar} from "@/hooks/useSidebar.jsx";

export default function RootClubLayout(){


	return (
		<div className={`
			bg-lightPurple-500 w-screen 
			pr-[10px]
	
		`}>
			This is the root club layout
			<Outlet/>
		</div>
	)
}