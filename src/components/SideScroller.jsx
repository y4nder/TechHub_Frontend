import {useSidebar} from "@/hooks/useSidebar.jsx";
import ClubCard from "@/components/ClubCard.jsx";
import ClubCardFeatured from "@/components/ClubCardFeatured.jsx";

export default function SideScroller({header, clubs, isFeatured, isSingleCategory = false}) {
	const  {expanded} = useSidebar();

	if(clubs.length === 0) {
		return (<></>)
	}

	let content = isFeatured ?
		<FeaturedClubs clubs={clubs}/>
	:  <RegularClubs clubs={clubs}/>

	return (
		<div className="flex flex-col gap-2">
			<div className={ `
				flex justify-between pr-[100px] items-center
				${expanded ? 'pl-[300px] ' : 'pl-[100px]'}
			` }>
				<h1 className={`
					font-bold  pl-2
					${isFeatured ? 'text-white text-2xl' : 'text-xl'}
				`}>
					{header}
				</h1>
				{!isSingleCategory && (
					<button className={`
						${isFeatured ? 'text-white' : ''}	
					`}>
						See All
					</button>
				)}
			</div>
			<div className={ `
				py-3 pr-8 flex flex-row w-full gap-5 overflow-x-auto
				scrollbar-hider
				${expanded ? 'pl-[300px] ' : 'pl-[100px]'}
			`}
			>
				{content}
			</div>
		</div>
	)

	function RegularClubs({clubs}){
		return (
			<>
				{clubs.map((club) => (
					<ClubCard key={club.clubId} club={club} />
				))}
			</>
		)
	}

	function FeaturedClubs({clubs}){
		return (
			<>
				{clubs.map((club) => (
					<ClubCardFeatured key={club.clubId} club={club} />
				))}
			</>
		)
	}
}