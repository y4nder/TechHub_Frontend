import {CameraIcon} from "lucide-react";
import {useState} from "react";
import {CiAt} from "react-icons/ci";
import MultilineInput from "@/components/ui/MultilineInput.jsx";
import Input from "@/components/ui/Input.jsx";
import SocialLinkInput from "@/components/ui/SocialLinkInput.jsx";

export default function ProfileAccountDetailsPage() {
	const [previewImage, setPreviewImage] = useState(null);
	const [imageError, setImageError] = useState(false);
	const [username, setUsername] = useState("");
	const [socialLinks, setSocialLinks] = useState({
		Facebook: "",
		Twitter: "",
		LinkedIn: "",
		Github: "",
		YouTube: "",
		Reddit: "",
		StackOverflow: "",
		Threads: "",
		PersonalWebsite: "",
	});

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const validTypes = ["image/png", "image/jpeg"];
		if (!validTypes.includes(file.type)) {
			setImageError(true);
			setPreviewImage(null);
			return;
		}

		const reader = new FileReader();
		reader.onload = () => setPreviewImage(reader.result);
		reader.readAsDataURL(file);
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	}

	const handleSocialLinkChange = (platform, link) => {
		if(!link.includes(platform.toLowerCase()+".com") ) return;
		setSocialLinks((prev) => ({ ...prev, [platform]: link }));
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


	return(
		<div className="profile-account-details bg-surface-200 pb-20 px-8 py-8 space-y-8">
			<div className="profile-bio-frame space-y-2">
				<h3 className="font-bold text-xl">Profile Picture</h3>
				<p>Upload a picture to make your profile stand out and let people recognize your comments and contributions
					easily!</p>
				<div className="article-form-thumbnail">
					<div className="input-profile-picture flex flex-col w-fit">
						<label
							htmlFor="articleThumbnail"
							className="cursor-pointer w-fit"
							title="Click to change profile picture"
						>
							{ previewImage ? (
								<div
									className="group bg-surface-500 px-4 py-2 w-fit flex items-center gap-5 rounded-2xl text-black-75 hover:text-black-300">
									<div className="relative">
										<img
											src={ previewImage }
											alt="Profile Preview"
											className="w-24 h-24 rounded-3xl object-cover border border-gray-300 group-hover:ring-2 group-hover:ring-darkPurple-500 transition-all duration-300"
										/>
									</div>
									<p className="flex gap-2 bg-surface-900 text-white p-3 rounded-2xl text-sm items-center">
										<CameraIcon size={24}/>
										<p>Change photo</p>
									</p>
								</div>
							) : (
								<div
									className={ `w-fit h-24 rounded-3xl bg-surface-500 flex gap-3 px-8 items-center justify-center ${
										imageError ? "border border-red-400" : "border border-gray-300"
									}` }
								>
									<CameraIcon/>
									<span className="text-gray-500 text-sm">Add Profile Picture</span>
								</div>
							) }
						</label>
						<input
							id="articleThumbnail"
							type="file"
							accept=".png, .jpg"
							onChange={ handleImageChange }
							className="hidden"
						/>
					</div>
					{ imageError && (
						<p className="text-red-500 text-sm font-sm pl-2">
							Article Thumbnail is required
						</p>
					) }
				</div>
			</div>
			<div className="account-information space-y-3">
				<h3 className="font-bold text-xl">Account Information</h3>
				<div className="flex items-center gap-2 border border-gray-300 bg-surface-500 rounded-3xl px-3 py-3 focus:ring-2 focus:ring-darkPurple-500 transition-all">
					<CiAt size={ 40 }/>
					<div className="flex flex-col w-full">
						<label htmlFor="username" className="text-xxs">Username</label>
						<input
							id="username"
							type="text"
							value={ username }
							onChange={ handleUsernameChange }
							className="focus:outline-none w-full bg-surface-500 font-medium"
							placeholder="Enter your username"
						/>
					</div>
				</div>
			</div>
			<div className="about space-y-5">
				<h3 className="font-bold text-xl">About</h3>
				<MultilineInput
					id="clubDescription"
					placeholder="Bio"
					// hasError={clubDescError.hasError}
				/>
				<Input id="company" placeholder="Company" />
				<Input id="contact" placeholder="Contact" />
				<Input id="job" placeholder="Job" />
			</div>
			<div className="profile-social-links space-y-4">
				<h3 className="font-bold text-xl">Profile Social Links</h3>
				<p>Add your social media profiles so others can connect with you and you can grow your network!</p>
				{ socialMediaPlatforms.map((platform) => (
					<SocialLinkInput
						key={ platform }
						label={ platform }
						placeholder={ `${ platform } ` }
						onChange={ (link) => handleSocialLinkChange(platform, link) }
					/>
				)) }
			</div>
			<div className="profile-actions flex items-center justify-end gap-2">
				<button
					className="bg-brightOrange-500 py-1.5 px-6 rounded-xl text-white font-bold hover:bg-darkPurple-500 flex gap-2 text-nowrap disabled:bg-lightPurple-200"
				>
					Save
				</button>
				<button
					className="bg-surface-500  py-1.5 px-6 rounded-xl text-black border hover:bg-surface-700 hover:text-white"
				>
					Cancel
				</button>
			</div>
		</div>
	)
}