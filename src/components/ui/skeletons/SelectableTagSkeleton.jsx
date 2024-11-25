import {Skeleton} from "@/components/ui/skeletons/skeleton.jsx"; // Adjust the import path if necessary

export default function SelectableTagSkeleton() {
	return (
		<div className="flex flex-wrap gap-3 justify-center max-w-screen-lg">
			{Array.from({ length: 15 }).map((_, index) => (
				<Skeleton
					key={index}
					className="w-24 h-10 rounded-[16px] bg-gray-300 animate-pulse"
				/>
			))}
		</div>
	);
}
