import {useTabContext} from "@/hooks/TabContext.jsx";

export default function ClubTab({category, onClickNavigation, isSelected, ...props}) {
	const {selectedTab} = useTabContext()

	return <button
		onClick={onClickNavigation}
		className={`
		  ${selectedTab === 0? "text-white" : "text-black-200"} 
			py-1 rounded-xl px-2	
			text-nowrap 
			${ selectedTab === 0 ? "hover:bg-darkOrange-500" : "hover:bg-lightPurple-50" }
			${isSelected ? 
				`${selectedTab === 0? "bg-darkOrange-500" : "bg-lightPurple-50"}`
				: ''
			}
		`}
		{...props}
	>
		{category.clubCategoryName}
	</button>
}