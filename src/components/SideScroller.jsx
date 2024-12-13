import ClubCard from "@/components/ClubCard.jsx";
import ClubCardFeatured from "@/components/ClubCardFeatured.jsx";

export default function SideScroller({header, clubs, isFeatured, isSingleCategory = false}) {

	if(clubs.length === 0) {
		return (<></>)
	}

	let content = isFeatured ?
		<FeaturedClubs clubs={clubs}/>
	:  <RegularClubs clubs={clubs}/>

	return (
		<div className="flex flex-col gap-2">
			<div className={ `flex justify-between  items-center` }>
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
				py-3 pr-8 flex flex-row overflow-x-auto snap-x scrollbar-hider`}>
				{content}
			</div>
		</div>
	)

	function RegularClubs({clubs}){
		return (
			<div className="flex flex-row gap-5">
				{clubs.map((club) => (
					<div key={club.clubId} className="snap-start">
						<ClubCard club={club} />
					</div>
				))}
			</div>
		)
	}

	function FeaturedClubs({clubs}){
		return (
			<div className="flex flex-row gap-5 ">
				{clubs.map((club) => (
					<div key={club.clubId} className="snap-start">
						<ClubCardFeatured club={club} />
					</div>
				))}
			</div>
		)
	}
}