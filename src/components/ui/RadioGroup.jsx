import { Children, cloneElement } from "react";

export function RadioGroup({ name, selectedValue, onChange, children, layout, radioColor = "text-blue-500" }) {
	return (
		<div className={`${layout}`}>
			{Children.map(children, (child) =>
				cloneElement(child, { name, selectedValue, onChange, radioColor })
			)}
		</div>
	);
}

export function RadioItem({ value, name, selectedValue, onChange, radioColor, children }) {
	const isSelected = selectedValue === value;

	return (
		<label className="group flex items-center gap-4 cursor-pointer transition-all">
			<input
				type="radio"
				name={name}
				value={value}
				checked={isSelected}
				onChange={() => onChange(value)} // Trigger onChange to update state
				className="hidden"
			/>
			<span
				className={`w-5 h-5 flex justify-center items-center rounded-full border-2 self-start transition-all ${
					isSelected
						? `${radioColor} border-current`
						: "border-gray-400 group-hover:border-gray-600"
				}`}
			>
				{isSelected && (
					<span className={`w-3 h-3 rounded-full ${radioColor} bg-current`}></span>
				)}
			</span>
			<div
				className="flex-1 transition-all group-hover:text-gray-800"
			>
				{children}
			</div>
		</label>
	);
}