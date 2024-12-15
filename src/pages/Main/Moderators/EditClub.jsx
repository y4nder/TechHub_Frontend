import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Moderator} from "@/utils/constants/roleConstants.js";
import {CameraIcon} from "lucide-react";
import Input from "@/components/ui/Input.jsx";
import MultilineInput from "@/components/ui/MultilineInput.jsx";
import {RadioGroup, RadioItem} from "@/components/ui/RadioGroup.jsx";
import DropdownSelector from "@/components/ui/DropdownSelector.jsx";
import {VscLoading} from "react-icons/vsc";
import {useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast.js";
import {useMutation, useQuery} from "@tanstack/react-query";
import {createClub, fetchClubCategories} from "@/utils/http/clubs.js";
import {dispatchFetchJoinedClubs} from "@/store/joined-clubs-slice.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {ToastAction} from "@/components/ui/toast.jsx";
import {getClubForEdit, updateClubForMod} from "@/utils/http/moderators.js";

export default function EditClubPage() {
	const { clubId } = useParams();
	const { clubs: joinedClubs } = useSelector((state) => state.joinedClubs);
	const joined = joinedClubs.find((c) => c.clubId === +clubId);

	const [clubName, setClubName] = useState("");
	const [clubDescription, setClubDescription] = useState("")
	const [previewImage, setPreviewImage] = useState(null);
	const [imageError, setImageError] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [clubNameError, setClubNameError] = useState({hasError: false, message: ""});
	const [clubDescError, setClubDescError] = useState({hasError: false, message: ""});
	const [clubCategoryError, setClubCategoryError] = useState({hasError: false, message: ""});
	const { toast } = useToast()
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const defaultPermissions = [
		{
			id: 0,
			label: "All Members (recommended)"
		},
		{
			id: 1,
			label: "Only Moderators"
		}
	]

	const [selectedClubType, setSelectedClubType] = useState("type1")
	const [selectedPostContentPermission, setSelectedPostContentPermission] = useState("post1");
	const [selectedInvitePermission, setSelectedInvitePermission] = useState("invite1");

	const {
		data: categories,
		isPending : isPendingCategories,
		isError : isErrorCategories,
		error : categoryError
	} = useQuery({
		queryKey: ['categories'],
		queryFn: fetchClubCategories
	})

	const {
		data: clubData,
		isPending: isPendingClubData,
		isError : isErrorClubData,
	} = useQuery({
		queryKey: ['club', clubId],
		queryFn: () => getClubForEdit(clubId)
	});

	useEffect(() => {
		if (clubData && categories) {
			setSelectedCategory(clubData.clubCategoryId);
			setSelectedClubType(clubData.isPrivate ? "type2" : "type1");
			setPreviewImage(clubData.clubThumbnailUrl || null); // Set the image preview if available
			setClubName(clubData.clubName);
			setClubDescription(clubData.clubIntroduction);


			// Corrected mapping for setting the selected category label
			const initialCategory = categories.find(c => c.clubCategoryId === clubData.clubCategoryId);
			if (initialCategory) {
				console.log({
					id: initialCategory.clubCategoryId,
					label: initialCategory.clubCategoryName,
				});
				setSelectedCategory({
					id: initialCategory.clubCategoryId,
					label: initialCategory.clubCategoryName,
				}); // Set the category name
			}
		}
	}, [clubData, categories]);


	const {
		mutate: updateClubMutation,
		isPending : isPendingPostClub,
		isError : isErrorPostClub,
		error: errorPostClub
	} = useMutation({
		mutationFn: updateClubForMod,
		onSuccess: () => {
			toast({
				description: "Updated Club",
			})
			dispatch(dispatchFetchJoinedClubs(getUserIdFromToken()))
			navigate(`/club/${clubId}`);
		},
		onError: () => {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			})
		}
	})

	if(isPendingCategories){
		return(
			<div>Fetching Categories</div>
		)
	}

	if(isErrorCategories){
		return(
			<div>Error Categories {categoryError}</div>
		)
	}

	const clubCategoryOptions = categories.map((category) => ({
		id: category.clubCategoryId,
		label: category.clubCategoryName
	}));

	const handleCategorySelection = (option) => {
		setSelectedCategory(option);
		setClubCategoryError({hasError: false, message: ""});
		console.log("Selected Category:", option);
	};


	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		// Validate file type
		const validTypes = ["image/png", "image/jpeg"];
		if (!validTypes.includes(file.type)) {
			setImageError(true);
			setPreviewImage(null);
			return;
		}

		// Clear previous error and set the preview image
		setImageError(false);
		const reader = new FileReader();
		reader.onload = () => {
			setPreviewImage(reader.result); // Set the preview image URL
		};
		reader.readAsDataURL(file);
	};


	const handleSubmitCreateClub = (event) => {
		event.preventDefault();

		// Reset errors
		setClubNameError({ hasError: false, message: "" });
		setClubDescError({ hasError: false, message: "" });
		setClubCategoryError({ hasError: false, message: "" });
		setImageError(false);

		let hasErrors = false;

		// Extract values from the form
		const clubName = event.target["clubName"].value.trim();
		const clubDescription = event.target["clubDescription"].value.trim();
		const fileInput = document.getElementById("profilePicture");
		const file = fileInput?.files[0];

		// Validation
		if (clubName === "") {
			setClubNameError({ hasError: true, message: "Club name is required" });
			hasErrors = true;
		}

		if (clubDescription === "") {
			setClubDescError({ hasError: true, message: "Club description is required" });
			hasErrors = true;
		}

		if (selectedCategory === null && selectedClubType === "type1") {
			setClubCategoryError({ hasError: true, message: "Club category is required" });
			hasErrors = true;
		}

		if (!file && !previewImage) {
			setImageError(true);
			hasErrors = true;
		}

		if (hasErrors) return;

		// Prepare additional properties
		const clubCategoryId = selectedClubType === "type1" ? selectedCategory.id : null;
		const postPermission = selectedPostContentPermission === "post1" ? 0 : 1;
		const invitePermission = selectedInvitePermission === "invite1" ? 0 : 1;
		const isPrivate = selectedClubType !== "type1";

		// Create new FormData object
		const formData = new FormData();
		formData.append("ClubId", clubId); // Add file
		formData.append("ClubThumbnail", file); // Add file
		formData.append("ClubThumbnailUrl", clubData.clubThumbnailUrl); // Add file
		formData.append("ClubName", clubName); // Add club name
		formData.append("ClubIntroduction", clubDescription); // Add description
		formData.append("ClubCategoryId", clubCategoryId); // Add category ID
		formData.append("PostPermission", postPermission); // Add post permission
		formData.append("InvitePermission", invitePermission); // Add invite permission
		formData.append("IsPrivate", isPrivate); // Add privacy status

		// Debugging: Log FormData entries
		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}
		// showToast();
		updateClubMutation(formData);
	}


	if (!joined) {
		return <Navigate to="/not-a-member" replace={true} />;
	}

	if (clubId && joined && !joined.roles.find((r) => r.roleName === Moderator)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return (
		<div className={"flex justify-center "}>
			<form className="create-club-card-body p-4 space-y-8 border max-w-3xl" onSubmit={ handleSubmitCreateClub }>
				<div className="create-club-card-club-details space-y-4">
					<h1 className="font-bold">Club Details</h1>
					<div className="input-profile-picture flex flex-col">
						<div className="space-y-2 w-fit">
							<label
								htmlFor="profilePicture"
								className="cursor-pointer w-fit"
								title="Click to change profile picture"
							>
								{/* Check if previewImage is set, and display accordingly */ }
								{ previewImage ? (
									<div
										className={ `group bg-surface-500 px-4 py-2 w-fit flex items-center gap-5 rounded-2xl text-black-75 hover:text-black-300` }>
										<div className="relative">
											<img
												src={ previewImage } // Display the image preview
												alt="Profile Preview"
												className="w-24 h-24 rounded-3xl object-cover border border-gray-300 group-hover:ring-2 group-hover:ring-darkPurple-500 transition-all duration-300"
											/>
										</div>
										<p>Change profile picture</p>
									</div>
								) : (
									<div
										className={ `
												w-fit h-24 rounded-3xl bg-gray-200 flex gap-3 px-8 items-center justify-center
												${ imageError ? 'border border-red-400' : 'border border-gray-300' } 
											` }>
										<CameraIcon/>
										<span className="text-gray-500 text-sm">Club Profile Picture</span>
									</div>
								) }
							</label>

							{ imageError &&
								<p className="text-red-500 text-sm font-sm pl-2">Club Profile Picture is Required</p> }
						</div>

						<input
							id="profilePicture"
							type="file"
							accept=".png, .jpg"
							onChange={ handleFileChange }
							className="hidden"
						/>
					</div>
					<div className="space-y-2">
						{/*<Input*/}
						{/*	id="clubName"*/}
						{/*	placeholder="Name your club"*/}
						{/*	hasError={ clubNameError.hasError }*/}
						{/*/>*/}
						<input
							id="clubName"
							placeholder="Name your club"
							className="bg-surface-500 p-4 text-black-500 rounded-[15px] text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
							value={clubName}
							onChange={(event) => setClubName(event.target.value)}
						/>
						{ clubNameError.hasError && (
							<p className="text-red-500 text-sm pl-2">{ clubNameError.message }</p>
						) }
					</div>
					<div className="space-y-2">
						<MultilineInput
							id="clubDescription"
							placeholder="Description your club"
							hasError={ clubDescError.hasError }
							value = {clubDescription}
							onChange = {(e) => setClubDescription(e.target.value)}
						/>
						{ clubDescError.hasError && (
							<p className="text-red-500 text-sm pl-2">{ clubNameError.message }</p>
						) }
					</div>

				</div>
				<div className="create-club-card-club-type">
					<h1 className="font-bold mb-4">Club Type</h1>
					<RadioGroup
						name="clubCategory"
						selectedValue={ selectedClubType }
						onChange={ setSelectedClubType }
						radioColor="text-brightOrange-500"
						layout="flex flex-col gap-6"
					>
						<RadioItem value="type1">
							<div className="flex flex-col text-sm">
								<p className="font-bold">Public</p>
								<p>Club is searchable and open for everyone to join.</p>
								<div className="space-y-2">
									<DropdownSelector
										label="Choose a Category"
										options={ clubCategoryOptions }
										hasError={ clubCategoryError.hasError }
										onSelect={ (selectedOption) => handleCategorySelection(selectedOption) }
										transitionDuration="200ms"
										initialValue={selectedCategory}
									/>
									{ clubCategoryError.hasError && (
										<p className="text-red-500 text-sm pl-4">{ clubCategoryError.message }</p>
									) }
								</div>
							</div>
						</RadioItem>
						<RadioItem value="type2">
							<div className="flex flex-col text-sm">
								<p className="font-bold">Private</p>
								<p>Club is invite-only and hidden from the directory.</p>
							</div>
						</RadioItem>
					</RadioGroup>
				</div>
				<div className="create-club-card-permissions">
					<div className="create-club-card-permissions-card border border-black-75 rounded-2xl overflow-hidden">
						<div className="create-club-card-permissions-card-header border border-b-black-75 p-4">
							<h1 className="font-bold">Permissions</h1>
						</div>
						<div className="create-club-card-permissions-card-body grid grid-cols-2 p-4">
							<div className="create-club-card-permissions-card-body p-2 space-y-4">
								<div>
									<h1 className="font-bold">Post content</h1>
									<p className="text-sm">Choose who is allowed to post new content in this Club.</p>
								</div>
								<RadioGroup
									name="postPermission"
									selectedValue={ selectedPostContentPermission }
									onChange={ setSelectedPostContentPermission }
									radioColor="text-brightOrange-500"
									layout="flex flex-col gap-6"
								>
									<RadioItem value="post1">
										<p className="font-bold text-sm">{ defaultPermissions[0].label }</p>
									</RadioItem>
									<RadioItem value="post2">
										<p className="font-bold text-sm">{ defaultPermissions[1].label }</p>
									</RadioItem>
								</RadioGroup>
							</div>
							<div className="create-club-card-permissions-card-body p-2 space-y-4">
								<div>
									<h1 className="font-bold">Invite others</h1>
									<p className="text-sm">Choose who is allowed to invite new members to this Club.</p>
								</div>
								<RadioGroup
									name="invitePermission"
									selectedValue={ selectedInvitePermission }
									onChange={ setSelectedInvitePermission }
									radioColor="text-brightOrange-500"
									layout="flex flex-col gap-6"
								>
									<RadioItem value="invite1">
										<p className="font-bold text-sm">{ defaultPermissions[0].label }</p>
									</RadioItem>
									<RadioItem value="invite2">
										<p className="font-bold text-sm">{ defaultPermissions[1].label }</p>
									</RadioItem>
								</RadioGroup>
							</div>
						</div>
					</div>
				</div>
				<div className="create-club-card-actions flex justify-end items-end">
					<button
						className={ `
								bg-darkPurple-500 text-white py-2 px-6 rounded-2xl flex items-center gap-2
								disabled:bg-lightPurple-200
							` }
						disabled={ isPendingPostClub }
						type="submit"
					>
						{ isPendingPostClub ? (
								<>
									<VscLoading className="w-4 h-4 animate-spin"/>
									Updating Club...
								</>
							) :
							'Update Club'
						}

					</button>
				</div>
			</form>
		</div>
	)

}