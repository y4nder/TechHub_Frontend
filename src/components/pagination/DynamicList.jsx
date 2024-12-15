import { useRef, useCallback } from "react";

const DynamicList = ({
	                     items,
	                     hasNextPage,
	                     fetchNextPage,
	                     isFetchingNextPage,
	                     renderItem, // Function to render each item
	                     containerStyle = "", // Style for the container
                     }) => {
	const observer = useRef();

	// IntersectionObserver to detect when scrolling reaches the bottom
	const lastItemRef = useCallback(
		(node) => {
			if (isFetchingNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isFetchingNextPage, hasNextPage, fetchNextPage]
	);

	return (
		<div className={`flex flex-wrap ${containerStyle}`}>
			{items.map((item, index) => {
				const isLastItem = items.length === index + 1;
				return renderItem(item, isLastItem ? lastItemRef : null);
			})}
			{isFetchingNextPage && <p>Loading more...</p>}
		</div>
	);
};

export default DynamicList;
