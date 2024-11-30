import Button from "@/components/ui/Button.jsx";
import {formatNumberToK} from "@/utils/formatters/numberFomatter.js";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function ClubCard({club}) {
	const joinedClubs = useSelector(state => state.joinedClubs.clubs);
	const joined = joinedClubs.find(c => c.clubId === club.clubId);
	const navigate = useNavigate();
	return(
		<div className={`
					flex flex-col gap-4
					justify-between 
					border 
					border-black-75
					hover:border-black-200
					hover:border-1 
					rounded-3xl 
					pt-8 px-6 pb-6
					min-w-[325px] min-h-[275px]
					max-w-[325px] max-h-[275px]
					bg-white				 
            `}
			onClick={() => {
				navigate(`/club/${club.clubId}`);
			}}
		>
			<div className="flex justify-between">
				<img
					src={club.clubProfilePicUrl}
					className="w-16 h-16 rounded-full object-cover "
					alt=""
				/>
				<Button
					className={`
						font-semibold text-sm border border-black-300 px-4 rounded-xl self-end py-2
						hover:bg-gradient-to-tr from-lightPurple-500 to-brightOrange-500 
						hover:text-white
						transition-shadow duration-100
						${joined?
						'bg-lightPurple-50 text-darkPurple-500'
						:  ''
					}
					`}
				>
					{ joined ? 'Joined' : 'Join Club'}
				</Button>
			</div>
			<div className={` flex flex-col gap-1`}>
				<h1 className="font-bold text-lg break-words">{club.clubName}</h1>
				<p className="text-black-200 text-sm">
					{ club.clubDescription }
				</p>
			</div>
			<div>
				<p className="font-bold text-sm ">
					{formatNumberToK(club.clubMembersCount)} members
				</p>
			</div>
		</div>
	)
}