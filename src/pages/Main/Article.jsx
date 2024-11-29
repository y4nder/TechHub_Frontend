import { useParams } from "react-router-dom";
import { useSidebar } from "@/hooks/useSidebar.jsx";
import ArticleDetailTag from "@/components/ui/ArticleDetailTag.jsx";
import { formatDateTimeVersion2 } from "@/utils/formatters/dateFormatter.js";
import { DotIcon } from "lucide-react";
import { BiCommentDetail, BiDownvote, BiUpvote } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import { MdBookmarkBorder } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import {dummyCommentsData} from "@/utils/dummies/dummyComments.js";
import CommentSection from "@/components/CommentsSection.jsx";
import {CommentProvider} from "@/hooks/useComments.jsx";
import {useQuery} from "@tanstack/react-query";
import {fetchArticle} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {fetchCommentsByArticleId} from "@/utils/http/comments.js";

const UPVOTE = "up";
const DOWNVOTE = "down";

export default function ArticlePage() {
	const [voteCount, setVoteCount] = useState(0);
	const [voteType, setVoteType] = useState(null);
	const { expanded } = useSidebar();
	const params = useParams();
	const articleId = params.articleId;

	const fetchComments = async () => {
		const data= await fetchCommentsByArticleId(articleId, 1, 10)
		return data.comments.items;
	};

	const {
		data: article,
		isPending
	} = useQuery({
		queryKey: ["article", articleId],
		queryFn: () => {
			return fetchArticle(getUserIdFromToken(), articleId)
		}
	});

	// Update article state when fetched data changes
	useEffect(() => {
		if (article) {
			console.log("article available");
			setVoteCount(article.voteCount);
			if (article.voteType === -1) {
				setVoteType(DOWNVOTE);
			} else if (article.voteType === 1) {
				setVoteType(UPVOTE);
			} else {
				setVoteType(null);
			}
		}
	}, [article]);

	const toggleUpvote = () => {
		if (voteType === UPVOTE) {
			setVoteCount((prev) => prev - 1);
			setVoteType(null);
		} else {
			setVoteCount((prev) => (voteType === DOWNVOTE ? prev + 2 : prev + 1));
			setVoteType(UPVOTE);
		}
	};

	const handleDownVote = () => {
		if (voteType === DOWNVOTE) {
			setVoteCount((prev) => prev + 1);
			setVoteType(null);
		} else {
			setVoteCount((prev) => (voteType === UPVOTE ? prev - 2 : prev - 1));
			setVoteType(DOWNVOTE);
		}
	};

	return (
		<div
			className={`flex-1 gradient-bg-light transition-all w-screen h-full pt-6 ${
				expanded ? "pl-[375px] pr-[100px]" : "pl-[120px] pr-[100px]"
			}
		`}
		>
			<div className="grid grid-flow-row-dense h-screen grid-cols-4 grid-rows-1 gap-8">
				<div className="col-span-3">
					<CommentProvider fetchComments={fetchComments}>
						{isPending && <p>Fetching article...</p>}
						{!isPending && (
							<>
								<ArticleSection article={article}/>
								<CommentSection articleId={article.articleId}/>
							</>
						)}
					</CommentProvider>
				</div>
				<div className="col-span-1">
					<RightContent />
				</div>
			</div>
		</div>
	);

	function ArticleSection({article}) {
		return (
			<div className="bg-surface-100 p-8 rounded-2xl">
				<h1 className="text-4xl font-bold">{article.articleTitle}</h1>
				<div className="flex flex-wrap gap-2 my-4">
					{article.tags.map((tag) => (
						<ArticleDetailTag
							key={tag.tagId.toString()}
							tag={tag}
							onClick={() => console.log("Tag clicked", tag.tagName, tag.tagId)}
						/>
					))}
				</div>
				<p className="flex text-sm">
					<span>Posted on&nbsp;</span>
					<span className="font-bold">
            {formatDateTimeVersion2(article.createdDateTime)}
          </span>
				</p>
				<div className="flex items-center gap-4 mt-4">
					<img
						src={article.author.userProfilePicUrl}
						alt={article.author.username}
						className="w-12 h-12 object-cover rounded-full"
					/>
					<div className="flex items-center gap-2">
						<p>{article.author.username}</p>
						<DotIcon />
						<button className="font-bold">Follow</button>
					</div>
				</div>

				<div className="mt-6">
					<p className="break-words">{article.articleContent}</p>
				</div>

				<div className="flex pt-4 items-center gap-4">
					<VoteActions />
					<ArticleActions article={article} />
				</div>
			</div>
		);
	}

	function VoteActions() {
		return (
			<div className="flex items-center bg-surface-500 rounded-xl">
				<div
					className={`flex flex-row gap-2 cursor-pointer py-2 px-2 rounded-xl ${
						voteType === UPVOTE ? "bg-green-200 text-green-500" : ""
					} hover:bg-green-200 hover:text-green-500 transition-all duration-200`}
					onClick={toggleUpvote}
				>
					<BiUpvote size={20} />
					<p>{voteCount}</p>
				</div>
				<RxDividerVertical size={20} className="text-black-75 flex" />
				<div
					className={`flex flex-row gap-2 cursor-pointer py-2 px-2 rounded-xl ${
						voteType === DOWNVOTE ? "bg-red-100 text-red-500" : ""
					} hover:bg-red-100 hover:text-red-500 transition-all duration-200`}
					onClick={handleDownVote}
				>
					<BiDownvote size={20} />
				</div>
			</div>
		);
	}

	function ArticleActions({article}) {
		return (
			<div className="flex gap-4">
				<ActionIcon
					icon={<BiCommentDetail size={20} />}
					label={article.commentCount}
					color="cyan"
					onClick={() => console.log("Comment clicked")}
				/>
				<ActionIcon
					icon={<MdBookmarkBorder size={20} />}
					label="Bookmark"
					color="orange"
					onClick={() => console.log("Bookmark clicked")}
				/>
				<ActionIcon
					icon={<PiShareFatLight size={20} />}
					label="Share"
					color="purple"
					onClick={() => console.log("Share clicked")}
				/>
			</div>
		);
	}

	function ActionIcon({ icon, label, color, onClick }) {
		return (
			<div
				className={`flex items-center gap-1 cursor-pointer rounded-xl py-2 px-2 text-black-100 hover:bg-${color}-100 hover:text-${color}-500 transition-all duration-200`}
				onClick={onClick}
			>
				{icon}
				<p className="text-md font-bold">{label}</p>
			</div>
		);
	}

	function RightContent() {
		return (
			<div className="p-4 bg-gray-100 rounded-lg shadow-md">
				Right side content here
			</div>
		);
	}


}
