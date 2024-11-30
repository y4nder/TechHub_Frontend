import {Outlet} from "react-router-dom";
import ClubsNavbar from "@/components/ClubsNavbar.jsx";
import {TabProvider, useTabContext} from "@/hooks/TabContext.jsx";
// import {useSidebar} from "@/hooks/useSidebar.jsx";

export default function RootClubLayout(){
	return (
		<TabProvider>
			<MainClubContent/>
		</TabProvider>
	)

	function MainClubContent() {
		const {selectedTab} = useTabContext();
		return (
			<div className={ `
				w-screen 
				h-full
				pr-[10px]
				${selectedTab === 0 ? 'gradient-bg-discover' : ''}
				space-y-8
			` }>
				<ClubsNavbar/>
				<Outlet/>
			</div>
		)
	}
}