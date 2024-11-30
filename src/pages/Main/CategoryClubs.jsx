import {useParams} from "react-router-dom";
// import {dummySingleCategoryClubs as singleCategory} from "@/utils/dummies/dummyClubs.js";
import SideScroller from "@/components/SideScroller.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchSingleCategoryClub} from "@/utils/http/clubs.js";

export default function CategoryClubsPage(){
	const params = useParams();
	const categoryId = params.categoryId;
	const categoryName = params.categoryName;

	const {
		data : singleCategory,
		isPending,
		isLoading,
		error
	} = useQuery({
		queryKey : ['clubs', 'categorized', 'single'],
		queryFn: () => {
			return fetchSingleCategoryClub(categoryId);
		}
	})

	if(!singleCategory || singleCategory.clubs.length === 0){
		return <p className="mx-auto">No Clubs for this category</p>
	}


	return(
		<div className={`
				text-black-200
			`}
		>
			<SideScroller
				key={categoryId}
				header={categoryName}
				clubs={singleCategory.clubs}
				isSingleCategory
			/>
		</div>
	)
}
