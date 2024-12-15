import {forwardRef, useEffect, useState} from 'react';
import ArticleTag from "@/components/ui/ArticleTag.jsx";
import { BiCommentDetail, BiDownvote, BiUpvote } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import {MdBookmarkBorder, MdOutlineBugReport, MdOutlineClose} from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import Button from "@/components/ui/Button.jsx";
import { parseDate } from "@/utils/formatters/dateFormatter.js";
import {useNavigate} from "react-router-dom";
import {
	bookmarkArticle,
	downVoteArticle,
	removeArticleVote, reportArticle,
	unBookmarkArticle,
	upVoteArticle
} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import Avatar from "@/components/ui/Avatar.jsx";
import ToolTippedComponent from "@/components/ui/TooltippedComponent.jsx";
import {Dropdown} from "@/components/ui/Dropdown.jsx";
import {EllipsisVerticalIcon} from "lucide-react";
import Modal from "@/components/ui/Modal.jsx";
import {RadioGroup, RadioItem} from "@/components/ui/RadioGroup.jsx";
import MultilineInput from "@/components/ui/MultilineInput.jsx";
import {useMutation} from "@tanstack/react-query";
import {ToastAction} from "@/components/ui/toast.jsx";
import {useToast} from "@/hooks/use-toast.js";

const upvote = "up";
const downVote = "down";

