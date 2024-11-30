import {useSidebar} from "@/hooks/useSidebar.jsx";
import ClubTab from "@/components/ui/ClubTab.jsx";
import {useEffect} from "react";
import {useTabContext} from "@/hooks/TabContext.jsx";
import {useNavigate} from "react-router-dom";

import { useLocation } from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchClubCategories} from "@/utils/http/clubs.js";

export default function ClubsNavbar({ className }) {
	const { expanded } = useSidebar();
	const { selectedTab, setSelectedTab } = useTabContext();
	const navigate = useNavigate();
	const location = useLocation();

	const {
		data: categories,
		isPending : isPendingCategories,
		isError : isErrorCategories,
		error : categoryError
	} = useQuery({
		queryKey: ['categories'],
		queryFn: fetchClubCategories
	})

	// Synchronize selectedTab with the URL
	useEffect(() => {
		const match = location.pathname.match(/category\/(\d+)/);
		const categoryId = match ? parseInt(match[1], 10) : 0; // Default to 0 for Discover tab
		setSelectedTab(categoryId);
	}, [location.pathname, setSelectedTab]);

	const handleSelectTab = (categoryId, clubName) => {
		if (categoryId !== selectedTab) {
			setSelectedTab(categoryId);
			if (categoryId === 0) {
				navigate("/clubs");
			} else {
				navigate(`category/${categoryId}/${clubName}`);
			}
		}
	};

	return (
		<div
			className={` 
        navbar-container
        flex justify-between items-center gap-4
        py-6
        w-screen pr-[100px]
        ${selectedTab === 0? "text-white" : "text-black-200"}
        ${expanded ? "pl-[300px]" : "pl-[100px]"}
        border-b 
        ${className}
      `}
		>
			{isPendingCategories && (
				<p>Fetching Categories</p>
			)}
			{!isPendingCategories && (
				<>

					<div className="tab-container scrollbar-hider flex gap-5 overflow-x-auto w-full">
						<ClubTab
							category={{
								clubCategoryId: 0,
								clubCategoryName: "Discover",
							}}
							isSelected={selectedTab === 0}
							onClickNavigation={() => handleSelectTab(0)}
						/>
						{categories.map((category) => (
							<ClubTab
								key={category.clubCategoryId}
								category={category}
								isSelected={selectedTab === category.clubCategoryId}
								onClickNavigation={() => handleSelectTab(category.clubCategoryId, category.clubCategoryName)}
							/>
						))}
					</div>
					<div>
						<button
							className={`
				            nav-bar-create-club
				            ${ selectedTab === 0 ? "border border-white " : "bg-darkPurple-500 text-white" }
				            py-2 px-8
				            rounded-xl
				            text-nowrap
			          `}
						>
							New Club
						</button>
					</div>

				</>
			)}
		</div>
	);
}