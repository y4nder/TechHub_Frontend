export default function Divider({ text, variant = "center", textClassName }) {
	return (
		<div className="flex items-center">
			{(variant === "center" || variant === "right") && (
				<div className="flex-grow border-t border-gray-300 px-4"></div>  // Add padding here
			)}
			{(variant === "center" || variant === "left") && (
				<div className="flex-grow-0 border-t border-gray-300 px-2"></div>  // Add padding here
			)}
			{text && (
				<span
					className={`mx-3 ${textClassName ? textClassName : 'text-gray-500 text-sm font-light'}`}
				>
					{text}
				</span>
			)}
			{(variant === "center" || variant === "left") && (
				<div className="flex-grow border-t border-gray-300 px-4"></div>  // Add padding here
			)}
		</div>
	);
}
