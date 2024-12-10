import { useState } from 'react';

const Avatar = ({ imageUrl, userName, userId, variant = "default", clickable = true}) => {
	const [isImageValid, setIsImageValid] = useState(true);

	// Compute initials from userName
	const getInitials = (name) => {
		// console.log(name);
		if(!name) return null;
		return name.charAt(0).toUpperCase();
	};

	// Compute a color based on userId and userName
	const computeGradient = (id, name) => {
		const combinedString = `${id}-${name}`;
		let hash = 0;
		for (let i = 0; i < combinedString.length; i++) {
			hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
		}
		hash = Math.abs(hash);

		// Compute first color
		const r1 = (hash & 0xFF0000) >> 16;
		const g1 = (hash & 0x00FF00) >> 8;
		const b1 = hash & 0x0000FF;

		const color1 = `#${r1.toString(16).padStart(2, '0')}${g1
			.toString(16)
			.padStart(2, '0')}${b1.toString(16).padStart(2, '0')}`;

		// Compute second color (slightly offset hash)
		const hash2 = (hash >> 3) & 0xFFFFFF; // Shift hash for second color
		const r2 = (hash2 & 0xFF0000) >> 16;
		const g2 = (hash2 & 0x00FF00) >> 8;
		const b2 = hash2 & 0x0000FF;

		const color2 = `#${r2.toString(16).padStart(2, '0')}${g2
			.toString(16)
			.padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`;

		// Generate gradient string
		const gradient = `linear-gradient(135deg, ${color1}, ${color2})`;

		// console.log("Computed Gradient: ", gradient);
		return gradient;
	};

	// Fallback for invalid image
	const handleImageError = () => {
		setIsImageValid(false);
	};

	const initials = getInitials(userName);
	// const backgroundColor = computeColor(userId || 'default', userName || 'default');


	const getSizing = () => {
		if(variant === "default"){
			return {
				imageSize : 8,
				fontSize : 'text-lg'
			}
		}

		if(variant === "navProfile"){
			return {
				imageSize : 8,
				fontSize : 'text-lg',
				roundness: 'rounded-xl'
			}
		}

		if(variant === "commentProfile"){
			return {
				imageSize : 10,
				fontSize : 'text-lg',
			}
		}

		if(variant === "largeSemiRounded"){
			return {
				imageSize : 12,
				fontSize : 'text-2xl',
				roundness: 'rounded-xl'
			}
		}

		if(variant === "userProfileCard"){
			return {
				imageSize : 44,
				fontSize : 'text-8xl',
				roundness: 'rounded-2xl',
				additionalStyles: 'border border-lightPurple-200'
			}
		}

		if(variant === "profileSetting"){
			return {
				imageSize : 24,
				fontSize : 'text-5xl',
				roundness: 'rounded-3xl'
			}
		}

		return {
				imageSize : 8,
				fontSize : 'text-lg'
			}
	}

	const sizing = getSizing();

	// console.log(initials);
	return (
		<div
			className={`
				w-${sizing.imageSize} h-${sizing.imageSize} 
				${sizing.roundness? sizing.roundness : 'rounded-full ' }
				flex items-center justify-center overflow-hidden flex-shrink-0 ${
				isImageValid ? '' : 'text-white font-medium ' + `${sizing.fontSize} shadow-sm
				 ${sizing.additionalStyles? sizing.additionalStyles: ''}`
			}`}
			style={{ background: isImageValid ? 'transparent' : computeGradient(userId, userName) }}
		>
			{isImageValid ? (
				<img
					src={imageUrl}
					alt={userName}
					onError={handleImageError}
					className={ `
						${clickable ? 'cursor-pointer' : ' '}
						 w-full h-full object-cover 
					` }
				/>
			) : (
				initials
			)}
		</div>
	);
};

export default Avatar;
