import Button from "@/components/ui/Button.jsx";
import {formatNumberToK} from "@/utils/formatters/numberFomatter.js";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {joinClub, leaveClub} from "@/utils/http/clubs.js";
import {dispatchFetchJoinedClubs} from "@/store/joined-clubs-slice.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {useToast} from "@/hooks/use-toast.js";
import Modal from "@/components/ui/Modal.jsx";
import {useState} from "react";
import Avatar from "@/components/ui/Avatar.jsx";

export default function ClubCardFeatured ({club}) {
	const joinedClubs = useSelector(state => state.joinedClubs.clubs);

	const joined = joinedClubs.find(c => c.clubId === club.clubId);

	const navigate = useNavigate();
	const dispatch = useDispatch()
	const {toast} = useToast();

	const [leaveModalOpen, setLeaveModalOpen] = useState(false);


	const {
		mutate : joinMutation,
	} = useMutation({
		mutationFn: joinClub,
		onSuccess: () => {
			toast({
				description: "Club Joined!",
			})
			dispatch(dispatchFetchJoinedClubs(getUserIdFromToken()))
		}
	})

	const {
		mutate : leaveMutation,
	} = useMutation({
		mutationFn: leaveClub,
		onSuccess: () => {
			dispatch(dispatchFetchJoinedClubs(getUserIdFromToken()))
		}
	})

	const handleCancelLeave = () => {
		setLeaveModalOpen(false);
	}

	const handleStartLeaving = () => {
		setLeaveModalOpen(true);
	}

	const handleLeave = () => {
		leaveMutation(club.clubId);
	}

	const handleClubButtonAction = (event) => {
		event.stopPropagation();
		// console.log(joined ? "Leave Club" : "Join Club");

		if(joined){
			handleStartLeaving();
		} else {
			joinMutation(club.clubId);
		}
	}


	const LeaveConfirmationModal = () => {
		return(
			<Modal
				open={leaveModalOpen}
				onClose={handleCancelLeave}
				className="p-6 rounded-2xl space-y-4"
			>
				<div>
					<h1 className="text-lg text-brightOrange-500">Leave Club</h1>
					<p className="text-sm text-gray-500">Are you sure you want to leave the club?</p>
				</div>
				<div className="leave-modal-actions flex gap-4 justify-end">
					<button className="py-1 px-3 bg-surface-500 rounded-xl text-sm hover:bg-surface-700 hover:text-white" onClick={handleCancelLeave}>Cancel</button>
					<button className="py-1 px-3 bg-red-50 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white" onClick={handleLeave}>Leave</button>
				</div>
			</Modal>
		)
	}


	return(
		<div>
			{LeaveConfirmationModal()}
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
						{club.recentMembersProfilePics.length > 0 && (
							<div className="border border-black-75 rounded-xl self-end p-1 flex gap-2">
								<div className="flex -space-x-4 ">
									{club.recentMembersProfilePics.map((pf,index) => (
										// <img
										// 	key={pf + ' ' + index}
										// 	src={ pf }
										// 	className="w-6 h-6 rounded-full object-cover self-center"
										// 	alt=""
										// />
										<Avatar
											key={pf + ' ' + index}
											imageUrl={pf.userProfilePicUrl}
											userName={pf.username}
											userId={pf.userId}
											// variant='navProfile'
										/>
									)) }
								</div>
								<p className="text-lg text-black-200 font-medium">
									{ formatNumberToK(club.clubMembersCount)}
								</p>
							</div>
						)}
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
							onClick={handleClubButtonAction}
						>
							{ joined ? 'Leave Club' : 'Join Club'}
						</Button>
					</div>

				</div>
			</div>
		</div>
	)
}

const notJoinedStyle = " hover:bg-gradient-to-tr from-lightPurple-500 to-brightOrange-500";
const joinedStyle = ""