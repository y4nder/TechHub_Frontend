import {forwardRef, useState} from "react";
import {formatDateTimeVersion2} from "@/utils/formatters/dateFormatter.js";
import {EllipsisVerticalIcon} from "lucide-react";
import {Dropdown} from "@/components/ui/Dropdown.jsx";
import {NavLink} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {pinArticle, publishArticle, removeArticle} from "@/utils/http/moderators.js";

const ArticleListItem= forwardRef(({ article, ...props }, ref) => {
	const [status, setStatus] = useState(article.status);
	const [pinned, setPinned] = useState(article.pinned);

	const {mutate: removePostMutation} = useMutation({
		mutationFn: removeArticle,
		onSuccess: () => {
			setStatus("Removed");
		}
	})

	const {mutate: publishPostMutatation} = useMutation({
		mutationFn: publishArticle,
		onSuccess: () => {
			setStatus("Published");
		}
	})

	const { mutate: pinArticleMutation } = useMutation({
		mutationFn: ({ articleId, pinned }) => pinArticle(articleId, pinned),
		onSuccess: (data) => {
			setPinned(data.pinned); // Handle response as needed
		},
	});
	const handleRemoveArticle = () => {
		removePostMutation(article.articleId);
	}

	const handlePublishArticle = () => {
		publishPostMutatation(article.articleId);
	}

	const handlePinArticle = (pinType) => {
		pinArticleMutation({ articleId: article.articleId, pinned: pinType });
	};

	return (
		<div ref={ ref } { ...props }
		     className="grid grid-cols-8 bg-surface-400 rounded-2xl p-2 gap-4 items-center justify-center"
		>
			<div className="flex gap-4 items-center">
				<img
					src={ article.articleThumbnailUrl }
					alt=""
					className="w-20 h-20 object-cover rounded-2xl"
				/>
				{ article.articleTitle }
			</div>
			<div>
				<p className="font-medium">
					{ formatDateTimeVersion2(article.createdDateTime) }
				</p>
			</div>
			<div>
				{ article.authorName }
			</div>
			<div>
				{ article.voteCount }
			</div>
			<div>
				{ article.commentCount }
			</div>
			<div>
				{ status }
			</div>
			<div>
				{ pinned ? "pinned" : "not pinned" }
			</div>
			<div className="flex gap-2 items-center">
				<NavLink
					to={ `/articles/${ article.articleId }` }
					className="border py-2 px-8 rounded-2xl hover:bg-surface-700"
				>
					View
				</NavLink>
				<Dropdown
					trigger={
						<button className="rounded-2xl py-1">
							<EllipsisVerticalIcon size={ 18 }/>
						</button> }
				>
					<ul className="p-2 text-gray-600 space-y-2 select-none pt-4">
						<li className="hover:bg-gray-100 flex items-center gap-2"
							onClick={() => {
								let pinType = !pinned
								handlePinArticle(pinType)
							}}
						>
							<p>{pinned ? 'Unpin post'  : 'Pin post'}</p>
						</li>
						{ status === "Published" ? (
								<li className="hover:bg-gray-100 flex items-center gap-2"
								    onClick={ () => {
									    handleRemoveArticle();
								    } }>
									<p>Remove Post</p>
								</li>
							) :
							<li className="hover:bg-gray-100 flex items-center gap-2"
							    onClick={ () => {
								    handlePublishArticle();
							    } }>
								<p>Publish Post</p>
							</li>
						}
					</ul>
				</Dropdown>
			</div>
		</div>
	);
});

export default ArticleListItem;
