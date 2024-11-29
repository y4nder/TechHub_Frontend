import SideScroller from "@/components/SideScroller.jsx";
import {useSidebar} from "@/hooks/useSidebar.jsx";
import {dummyCategorizedClubs} from "@/utils/dummies/dummyClubs.js";


export default function DiscoverClubsPage() {
	const {expanded} = useSidebar();


	return (
		<div className={`
			flex flex-col gap-6 bg-blue-500 pb-10
			${ expanded ? '' : '' }
		`}
		>
			{dummyCategorizedClubs.categorizeClubs.map(club => {
				return (
					<SideScroller
						key={club.categoryId}
						header={club.categoryName}
						clubs={club.clubs}
					/>
				)
			})}
		</div>
	)
}