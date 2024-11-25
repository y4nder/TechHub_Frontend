export default function Divider({ text }) {
	return (
		<div className="flex items-center">
			<div className="flex-grow border-t border-gray-300"></div>
			{text && (
				<span className="mx-3 text-gray-500 text-sm font-light">{text}</span>
			)}
			<div className="flex-grow border-t border-gray-300"></div>
		</div>
	);
}
