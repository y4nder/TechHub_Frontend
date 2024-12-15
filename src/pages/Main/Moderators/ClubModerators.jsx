import {useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
	assignModerator,
	getClubMembersForMod,
	getClubModeratorsFull,
	removeModerator
} from "@/utils/http/moderators.js";
import UserCard from "@/components/ui/UserCard.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import {formatNumberToK as formatter, formatNumberToK} from "@/utils/formatters/numberFomatter.js";
import SearchBar from "@/components/ui/Searchbar.jsx";
import {useState} from "react";
import {debounce} from "lodash/function.js";
import Modal from "@/components/ui/Modal.jsx";
import {MdAddModerator, MdOutlineClose, MdRemoveModerator} from "react-icons/md";
import {formatDateTimeVersion2} from "@/utils/formatters/dateFormatter.js";
import {PiBootFill} from "react-icons/pi";
import {FaBan, FaUser} from "react-icons/fa";
import {IoCopy} from "react-icons/io5";
import {SiDgraph} from "react-icons/si";
import TooltippedComponent from "@/components/ui/TooltippedComponent.jsx";
import {Moderator} from "@/utils/constants/roleConstants.js";

export default function ClubModeratorsPage(){
	const {clubId} = useParams();


	const [manageModalOpen, setManageModalOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState({})

	const handleStopManaging = () => {
		setManageModalOpen(false);
	}

	const handleStartManaging = (member) => {
		if (member) {
			console.log(member);
			setManageModalOpen(true);
			setSelectedMember(member);
		}
	}

	const [searchTerm, setSearchTerm] = useState("");

	const {data: moderators, isPending: isPendingModerators, refetch: refetchModerators} = useQuery({
		queryKey: ['moderators', clubId, 'full'],
		queryFn: async () => {
			const data = await getClubModeratorsFull(clubId);
			return data.moderators;
		},
	});

	const {data: membersData, isPending: isPendingUsers, refetch: refetchUsers} = useQuery({
		queryKey: ['clubUsers', clubId, searchTerm],
		queryFn: async ({ queryKey }) => {
			const [_key, clubId, term] = queryKey;
			const data = await getClubMembersForMod(clubId, term || "");
			return data.members;
		},
		keepPreviousData: true,
	});

	const { mutate: assignModeratorMutation, isPending: isAssigning } = useMutation({
		mutationFn: ({ assigneeId, clubId }) => assignModerator(assigneeId, clubId),
		onSuccess: () => {
			refetchModerators();
			refetchUsers();
		},
	});

	const { mutate: removeModeratorMutation, isPending: isRemoving } = useMutation({
		mutationFn: ({ moderatorId, clubId }) => removeModerator(moderatorId, clubId),
		onSuccess: () => {
			refetchModerators();
			refetchUsers();
		},
	});

	const handleAssignModerator = () => {
		if (!selectedMember || !selectedMember.userId) {
			console.error("Selected member is invalid:", selectedMember);
			return;
		}

		console.log("Assigning moderator:", selectedMember);
		assignModeratorMutation({
			assigneeId: +selectedMember.userId,
			clubId,
		});
	};

	const handleRemoveModerator = () => {
		if (!selectedMember || !selectedMember.userId) {
			console.error("Selected member is invalid:", selectedMember);
			return;
		}

		console.log("Removing moderator:", selectedMember);
		removeModeratorMutation({
			moderatorId: +selectedMember.userId,
			clubId: +clubId,
		});
	};

	const isModerator = selectedMember.roles && selectedMember.roles.some(role => role.roleName === "Moderator");

	const ManageUserModal = () => {
		return(
			<Modal
				open={manageModalOpen}
				onClose={handleStopManaging}
				className="py-6 rounded-3xl space-y-4 max-w-lg w-full border border-lightPurple-200 bg-gradient-to-t from-lightPurple-50 to-lightPurple-10 shadow-2xl"
			>
				<div className="space-y-4">
					<div className="top flex justify-between px-6">
						<div className="flex gap-5 items-center">
							{ !selectedMember?.userProfilePicUrl && (<p>Loading Picture</p>) }
							{ selectedMember?.userProfilePicUrl && (
								<Avatar
									imageUrl={ selectedMember?.userProfilePicUrl || '' }
									userName={ selectedMember?.username || 'Unknown User' }
									userId={ selectedMember?.userId || 'N/A' }
									variant="largeRounded"
								/>
							) }
							<div>
								<div className="flex gap-2 items-center">
									<p className="font-bold text-lg">{ selectedMember?.username || 'Unknown User' }</p>
									<div className="flex gap-1 items-center">
										<SiDgraph
											size={ 12 }
											color="purple"
										/>
										<p className="text-sm gradient-text font-bold">{ formatter(selectedMember.reputationPoints) }</p>
									</div>
								</div>
								<p className="text-sm text-gray-600">{ selectedMember?.email || 'Unknown User' }</p>
							</div>
						</div>
						<button
							onClick={ handleStopManaging }
							className="self-start"
						>
							<MdOutlineClose size={ 24 } className="hover:bg-surface-500 rounded-2xl"/>
						</button>
					</div>
					<div
						className="actions grid grid-cols-5 items-center text-gray-600  shadow-md border-y border-lightPurple-50">
						<TooltippedComponent tooltipText="Boot" placement="topCenter">
							<div
								className="flex flex-col gap-2 justify-center py-2 items-center hover:bg-lightPurple-10 hover:text-brightOrange-500">
								<PiBootFill size={ 18 }/>
							</div>
						</TooltippedComponent>

						<TooltippedComponent tooltipText="Ban" placement="topCenter">
							<div
								className="flex flex-col gap-2 justify-center py-2 items-center hover:bg-lightPurple-10 hover:text-red-500">
								<FaBan size={ 18 }/>
							</div>
						</TooltippedComponent>

						<TooltippedComponent tooltipText="Copy" placement="topCenter">
							<div
								className="flex flex-col gap-2 justify-center py-2 items-center hover:bg-lightPurple-10 hover:text-lightPurple-100">
								<IoCopy size={ 18 }/>
							</div>
						</TooltippedComponent>

						<TooltippedComponent tooltipText={ `${isModerator ? 'Remove Moderator' : 'Add Moderator'}` } placement="topCenter">
							<div className="flex flex-col gap-2 justify-center py-2 items-center hover:bg-lightPurple-10 hover:text-darkPurple-500"
								onClick={isModerator ? handleRemoveModerator : handleAssignModerator}
							>
								{isModerator ? (
									<MdRemoveModerator size={18} />
								) : (
									<MdAddModerator size={18} />
								)}
							</div>
						</TooltippedComponent>

						<TooltippedComponent tooltipText="User" placement="topCenter">
							<div
								className="flex flex-col gap-2 justify-center py-2 items-center hover:bg-lightPurple-10 hover:text-blue-500">
								<FaUser size={ 18 }/>
							</div>
						</TooltippedComponent>
					</div>
					<div className="bottom space-y-3 px-6">
						<div className="flex justify-between px-1 text-sm">
							<p className="font-medium">Date Joined</p>
							<p className="text-gray-500">{ formatDateTimeVersion2(selectedMember.dateJoined || Date.now()) }</p>
						</div>
						<div className="border pt-2 pb-4 px-3 rounded-2xl bg-surface-50">
							<h1 className="font-bold">Roles</h1>
							<div className="roles flex flex-wrap gap-2">

								{ selectedMember.roles && (
									selectedMember.roles.map((role, index) => (
										<div key={ index }
										     className={ `border p-2 w-fit rounded-2xl ${ getRoleStyles(role.roleName) }` }
										>
											{ role.roleName }
										</div>
									))
								) }
							</div>
						</div>
					</div>

				</div>
			</Modal>
		)
	}

	const getRoleStyles = (roleName) => {
		switch (roleName) {
			case 'Club Creator':
				return 'bg-gradient-to-br drop-shadow-2xl from-blue-200 to-blue-500 w-fit px-3 text-white rounded-xl';
			case 'Moderator':
				return 'bg-gradient-to-br drop-shadow-2xl from-lightPurple-200 to-lightPurple-500 w-fit px-3 text-white rounded-xl';
			case 'Regular User':
			default:
				return 'bg-gradient-to-br drop-shadow-2xl from-gray-200 to-gray-500 w-fit px-3 text-white rounded-xl';  // Default styles for Regular User
		}
	};

	const handleSearch = debounce((query) => {
		setSearchTerm(query);
		refetchUsers({queryKey: ['clubUsers', clubId, query]});
	}, 300);


	return (
		<>
			{ ManageUserModal() }
			<div className="mt-8">
				<h1 className="text-2xl font-bold pl-3">Moderators</h1>
				<div className=" grid grid-cols-8 ">
					<div className="left col-span-6">
						{ isPendingModerators && (<p>Loading Moderators</p>) }
						{ !isPendingModerators && (
							<div className=" flex flex-wrap gap-4 mt-8">
								{ moderators.map((moderator, index) => (
									<UserCard key={ index } userDetails={ moderator } role="Moderator"/>
								)) }

							</div>
						) }
					</div>
					<div className="right col-span-2 border-gray-200 pt-4 bg-lightPurple-10 px-6 rounded-2xl mt-3">
						<div className="flex gap-2 flex-col">
							<h1 className="font-bold text-2xl gradient-text-reversed">Club members</h1>
							<SearchBar id="search" onKeystrokeSearch={handleSearch}/>
						</div>
						{isPendingUsers && (<p>Loading Club members</p>)}
						{!isPendingUsers && (
							<div className="flex flex-col gap-2 py-5 ">
								{membersData.map((member, index) => (
									<div
										key={index}
										className="follower-info grid grid-cols-3 pb-4 w-full pt-4 px-3 border rounded-2xl  items-center bg-surface-50">
										<div className="col-span-3 flex gap-2 justify-between">
											<div className="flex gap-4">
												<div>
													<Avatar
														imageUrl={ member.userProfilePicUrl }
														userName={ member.username }
														userId={ member.userId }
													/>
												</div>
												<div className="text-sm">
													<div className="flex gap-2 ">
														<strong>{ member.username }</strong>
														<div className="flex gap-1 items-center">
															<SiDgraph
																size={ 12 }
																color="purple"
															/>
															<p className="text-sm gradient-text font-bold">{ formatter(member.reputationPoints) }</p>
														</div>
													</div>
													<p className="text-gray-500 text-xxs">{ member.email }</p>
												</div>
											</div>
											<div>
												<button
													className="border border-black-75 rounded-2xl p-1 px-3 text-sm hover:bg-lightPurple-10"
													onClick={() => {
														handleStartManaging(member)
													}}
												>
													Manage
												</button>
											</div>
										</div>
									</div>
								)) }
							</div>
						) }
					</div>
				</div>
			</div>
		</>
	)
}