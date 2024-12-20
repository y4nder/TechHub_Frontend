


export default function AuthCardHero({image}) {
	return <div className="flex-1 w-full flex items-center justify-center">
		<div className="w-full h-full overflow-hidden rounded-[20px]">
			<img
				src={ image }
				alt="Hero Image"
				className="object-cover w-full h-full"
			/>
		</div>
	</div>
}