export default function ArticleTag({ tagName, id }) {

	const computeColor = (id, tagName) => {
		const combinedString = `${id}-${tagName}`;
		let hash = 0;
		for (let i = 0; i < combinedString.length; i++) {
			hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
		}
		hash = Math.abs(hash);

		// Compute color using the hash value
		const r = (hash & 0xFF0000) >> 16;
		const g = (hash & 0x00FF00) >> 8;
		const b = hash & 0x0000FF;

		// Muting factor to decrease saturation and brightness
		const saturationFactor = 0.5;  // Adjust this value to reduce saturation (0 = gray, 1 = original saturation)
		const brightnessFactor = 1.2;  // Adjust this value to control brightness (0 = dark, 1 = original brightness)

		// Apply a basic desaturation formula (blend with gray)
		const mutedR = Math.round(r * saturationFactor + 128 * (1 - saturationFactor));
		const mutedG = Math.round(g * saturationFactor + 128 * (1 - saturationFactor));
		const mutedB = Math.round(b * saturationFactor + 128 * (1 - saturationFactor));

		// Apply brightness adjustment
		const finalR = Math.round(mutedR * brightnessFactor);
		const finalG = Math.round(mutedG * brightnessFactor);
		const finalB = Math.round(mutedB * brightnessFactor);

		// Ensure color values stay within RGB range
		const mutedColor = `#${Math.min(finalR, 255).toString(16).padStart(2, '0')}${Math.min(finalG, 255)
			.toString(16)
			.padStart(2, '0')}${Math.min(finalB, 255).toString(16).padStart(2, '0')}`;

		const lightnessFactor = 300;

		// Generate a slightly lighter background color
		const lighterColor = `#${Math.min(finalR + lightnessFactor, 255).toString(16).padStart(2, '0')}${Math.min(finalG + lightnessFactor, 255)
			.toString(16)
			.padStart(2, '0')}${Math.min(finalB + lightnessFactor, 255).toString(16).padStart(2, '0')}`;

		return { color: mutedColor, lighterColor };
	};


	const { color, lighterColor } = computeColor(id, tagName);

	return (
		<div
			className={ `px-2.5 py-1 rounded-full cursor-pointer  bg-blue-100 bg-opacity-20 border border-blue-200` }
		>
			<p
				className="text-xxxs text-nowrap line-clamp-1 hover:underline text-blue-800 text-opacity-70"
			>
				#{tagName}
			</p>
		</div>
	);
}
