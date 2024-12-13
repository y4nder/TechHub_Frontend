import { useParams } from "react-router-dom";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {followTag, getTagPage, unFollowTag} from "@/utils/http/tags.js";
import { FaTag } from "react-icons/fa";
import {getTagArticles} from "@/utils/http/articles.js";
import ArticleList from "@/components/ArticleList.jsx";
import Modal from "@/components/ui/Modal.jsx";
import {useState} from "react";
import {useToast} from "@/hooks/use-toast.js";

export default function TagPage() {
	const { tagId } = useParams();
	const [unfollowTagModalOpen, setUnfollowTagModalOpen] = useState(false);
	const {toast} = useToast();

	// Query to fetch the tag page data
	const {
		data: tagPageData,
		isLoading: isLoadingPage,
		isError: isErrorTagPage,
		error: errorTagPageError,
		refetch: refetchTagData,
	} = useQuery({
		queryKey: ["tags", "tag", tagId],
		queryFn: () => getTagPage(tagId),
	});

	const {
		data: tagArticles,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isLoadingArticles,
		isFetching
	} = useInfiniteQuery({
		queryKey: ["articles", "tag", tagId],
		queryFn: ({pageParam = 1}) =>
			getTagArticles(tagId, pageParam, 10),
		getNextPageParam : (lastPage) => {
			const { pageNumber , totalPages} = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		}
	});

	const {mutate: followTagMutation } =useMutation({
		mutationFn: followTag,
		onSuccess: () => {
			toast({
				      description: "Tag Followed 🏷️",
			      })
		},
		onSettled : () => {
			refetchTagData();
		}
	})

	const {mutate: unFollowTagMutation } =useMutation({
		mutationFn: unFollowTag,
		onSettled : () => {
			refetchTagData();
		}
	})

	const articles =
		tagArticles?.pages.flatMap((page) => page.articles.items) || [];

	const tag = tagPageData?.tag || null;

	const handleCancelUnfollowTag = () => {
		setUnfollowTagModalOpen(false);
	}

	const handleStartUnfollowing = () => {
		setUnfollowTagModalOpen(true);
	}

	const handleUnfollow = () => {
		unFollowTagMutation(+tagId);
		setUnfollowTagModalOpen(false);
	}

	const handleTagButtonAction = () => {
		// event.stopPropagation();
		console.log(tag.followed ? "Leave Club" : "Join Club");

		if(tag.followed){
			handleStartUnfollowing();
		} else {
			followTagMutation(+tagId);
		}
	}

	const LeaveConfirmationModal = () => {
		return(
			<Modal
				open={unfollowTagModalOpen}
				onClose={handleCancelUnfollowTag}
				className="p-6 rounded-2xl space-y-4"
			>
				<div>
					<h1 className="text-lg text-brightOrange-500">Unfollow Tag</h1>
					<p className="text-sm text-gray-500">Are you sure you want to Unfollow this tag</p>
				</div>
				<div className="leave-modal-actions flex gap-4 justify-end">
					<button className="py-1 px-3 bg-surface-500 rounded-xl text-sm hover:bg-surface-700 hover:text-white" onClick={handleCancelUnfollowTag}>Cancel</button>
					<button className="py-1 px-3 bg-red-50 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white" onClick={handleUnfollow}>Unfollow</button>
				</div>
			</Modal>
		)
	}

	return (
		<div>
			{LeaveConfirmationModal()}
			<div className="p-4 space-y-3">
				<div className="tag-page-header border p-4 border-black-50 rounded-xl">
					{/* Loading state */}
					{isLoadingPage && <p>Loading Tag Page...</p>}

					{/* Error state */}
					{isErrorTagPage && (
						<p className="text-red-500">
							Error loading tag page: {errorTagPageError?.message || "Unknown error"}
						</p>
					)}

					{/* Content when data is successfully loaded */}
					{!isLoadingPage && !isErrorTagPage && tag && (
						<>
							<div className="tag-name flex items-center gap-4 mb-4">
								<FaTag size={36}  />
								<h1 className="font-medium text-4xl">{tag.tagName}</h1>
							</div>
							<div className="tag-description mb-3">
								<button
									className={`px-8 py-1 rounded-full  ${
										tag.followed ? "bg-darkPurple-500  text-white" : "border border-lightPurple-500 text-lightPurple-500 hover:bg-darkPurple-500 hover:text-white"
									} transition-all duration-200`}
									onClick={handleTagButtonAction}
								>
									{tag.followed ? "Followed" : "Follow Tag"}
								</button>
							</div>
							<div className="tag-description">
								<p>{tag.tagDescription}</p>
							</div>
						</>
					)}
				</div>

				{/* Article list with loading state */}
				<div className="tag-page-articles">
					<div className="justify-center">
						{isLoadingArticles || isFetching ? (
							<div className="flex items-center justify-center">
								<p className="text-center text-gray-500">Loading articles...</p>
							</div>
						) : articles.length === 0 ? (
							<div className="flex flex-grow items-center justify-center">
								<p className="text-center text-gray-500">No articles found for this tag.</p>
							</div>
						) : (
							<ArticleList
								articles={articles}
								hasNextPage={hasNextPage}
								fetchNextPage={fetchNextPage}
								isFetchingNextPage={isFetchingNextPage}
							/>
						)}

						{/* Loading indicator for fetching next page */}
						{isFetchingNextPage && (
							<div className="flex items-center justify-center mt-4">
								<p className="text-center text-gray-500">Loading more articles...</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
