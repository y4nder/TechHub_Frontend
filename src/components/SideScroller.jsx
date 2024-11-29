import {useSidebar} from "@/hooks/useSidebar.jsx";
import ClubCard from "@/components/ClubCard.jsx";

export default function SideScroller({header, clubs}) {
	const  {expanded} = useSidebar();

	if(clubs.length == 0){
		return (<></>)
	}

	return (
		<div className="flex flex-col gap-2">
			<div className={ `
				${expanded ? 'pl-[300px] ' : 'pl-[100px]'}
			` }>
				<h1 className="font-bold text-2xl">
					{header}
				</h1>
			</div>
			<div className={ `
				py-3 pr-8 flex flex-row w-full gap-5 overflow-x-auto bg-red-400
				${expanded ? 'pl-[300px] ' : 'pl-[100px]'}
			`}
			>
				{clubs.map((club) => (
					<ClubCard key={club.Id} club={club} />
				))}
			</div>
		</div>
	)
}