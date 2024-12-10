import {AiFillStar} from "react-icons/ai";
import {ShieldCheck} from "lucide-react";
import Avatar from "@/components/ui/Avatar.jsx";

export default function ModeratorCard({moderator, isClubCreator}) {
	return(
		<div className="flex gap-2 border border-black-75 w-fit p-2 rounded-xl">
			{/*<img*/}
			{/*	src={ moderator.userProfilePicUrl }*/}
			{/*	className="w-10 h-10 rounded-full object-cover self-center"*/}
			{/*	alt=""*/}
			{/*/>*/}
			<Avatar
				imageUrl={moderator.userProfilePicUrl}
				userName={moderator.username}
				userId={moderator.userId}
				variant='largeSemiRounded'
			/>
			<div className="self-center">
				<p className="font-bold text-lg">{moderator.username}</p>

				<p className="flex text-lightPurple-500 gap-1 text-sm self-end">
					{isClubCreator ?
						<AiFillStar size={18}/>
						: <ShieldCheck size={18} />
					}
					{moderator.roleName}
				</p>
			</div>
		</div>
	)
}