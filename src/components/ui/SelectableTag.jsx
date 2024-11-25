export default function SelectableTag({ tag, isSelected, onToggle }) {
	const { tagName } = tag;

	return (
		<div
			onClick={onToggle}
			className={`cursor-pointer px-6 py-2 rounded-[16px] font-bold transition-all duration-300 transform ${
				isSelected
					? "bg-lightPurple-500 text-white -translate-y-1 shadow-md"
					: "bg-black-500 text-white hover:bg-gray-700"
			}`}
		>
			{tagName}
		</div>
	);
}
