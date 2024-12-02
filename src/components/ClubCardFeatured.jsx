import Button from "@/components/ui/Button.jsx";
import {formatNumberToK} from "@/utils/formatters/numberFomatter.js";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function ClubCardFeatured ({club}) {
	const joinedClubs = useSelector(state => state.joinedClubs.clubs);

	const joined = joinedClubs.find(c => c.clubId === club.clubId);

	const navigate = useNavigate();

	return(
		<div className={`
					flex flex-col gap-4
					justify-between 
					border 
					hover:border-black-75
					hover:border-1 
					rounded-3xl 
					min-w-[325px] min-h-[365px]
					max-w-[325px] 
					bg-white		
					shadow-md		 
            `}
		     onClick={() => {
			     navigate(`/club/${club.clubId}`);
		     }}
		>
			<div>
				<img
					src={ club.clubProfilePicUrl }
					className="h-24 w-screen object-cover overflow-clip rounded-t-3xl"
					alt=""
				/>
			</div>
			<div className="px-6 pb-6 flex flex-col gap-5">
				<div className="flex justify-between">
					<img
						src={ club.clubProfilePicUrl }
						className="w-16 h-16 rounded-full object-cover "
						alt=""
					/>
					<div className="border border-black-75 rounded-xl self-end p-1 flex gap-2">
						<div className="flex -space-x-2 ">
							{club.recentMembersProfilePics.map((pf,index) => (
								<img
									key={pf + ' ' + index}
									src={ pf }
									className="w-6 h-6 rounded-full object-cover self-center"
									alt=""
								/>
							)) }
						</div>
						<p className="text-lg text-black-200 font-medium">
							{ formatNumberToK(club.clubMembersCount)}
						</p>
					</div>
				</div>
				<div className={` flex flex-col gap-1`}>
					<h1 className="font-bold text-lg break-words">{club.clubName}</h1>
					<p className="text-black-200 text-sm line-clamp-5">
						{ club.clubDescription }
					</p>
				</div>
				<div>
					<Button
						className={`
							font-semibold text-sm border border-black-300 px-4 rounded-xl py-2 w-full
							${joined? 
								'bg-lightPurple-50 text-darkPurple-500' 
							:  ''
							}
							text-black hover:bg-gradient-to-tr from-lightPurple-500 to-brightOrange-500
							hover:text-white
							transition-shadow duration-100
						`}
					>
						{ joined ? 'Joined' : 'Join Club'}
					</Button>
				</div>

			</div>
		</div>
	)
}

const notJoinedStyle = " hover:bg-gradient-to-tr from-lightPurple-500 to-brightOrange-500";
const joinedStyle = ""