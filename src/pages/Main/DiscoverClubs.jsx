import SideScroller from "@/components/SideScroller.jsx";
// import {dummyCategorizedClubs as categorizedClubs} from "@/utils/dummies/dummyClubs.js";
// import {dummyFeaturedClubs as featuredClubs} from "@/utils/dummies/dummyClubs.js";
import {useQuery} from "@tanstack/react-query";
import {fetchCategorizedClubs, fetchFeaturedClubs} from "@/utils/http/clubs.js";


export default function DiscoverClubsPage() {


	const {
		data: featuredClubs,
		isPending : isPendingFeatured,
		isError : isErrorFeatured,
		error: errorFeatured
	}
		= useQuery({
		queryKey:['clubs', 'featured'],
		queryFn: fetchFeaturedClubs
	})

	const {
		data: categorizedClubs,
		isPending : isPendingCategorized,
		isError : isErrorCategorized,
		error: errorCategorized
	}
		= useQuery({
		queryKey:['clubs', 'categorized'],
		queryFn: fetchCategorizedClubs
	})


	return (
		<div className={`flex flex-col gap-6 px-8  pb-10`}
		>
			<div className="">
				{isPendingFeatured && (
					<p>Fetching Featured Clubs</p>
				)}
				{!isPendingFeatured && (
					<SideScroller
						header={"Featured Clubs"}
						clubs={featuredClubs.featuredClubs}
						isFeatured
					/>
				)}
			</div>
			{isPendingCategorized && (
				<p>Fetching Categorized Clubs</p>
			)}

			{/* Categorized Clubs Section */}
			{isPendingCategorized && <p>Fetching Categorized Clubs</p>}
			{!isPendingCategorized && categorizedClubs?.categorizeClubs?.length > 0 && (
				categorizedClubs.categorizeClubs.map((club) => (
					<SideScroller
						key={club.categoryId}
						header={club.categoryName}
						clubs={club.clubs}
					/>
				))
			)}
			{!isPendingCategorized && categorizedClubs?.categorizeClubs?.length === 0 && (
				<p>No categorized clubs available</p>
			)}
		</div>
	)
}