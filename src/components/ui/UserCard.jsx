import {
	FaFacebook,
	FaGithub,
	FaGlobe,
	FaLinkedin,
	FaReddit,
	FaStackOverflow,
	FaTwitter,
	FaYoutube
} from "react-icons/fa";
import {SiDgraph, SiThreads} from "react-icons/si";
import SocialPill from "@/components/ui/SocialPill.jsx";
import {formatNumberToK as formatter} from "@/utils/formatters/numberFomatter.js";

const linkMappings = {
	githubLink: { name: "GitHub", icon: <FaGithub /> },
	linkedInLink: { name: "LinkedIn", icon: <FaLinkedin /> },
	facebookLink: { name: "Facebook", icon: <FaFacebook /> },
	xLink: { name: "Twitter", icon: <FaTwitter /> },
	personalWebsiteLink: { name: "Website", icon: <FaGlobe /> },
	youtubeLink: { name: "YouTube", icon: <FaYoutube /> },
	stackOverflowLink: { name: "Stack Overflow", icon: <FaStackOverflow /> },
	redditLink: { name: "Reddit", icon: <FaReddit /> },
	threadsLink: { name: "Threads", icon: <SiThreads /> }, // Placeholder for Threads
};

export default function UserCard({ userDetails, role }) {
	return (
		<div className="max-w-sm rounded-[40px] h-fit overflow-hidden bg-gradient-to-t from-lightPurple-10 to-lightPurple-100 border-[8px] border-lightPurple-100 shadow-lg ">
			<div className="top p-4 flex flex-col gap-2 py-5 relative">
				{/* Banner */}
				<div className="bg-darkPurple-500 w-full h-24 rounded-t-2xl absolute top-0 left-0 overflow-hidden">
					<img
						src={ userDetails.userProfilePicUrl }
						alt=""
						className="object-cover scale-110 blur-sm"
					/>
				</div>

				{/* Profile Picture */ }
				<div className="relative flex justify-start">
					<img
						src={ userDetails.userProfilePicUrl }
						alt=""
						className="w-24 h-24 rounded-full object-cover mt-6 shadow-2xl border-2 border-white relative z-10"
					/>
				</div>

				{/* User Info */}
				<div className="space-y-2 relative z-10 p-1">
					<div className="flex gap-3 items-center">
						<p className="font-bold text-2xl">{ userDetails.username }</p>
						<div className="flex gap-1 items-center">
							<SiDgraph
								size={ 15 }
								color="purple"
							/>
							<p className="text-lg gradient-text font-bold">{ formatter(userDetails.reputationPoints) }</p>
						</div>
					</div>
					{ role && (
						<p className="bg-gradient-to-br drop-shadow-2xl from-lightPurple-200 to-lightPurple-500 w-fit text-white px-3 py-1 rounded-xl">
							{ role }
						</p>
					) }
					<p className="line-clamp-3 text-gray-700">{ userDetails.userAdditionalInfo.bio }</p>

				</div>
			</div>

			{/* Links Section */ }
			<div className="bottom pb-5 px-4 pt-4 bg-surface-50 h-full rounded-t-3xl  overflow-y-auto">
				<div className="flex flex-wrap gap-2">
					{ Object.entries(userDetails.userAdditionalInfo)
						.filter(([key, value]) => value !== null && value !== "" && linkMappings[key])
						.map(([key, value]) => {
							const { name, icon } = linkMappings[key];
							return (
								<SocialPill key={key} link={value} icon={icon} name={name} />
							);
						})}
				</div>
			</div>
		</div>
	);
}
