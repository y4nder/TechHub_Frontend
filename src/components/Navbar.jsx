import SearchBar from "@/components/ui/Searchbar.jsx";
import Button from "@/components/ui/Button.jsx";
import { IoNotifications } from "react-icons/io5";
import { SiDgraph } from "react-icons/si";
import {formatNumberToK} from "@/utils/formatters/reputationformatter.js";

export default function Navbar({user}) {
	const handleSearch = (query) => {
		console.log(query);
	};

	const handleCreatePost = () => {
		// Handle create post logic
	};

	return (
		<nav
			className={`
				flex items-center justify-between
				px-4 py-1
				bg-surface-100
				border border-black-50
			`}
		>
			{/* Logo */}
			<div className="flex-grow">
				<img
					src="https://placehold.co/40"
					alt="Hero Image"
					className="object-cover rounded-xl"
				/>
			</div>

			{/* Search Bar */}
			<div className="flex-grow items-center px-4 py-2">
				<SearchBar
					id="search"
					placeholder="Search"
					onSubmitSearch={handleSearch}
				/>
			</div>

			{/* Buttons and Icons */}
			<div className="flex flex-grow gap-2 justify-end">
				<Button
					className={`
						bg-brightOrange-500 
						text-surface-50 
						font-sans font-light 
						py-1.5 px-7 
						rounded-[15px] 
						hover:bg-darkPurple-500 duration-200
					`}
					onClick={handleCreatePost}
					disabled={false}
				>
					<p className="text-nowrap">New Post</p>
				</Button>

				{/* Notification Icon */}
				<div
					className={`
						bg-lightPurple-50
						text-lightPurple-500
						px-2 
						rounded-[15px]
						flex items-center justify-center
					`}
				>
					<IoNotifications size={30} />
				</div>

				{/* Stats and Profile */}
				<div
					className={`
						flex gap-2 items-center justify-center
						bg-darkOrange-50
						py-0.5 px-2.5
						rounded-[15px]
					`}
				>
					<SiDgraph size={15} color="purple" />
					<p className="text-lg gradient-text font-bold">
						{formatNumberToK(user.reputationPoints)}
					</p>
					<img
						src={ user.userProfilePicUrl }
						alt={user.userProfilePicUrl}
						className="w-8 h-8 object-cover rounded-xl"
					/>
				</div>
			</div>
		</nav>
	);
}
