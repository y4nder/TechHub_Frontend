export default function Button({ children, className, icon, iconPosition = "left", ...props }) {
	return (
		<button
			className={`flex items-center justify-center ${icon ? "gap-2" : ""} ${className}`}
			{...props}
		>
			{icon && iconPosition === "left" && <span className="icon-left">{icon}</span>}
			<span>{children}</span>
			{icon && iconPosition === "right" && <span className="icon-right">{icon}</span>}
		</button>
	);
}
