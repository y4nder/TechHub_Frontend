import { ChevronFirst, ChevronLast } from "lucide-react";
import {useSidebar} from "@/hooks/useSidebar.jsx";


export default function Sidebar({ children }) {
	const { expanded, setExpanded } = useSidebar();

	const toggleSidebar = () => {
		setExpanded((prev) => !prev);
	};

	return (
		<aside
			className={`
				flex flex-col pb-10 h-screen transition-all duration-300 
					${
						expanded ? "w-64" : "w-16"
					} 
				bg-surface-100 border-r border-black-50
				
			`}
		>

			<div className="p-2 pb-2 flex justify-between items-center">
				<div>{/*might add image here*/}</div>
				<button
					className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
					onClick={toggleSidebar}
				>
					{expanded ? <ChevronFirst /> : <ChevronLast />}
				</button>
			</div>


				<ul className={
					`flex-1 overflow-y-auto overflow-x-clip space-y-3 transition-all 
					${expanded ?
						'px-4' : ''
					}
				`}>
					{children}
				</ul>


		</aside>
	);
}

export function SidebarItemGroup({ headerText, children }) {
	const { expanded } = useSidebar();

	return (
		<div
			className={ `
				flex flex-col
				 
				${
					expanded ? "p-4 border border-black-50 bg-white " : "py-4"
				} 
				transition-all duration-200
			
				rounded-[20px] 
				
			`}
		>
			<h1
				className={`
					text-sm font-semibold transition-all duration-300
					text-black-300
					px-3
					${
						expanded ? "opacity-100 mb-2" : "opacity-0 mb-2"
					}
				`}
				style={{ visibility: expanded ? "visible" : "hidden" }}
			>
				{headerText}
			</h1>

			<ul className="">{children}</ul>
		</div>
	);
}


export function SidebarItem({
	                            icon,
	                            text,
	                            textColor,
	                            iconColor,
	                            active,
	                            alert,
	                            imageUrl,
										 sidebarAction,
                            }) {
	const { expanded } = useSidebar();

	return (
		<li
			className={`relative flex items-center my-1 w-auto font-medium cursor-pointer transition-all duration-300
                ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}
                ${expanded ? "px-2 py-1 rounded-md" : "px-1 py-1 justify-center"}
            `}
			onClick={sidebarAction}

		>
			{/* Icon or Image */}
			<div className={`flex-shrink-0 px-1 transition-all ${iconColor ? `text-${iconColor}` : ""}`}>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt="Sidebar Item Icon"
						className="w-6 h-6 rounded-full object-cover"
					/>
				) : (
					icon
				)}
			</div>

			{/* Text */}
			<span
				className={`overflow-hidden transition-opacity duration-300
                    text-sm ${expanded ? "ml-3 opacity-100" : "opacity-0 w-0"}
                    ${textColor ? textColor : ""} whitespace-nowrap`}
			>
                {text}
            </span>

			{/* Alert Badge */}
			{alert && (
				<div
					className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
						expanded ? "" : "top-2"
					}`}
				/>
			)}
		</li>
	);
}


