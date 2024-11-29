export default function ClubCard({club}) {
	return(
		<div className={`
				  justify-between 
				  border 
				  border-black-50 
				  rounded-3xl 
				  pt-12 px-4 pb-2
				  min-w-[325px] min-h-[150px]
				  bg-white				 
            `}>
			<h1 className="text-2xl font-bold">{club.clubName}</h1>
			<p>{club.clubMembersCount}</p>
			<p>{club.clubDescription}</p>
		</div>
	)
}