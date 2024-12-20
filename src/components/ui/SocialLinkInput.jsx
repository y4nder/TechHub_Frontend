import { FaFacebook, FaLinkedin, FaInstagram, FaGithub, FaYoutube, FaReddit } from "react-icons/fa";
import { SiThreads, SiStackoverflow } from "react-icons/si";
import {useEffect, useState} from "react";
import {FaXTwitter} from "react-icons/fa6";

export default function SocialLinkInput({ platform, onChange, placeholder, input }) {
	const [link, setLink] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (input) {
			setLink(input); // Set input value to link to sync the state
			validateLink(input);
		}
	}, [input]);

	const platformRegex = {
		Github: /^(https?:\/\/)?(www\.)?github\.com\/.+$/,
		Facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
		Twitter: /^(https?:\/\/)?(www\.)?twitter\.com\/.+$/,
		LinkedIn: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/,
		Instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
		YouTube: /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/,
		Reddit: /^(https?:\/\/)?(www\.)?reddit\.com\/.+$/,
		StackOverflow: /^(https?:\/\/)?(www\.)?stackoverflow\.com\/.+$/,
		Threads: /^(https?:\/\/)?(www\.)?threads\.net\/@.+$/,
		PersonalWebsite: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$/,
	};

	const validateLink = (url) => {
		// Allow empty links without triggering error
		if(url.trim() === "") {
			setError("");
			return true;
		}

		const regex = platformRegex[platform];
		if (regex && !regex.test(url)) {
			setError(`Please enter a valid ${platform} link.`);
			return false;
		}
		setError("");
		return true;
	};

	const handleChange = (event) => {
		const value = event.target.value;
		setLink(value);

		if (value.trim() === "") {
			// If the link is empty, reset the error and pass empty string to parent
			setError("");
			onChange("");
		} else if (validateLink(value)) {
			// If the link is valid, pass it to the parent
			onChange(value);
		}
	};

	const displayIcon = (platform) => {
		switch (platform) {
			case "Facebook":
				return <FaFacebook className="text-blue-600" />;
			case "Twitter":
			case "X":
				return <FaXTwitter className="text-black-300" />;
			case "LinkedIn":
				return <FaLinkedin className="text-blue-500" />;
			case "Instagram":
				return <FaInstagram className="text-pink-500" />;
			case "Github":
				return <FaGithub className="text-gray-700" />;
			case "YouTube":
				return <FaYoutube className="text-red-500" />;
			case "Reddit":
				return <FaReddit className="text-orange-500" />;
			case "StackOverflow":
				return <SiStackoverflow className="text-yellow-500" />;
			case "Threads":
				return <SiThreads className="text-blue-700" />;
			case "PersonalWebsite":
				return <span className="text-gray-600 text-xl">🌐</span>; // Globe icon for websites
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className={`
				flex items-center gap-3
				rounded-2xl px-3 py-4 bg-surface-500 w-full focus:outline-none transition-all ${
				error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
			}
			`}>
				<div className="text-2xl">{displayIcon(platform)}</div>
				<input
					type="text"
					value={link}
					onChange={handleChange}
					className="focus:outline-none bg-surface-500 w-full"
					placeholder={placeholder || `Enter your ${platform} link`}
				/>
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}
