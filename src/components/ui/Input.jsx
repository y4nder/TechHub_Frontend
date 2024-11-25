import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IconContext } from "react-icons";


export default function Input({ label, id, isPassword, hasError, ...props }) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	// Toggle password visibility
	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	let classes = "bg-surface-500 p-4 text-black-500 rounded-[15px] text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out";

	if(hasError) {
		classes += " border border-red-400"
	}

	let input;
	if (isPassword) {
		input = (
			<div className="relative">
				<input
					id={id}
					name={id}
					type={isPasswordVisible ? 'text' : 'password'}
					{...props}
					className={classes}
				/>
			<IconContext.Provider value={{ size: '1.5em'}}>
				<span
					onClick={togglePasswordVisibility}
					className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
				>

					{isPasswordVisible ? (
					 <AiOutlineEyeInvisible className="text-gray-500" />
					) : (
					 <AiOutlineEye className="text-gray-500" />
					)}
            </span>
			</IconContext.Provider>
			</div>
		);
	} else {
		input = (
			<input
				id={id}
				name={id}
				{...props}
				className={ classes }
			/>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={id} className={`font-sans font-bold text-sm ${!label ? 'sr-only' : ''}`}>
				{label}
			</label>
			{input}
		</div>
	);
}
