import {Outlet} from "react-router-dom";
import ClubsNavbar from "@/components/ClubsNavbar.jsx";
import {TabProvider, useTabContext} from "@/hooks/TabContext.jsx";

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
				${selectedTab === 0 ? 'gradient-bg-discover' : ''}
				space-y-8
			` }>
				<ClubsNavbar/>
				<div className="root-club-outlet p-4">
					<Outlet/>
				</div>
			</div>
		)
	}
}