const ArticleCard = forwardRef(({ article }, ref) => {
	const visibleTags = article.tags.slice(0, 2);
	const overflowCount = article.tags.length - visibleTags.length;
	const [isHovered, setIsHovered] = useState(false);
	const [voteCount, setVoteCount] = useState(article.voteCount);
	const [voteType, setVoteType] = useState(null);
	const [bookmarked , setBookmarked] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if(article.voteType === 0){
			setVoteType(null);
		} else if(article.voteType === 1){
			setVoteType(upvote);
		}else {
			setVoteType(downVote)
		}
		setBookmarked(article.bookmarked);
	}, [article.voteType]);


	const toggleUpvote = async () => {
		if (voteType === upvote) {
			// Remove upvote
			setVoteCount((prev) => prev - 1);
			setVoteType(null);
			console.log("Upvote removed");
			await removeArticleVote(getUserIdFromToken(), article.articleId);
		} else {
			// Add or switch to upvote
			setVoteCount((prev) => (voteType === downVote ? prev + 2 : prev + 1));
			setVoteType(upvote);
			console.log("Upvoted");
			await upVoteArticle(getUserIdFromToken(), article.articleId);
		}
	};

	const handleDownVote = async () => {
		if (voteType === downVote) {
			// Remove downvote
			setVoteCount((prev) => prev + 1);
			setVoteType(null);
			console.log("Downvote removed");
			await removeArticleVote(getUserIdFromToken(), article.articleId);
		} else {
			// Add or switch to downvote
			setVoteCount((prev) => (voteType === upvote ? prev - 2 : prev - 1));
			setVoteType(downVote);
			console.log("Downvoted");
			await downVoteArticle(getUserIdFromToken(), article.articleId);
		}
	};

	const handleArticleClicked = () => {
		navigate(`/articles/${article.articleId}`);
	}

	const toggleBookmark = async() => {
		if(bookmarked){
			console.log("removing bookmark");
			await unBookmarkArticle(getUserIdFromToken(), article.articleId);
		} else {
			console.log("adding bookmark")
			await bookmarkArticle(getUserIdFromToken(), article.articleId);
		}

		setBookmarked(prevState => !prevState);
	}

	const handleLinkClicked = (event,  url) => {
		event.stopPropagation();
		navigate(url);
	}

	const handleMoreOptionsClicked = (event) => {
		event.stopPropagation();
	}


	return (
		<div
			ref={ref}  // Attach the forwarded ref here
			className={`
               flex flex-col 
					justify-between 
					border 
					${isHovered ? 'border-lightPurple-200' : 'border-black-50'} 
					rounded-3xl 
					pt-6 px-4 pb-2
					w-[325px] max-h-[500px]
				   bg-lightPurple-10
					drop-shadow-sm
				 
            `}
			onMouseEnter={() => setIsHovered(true)}  // Set hover state to true when mouse enters
			onMouseLeave={() => setIsHovered(false)} // Set hover state to false when mouse leaves
		>
			{/* Header part */}
			<div className="flex flex-col w-full gap-6"
			     onClick={handleArticleClicked}
			>
				{/* Profiles part */}
				<div className="flex gap-2">
					<div className="flex flex-row gap-2">
						<ToolTippedComponent tooltipText={article.clubName}>
							<img
								src={article.clubImageUrl}
								alt="clubimage"
								className="w-8 h-8 cursor-pointer rounded-full object-cover hover:border hover:border-lightPurple-500"
								onClick={(event) => handleLinkClicked(event,`/club/${article.clubId}`)}
							/>
						</ToolTippedComponent>
						<Avatar
							imageUrl={article.userImageUrl}
							userName={article.authorName}
							userId={article.authorId}
						/>
					</div>
					 {/*Dynamic content rendered on hover*/}
					{isHovered && (
						<div className="article-card-header flex justify-end items-center w-full gap-2"
						     onClick={() => console.log(article.articleId + " clicked")}>
							<Button className={`
                                text-md 
                                bg-obsidianBlack-500 text-white 
                                px-2 py-1 
                                rounded-lg 
                                text-center
                                hover:bg-gradient-to-tr from-darkPurple-500 to-brightOrange-500
                                hover:shadow-xl
                                transition-all duration-300
                            `}
								onClick={ (event) => {
									event.stopPropagation();
									handleArticleClicked()
								}}
							>
								Read Post
							</Button>

							<div className="flex items-center hover:bg-lightPurple-50 rounded-2xl"
								onClick={(event) => event.stopPropagation()}>
								<ArticleDropDownOptions article={article}/>
							</div>
						</div>

					) }
				</div>
				<div className="">
					<h1 className="text-xl font-semibold text-gray-900 break-word line-clamp-3">
						{ article.articleTitle }
					</h1>
				</div>
			</div>
			{/* Tags Container */}
			<div className="flex flex-col ">
				<div className="flex items-center flex-wrap gap-2 py-3">
					{ visibleTags.map((tag) => (
						<ArticleTag key={ tag.tagId } tag={tag}/>
					)) }
					{/* Overflow indicator */ }
					{ overflowCount > 0 &&
						<ArticleTag altText={ `+${ overflowCount }` }/>
					}
				</div>
				<p className="text-xxs pb-2 font-thin text-surface-900 pl-2">
					{ parseDate(article.createdDateTime) }
				</p>

				{/* Thumbnail part */ }
				<div className="flex items-center justify-center h-[180px] overflow-hidden rounded-3xl">
					<img
						src={ article.articleThumbnailUrl }
						alt="Thumbnail"
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
					/>
				</div>
				{/* Actions part */ }
				<div className="flex pt-2">
					{/* Vote actions */ }
					<div className="flex items-center bg-surface-500 rounded-xl">
						<div
							className={ `
                                flex flex-row 
                                gap-2 cursor-pointer 
                                py-2 px-2 
                                rounded-xl
                                ${ voteType === upvote ? 'bg-green-200 text-green-500' : ' ' } 
                                hover:bg-green-200
                                hover:text-green-500
                                transition-all duration-200 
                            ` }
							onClick={ toggleUpvote }
						>
							<BiUpvote size={ 20 }/>
							<p className="">{ voteCount }</p>
						</div>
						<RxDividerVertical size={ 20 } className="text-black-75 flex"/>
						<div
							className={ `
                                flex flex-row 
                                gap-2 cursor-pointer 
                                py-2 px-2 
                                rounded-xl 
                                ${ voteType === downVote ? 'bg-red-100 text-red-500' : ' ' }
                                hover:bg-red-100 
                                hover:text-red-500
                                transition-all duration-200 
                            ` }
							onClick={ handleDownVote }
						>
							<BiDownvote size={ 20 }/>
						</div>
					</div>
					{/* Article actions */ }
					<div className="flex flex-grow items-center justify-between pl-4">
						<div className={ `
                            flex items-center gap-1 cursor-pointer
                            rounded-xl 
                            py-2 px-2 
                            text-black-100
                            hover:bg-cyan-100
                            hover:text-cyan-500
                            transition-all duration-200 
                        ` }
						     onClick={ () => console.log("comment clicked") }
						>
							<BiCommentDetail size={ 20 }/>
							<p className="text-md font-bold">{ article.commentCount }</p>
						</div>
						<div
							className={ `
						      flex items-center gap-1 cursor-pointer
						      rounded-xl 
						      py-2 px-2 
						      transition-all duration-200
						      ${
								bookmarked
									? "bg-orange-100 text-orange-500"
									: "text-black-100 hover:bg-orange-100 hover:text-orange-500"
							}
					      ` }
							onClick={ toggleBookmark } // Disable click while loading
						>
							<MdBookmarkBorder size={ 20 }/>
						</div>
						<div className={ `
                            flex items-center gap-1 cursor-pointer
                            rounded-xl 
                            py-2 px-2 
                            text-black-100
                            hover:bg-purple-100
                            hover:text-purple-800
                            transition-all duration-200 
                        ` }
						     onClick={ () => console.log("share clicked") }
						>
							<PiShareFatLight size={ 20 }/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);


});
export default ArticleCard;

