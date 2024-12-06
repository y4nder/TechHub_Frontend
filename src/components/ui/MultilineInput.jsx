export default function MultilineInput({ label, id, hasError, rows = 8, ...props }) {
	let classes =
		"bg-surface-500 p-4 text-black-500 rounded-[15px] text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out";

	if (hasError) {
		classes += " border border-red-400";
	}

	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={id} className={`font-sans font-bold text-sm ${!label ? "sr-only" : ""}`}>
				{label}
			</label>
			<textarea
				id={id}
				name={id}
				rows={rows}
				className={classes}
				{...props}
			></textarea>
		</div>
	);
}
