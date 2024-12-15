import { CameraIcon } from "lucide-react";
import {useCallback, useEffect, useRef, useState} from "react";
import { CiAt } from "react-icons/ci";
import MultilineInput from "@/components/ui/MultilineInput.jsx";
import Input from "@/components/ui/Input.jsx";
import SocialLinkInput from "@/components/ui/SocialLinkInput.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {
	checkUsernameValidity,
	getSelfUserAdditionalInfo,
	removeUploadedProfile, updateUserData,
	uploadProfile
} from "@/utils/http/users.js";
import {useToast} from "@/hooks/use-toast.js";
import {ToastAction} from "@/components/ui/toast.jsx";
import {VscLoading} from "react-icons/vsc";
import {useDispatch, useSelector} from "react-redux";
import {ProfileNavDispatcher} from "@/store/user-slice.js";
import Avatar from "@/components/ui/Avatar.jsx";

export default function ProfileAccountDetailsPage() {
	const [previewImage, setPreviewImage] = useState(null);
	const [imageError, setImageError] = useState(false);
	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState(null);
	// const [debounceTimer, setDebounceTimer] = useState(null);
	const debounceTimerRef = useRef(null);

	const [bio, setBio] = useState("");
	const [company, setCompany] = useState("");
	const [contact, setContact] = useState("");
	const [job, setJob] = useState("");
	const [socialLinks, setSocialLinks] = useState({
		Github: "",
		LinkedIn: "",
		X: "",
		PersonalWebsite: "",
		YouTube: "",
		StackOverflow: "",
		Reddit: "",
		Threads: "",
	});
	const {userId, username: originalUsername} = useSelector((state) => state.user);
	const navigate = useNavigate();
	const {toast}= useToast();
	const dispatch = useDispatch();

	// Track if the profile has been changed and store the publicId for deletion
	const [profileChanged, setProfileChanged] = useState(false);
	const [uploadedPublicId, setUploadedPublicId] = useState("");

	const params = useParams();
	const profileId = params.profileId;

	const { data, isPending, isError, error,refetch  } = useQuery({
		queryKey: ['users', profileId, "self"],
		queryFn: getSelfUserAdditionalInfo,
	});

	const { mutate: uploadProfileMutation, isPending: isUploadingProfile } = useMutation({
		mutationFn: uploadProfile,
		onSuccess: (data) => {
			const { imageSecureUrl, publicId } = data;
			setPreviewImage(imageSecureUrl);
			setUploadedPublicId(publicId);
			setProfileChanged(true); // Mark profile as changed
		},
	});

	const { mutate: removeProfileMutation } = useMutation({
		mutationFn: removeUploadedProfile,
		onSuccess: () => {
			setPreviewImage(null);
			setUploadedPublicId("");
			setProfileChanged(false); // Reset profile change flag
		},
		onSettled: () => {
			navigate(`/profile/${userId}`);
		}
	});

	const {
		mutate: updateProfileMutation,
		isPending: isUpdating
	} = useMutation({
		mutationFn: updateUserData,
		onSuccess: () => {
			toast({
				description: "✅ Your Profile has been updated",
				variant: 'update'
			})
			dispatch(ProfileNavDispatcher(userId))
			refetch();
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

	useEffect(() => {
		if (data) {
			console.log("User Data:", data); // Check the structure of the response data
			const { userProfile = {}, userAdditionalInfo ={} } = data;

			setUsername(userProfile.username || "");
			setPreviewImage(userProfile.userProfilePicUrl || null);
			setBio(userAdditionalInfo.bio || "");
			setCompany(userAdditionalInfo.company || "");
			setContact(userAdditionalInfo.contactNumber || "");
			setJob(userAdditionalInfo.job || "");

			setSocialLinks({
				Github: userAdditionalInfo.githubLink || "",
				LinkedIn: userAdditionalInfo.linkedInLink || "",
				Facebook: userAdditionalInfo.facebookLink || "",
				X: userAdditionalInfo.xLink || "",
				PersonalWebsite: userAdditionalInfo.personalWebsiteLink || "",
				YouTube: userAdditionalInfo.youtubeLink || "",
				StackOverflow: userAdditionalInfo.stackOverflowLink || "",
				Reddit: userAdditionalInfo.redditLink || "",
				Threads: userAdditionalInfo.threadsLink || "",
			});

		}
	}, [data]);


	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
		};
	}, []);

	if (isPending) {
		return <p>Fetching data...</p>;
	}

	if (isError) {
		return <p>Error fetching data: {error}</p>;
	}

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const validTypes = ["image/png", "image/jpeg"];
		if (!validTypes.includes(file.type)) {
			setImageError(true);
			setPreviewImage(null);
			return;
		}

		const formData = new FormData();
		formData.append("Folder", "profiles");
		formData.append("Image", file);

		uploadProfileMutation(formData); // Call mutation to upload image
	};


	const handleSocialLinkChange = (platform, link) => {
		// Allow empty links to clear the input
		if (link.trim() === "") {
			setSocialLinks((prev) => ({ ...prev, [platform]: "" }));
			return;
		}

		// Validate the link if it is not empty
		if (platform !== "Threads" && !link.includes(platform.toLowerCase() + ".com")) {
			return;
		}

		setSocialLinks((prev) => ({ ...prev, [platform]: link }));
	};



	const handleUsernameChange = (event) => {
		const value = event.target.value;
		setUsername(value);

		if (value === data?.userProfile?.username) {
			setUsernameError(null);
			return;
		}

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			checkUsernameValidityHandler(value);
		}, 500);
	};




	const checkUsernameValidityHandler = useCallback(async (username) => {
		try {
			const response = await checkUsernameValidity(username);
			if (response === true) {
				setUsernameError(null); // Username is valid
			} else {
				setUsernameError("Username is already taken");
			}
		} catch (error) {
			setUsernameError("An error occurred while checking the username");
		}
	}, [checkUsernameValidity]);

	const handleCancel = () => {
		if (profileChanged) {
			removeProfileMutation( uploadedPublicId ); // Delete the image if profile was changed
		} else {
			navigate(`/profile/${userId}`);
		}
	};

	const handleSave = () => {
		// Collect user profile data
		const profileData = {
			userProfilePicUrl: previewImage || "", // Use previewImage or fallback to an empty string if not available
			username: username,
			userInfo: {
				bio: bio,
				company: company,
				contactNumber: contact,
				job: job,
				githubLink: socialLinks.Github,
				linkedInLink: socialLinks.LinkedIn,
				facebookLink: socialLinks.Facebook,
				xLink: socialLinks.X,
				personalWebsiteLink: socialLinks.PersonalWebsite,
				youtubeLink: socialLinks.YouTube,
				stackOverflowLink: socialLinks.StackOverflow,
				redditLink: socialLinks.Reddit,
				threadsLink: socialLinks.Threads,
			},
		};

		// Log the profile data in the desired shape
		console.log(JSON.stringify(profileData, null, 2));
		updateProfileMutation(profileData);
	};

	const socialMediaPlatforms = [
		"Github",
		"LinkedIn",
		"Facebook",
		"PersonalWebsite",
		"X",
		"YouTube",
		"StackOverflow",
		"Reddit",
		"Threads",
	];

	return (
		<div className="profile-account-details bg-surface-200 pb-20 px-8 py-8 space-y-8 rounded-3xl">
			<div className="profile-bio-frame space-y-2">
				<h3 className="font-bold text-xl">Profile Picture</h3>
				<p>
					Upload a picture to make your profile stand out and let people recognize your comments and contributions easily!
				</p>
				<div className="profile-picture">
					<div className="input-profile-picture flex flex-col w-fit">
						<label
							htmlFor="articleThumbnail"
							className="cursor-pointer w-fit"
							title="Click to change profile picture"
						>
							{previewImage ? (
								<div className="group bg-surface-500 px-4 py-2 w-fit flex items-center gap-5 rounded-2xl text-black-75 hover:text-black-300">
									<div className="relative">
										{/*<img*/}
										{/*	src={previewImage}*/}
										{/*	alt="Profile Preview"*/}
										{/*	className="w-24 h-24 rounded-3xl object-cover border border-gray-300 group-hover:ring-2 group-hover:ring-darkPurple-500 transition-all duration-300"*/}
										{/*/>*/}
										<Avatar
											imageUrl={previewImage}
											userName={originalUsername}
											userId={userId}
											variant='profileSetting'
										/>
									</div>
									<p className="flex gap-2 bg-surface-900 text-white p-3 rounded-2xl text-sm items-center">
										<CameraIcon size={24} />
										<p>Change photo</p>
									</p>
								</div>
							) : (
								<div
									className={`w-fit h-24 rounded-3xl bg-surface-500 flex gap-3 px-8 items-center justify-center ${
										imageError ? "border border-red-400" : "border border-gray-300"
									}`}
								>
									<CameraIcon />
									<span className="text-gray-500 text-sm">Add Profile Picture</span>
								</div>
							)}
						</label>
						<input
							id="articleThumbnail"
							type="file"
							accept=".png, .jpg"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>
					{imageError && (
						<p className="text-red-500 text-sm font-sm pl-2">
							Article Thumbnail is required
						</p>
					)}
				</div>
			</div>
			<div className="account-information space-y-3">
				<h3 className="font-bold text-xl">Account Information</h3>
				<div>
					<div className="flex items-center gap-2 border border-gray-300 bg-surface-500 rounded-3xl px-3 py-3 focus:ring-2 focus:ring-darkPurple-500 transition-all">
						<CiAt size={40} />
						<div className="flex flex-col w-full">
							<label htmlFor="username" className="text-xxs">Username</label>
							<input
								id="username"
								type="text"
								value={username}
								onChange={handleUsernameChange}
								className="focus:outline-none w-full bg-surface-500 font-medium"
								placeholder="Enter your username"
							/>
						</div>
					</div>
					{usernameError && (
						<p className="text-red-500 text-sm">{usernameError}</p>
					)}
				</div>
			</div>
			<div className="about space-y-5">
				<h3 className="font-bold text-xl">About</h3>
				<MultilineInput
					id="clubDescription"
					placeholder="Bio"
					value={bio} onChange={(e) => setBio(e.target.value)}
				/>
				<Input id="company" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
				<Input id="contact" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
				<Input id="job" placeholder="Job" value={job} onChange={(e) => setJob(e.target.value)} />
			</div>
			<div className="profile-social-links space-y-4">
				<h3 className="font-bold text-xl">Profile Social Links</h3>
				<p>Add your social media profiles, so people can get in touch with you!</p>
				{socialMediaPlatforms.map((platform) => (
					<SocialLinkInput
						key={platform}
						platform={platform}
						placeholder={platform}
						link={socialLinks[platform]}
						input={socialLinks[platform]}
						onChange={(link) => handleSocialLinkChange(platform, link)}
					/>
				))}
			</div>
			<div className="profile-actions flex items-center justify-end gap-2">
				<button
					className="bg-brightOrange-500 py-1.5 px-6 rounded-xl text-white font-bold hover:bg-darkPurple-500 flex gap-2 text-nowrap disabled:bg-lightPurple-200"
					onClick={handleSave}
					disabled={isPending}
				>
					{isUpdating?  (
						<>
							<VscLoading className="w-4 h-4 animate-spin" />
							Saving Profile...
						</>
					): `Save`}
				</button>
				<button
					onClick={ handleCancel }
					disabled={isPending}
					className="bg-surface-500  py-1.5 px-6 rounded-xl text-black border hover:bg-surface-700 hover:text-white"
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