export function ArticleDropDownOptions({article}){
	const [reportModalOpen, setReportModalOpen] = useState(false);
	const [reportType, setReportType] = useState(null);
	const [additionalNote, setAdditionalNote] = useState("")
	const {toast } = useToast();

	const isAddingAdditionalNote = reportType === "other";
	const valid = reportType !== null;

	const handleStartReporting = () => {
		setReportModalOpen(true);
	}

	const handleStopReporting = () => {
		setReportModalOpen(false);
		setReportType(null);
	}

	const {mutate: reportMutation, isPending} = useMutation({
		mutationFn: reportArticle,
		onSuccess: () => {
			setReportModalOpen(false);
			setReportType(null);
			setAdditionalNote("");

		},
		onError: async (error) => {
			const errorMessage = error instanceof Error ? error.message : error?.detail || "Unknown error occurred.";
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: errorMessage,
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			});

			console.log("error:", error);
			handleStopReporting();
		},
	})

	const handleReporting = () => {
		const selectedReportLabel
			= document.querySelector(`input[name="ReportOptions"]:checked + span`)?.nextElementSibling?.innerText;
		const reportData = {
			articleId: article.articleId,
			reason: selectedReportLabel,
			additionalNotes: additionalNote
		};

		console.log("Submitting report data:", reportData);
		reportMutation(reportData);
	}

	const ReportModal = () => {
		return(
			<Modal
				open={reportModalOpen}
				onClose={handleStopReporting}
				className="p-6 rounded-2xl space-y-4 max-w-lg w-full"
			>
				<div className="border-b border-gray-200 pb-4 flex justify-between">
					<h1 className="text-2xl font-bold text-darkPurple-500">Report Post</h1>
					<button onClick={handleStopReporting}>
						<MdOutlineClose size={24} className="hover:bg-surface-500 rounded-2xl"  />
					</button>
				</div>
				<p>{article.articleTitle}</p>
				<div className="text-gray-800 font-medium">
					<RadioGroup
						name="ReportOptions"
						selectedValue={reportType}
						onChange={setReportType}
						radioColor="text-darkPurple-500"
						layout="flex flex-col gap-2"
					>
						<RadioItem value="type1">
							<p>The post is out of topic</p>
						</RadioItem>
						<RadioItem value="type2">
							<p>Broken Link</p>
						</RadioItem>
						<RadioItem value="type3">
							<p>Click Bait</p>
						</RadioItem>
						<RadioItem value="type4">
							<p>Low-Quality Content</p>
						</RadioItem>
						<RadioItem value="type5">
							<p>NSFW</p>
						</RadioItem>
						<RadioItem value="other">
							<p>Other</p>
						</RadioItem>
					</RadioGroup>
					<div className="mt-4 space-y-2">
						<p className="text-sm pl-1">Anything you would like to add?</p>
						<MultilineInput
							id="clubDescription"
							placeholder="additional notes"
							value={additionalNote} onChange={(e) => setAdditionalNote(e.target.value)}
							enabled={isAddingAdditionalNote}
							rows={5}
						/>
					</div>
				</div>
				<div className="leave-modal-actions flex gap-4 justify-end">
					<button
						className={`
							bg-darkPurple-500 text-white p-2 px-4 rounded-2xl
							disabled:bg-lightPurple-200
						`}
						disabled={valid === false || isPending}
						onClick={handleReporting}
					>
						{isPending ? 'Submitting' : 'Submit'}
					</button>
				</div>
			</Modal>
		)
	}




	return(
		<>
			{ReportModal()}
			<Dropdown
				trigger={
					<button className="rounded-2xl py-1">
						<EllipsisVerticalIcon size={18} />
					</button> }
			>
				<ul className="p-2 text-gray-600 space-y-2 select-none pt-4">
					<li className="hover:bg-gray-100 flex items-center gap-2"

					>
						<BiUpvote size={ 20 }/> Upvote
					</li>
					<li className="hover:bg-gray-100 flex items-center gap-2">
						<BiDownvote size={ 20 }/> Downvote
					</li>
					<li className="hover:bg-gray-100 flex items-center gap-2">
						<MdBookmarkBorder size={ 20 }/> Save
					</li>
					<div className="flex-grow border-t border-gray-300 px-4"></div>
					<li className="hover:bg-gray-100 flex items-center gap-2">
						Go to Club
					</li>
					<li className="hover:bg-gray-100 flex items-center gap-2">
						Go to Article
					</li>
					<li className="hover:bg-gray-100 flex items-center gap-2">
						Go to User
					</li>
					<div className="flex-grow border-t border-gray-300 px-4"></div>
					{/*the report feature*/}
					<li className="hover:bg-gray-100 flex items-center gap-2"
					    onClick={handleStartReporting}
					>
						<MdOutlineBugReport size={ 20 }/> Report
					</li>

				</ul>
			</Dropdown>
		</>
	)
}