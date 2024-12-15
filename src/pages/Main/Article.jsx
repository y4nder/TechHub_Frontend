import {NavLink, useParams} from "react-router-dom";
import { formatDateTimeVersion2 } from "@/utils/formatters/dateFormatter.js";
import { DotIcon } from "lucide-react";
import { BiCommentDetail, BiDownvote, BiUpvote } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import { MdBookmarkBorder } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { CommentProvider, useComments } from "@/hooks/useComments.jsx";
import {useQuery} from "@tanstack/react-query";
import { downVoteArticle, fetchArticle, removeArticleVote, upVoteArticle } from "@/utils/http/articles.js";
import { getUserIdFromToken } from "@/utils/token/token.js";
import { fetchCommentsByArticleId } from "@/utils/http/comments.js";
import ArticleDisplay from "@/components/ArticleDisplay.jsx";
import { followUser, unFollowUser } from "@/utils/http/users";
import Modal from "@/components/ui/Modal.jsx";
import Avatar from "@/components/ui/Avatar.jsx";
import ArticleCommentSection from "@/components/ui/ArticleCommentSection.jsx";
import ArticleTag from "@/components/ui/ArticleTag.jsx";

const UPVOTE = "up";
const DOWNVOTE = "down";

export default function ArticlePage() {
    const [voteCount, setVoteCount] = useState(0);
    const [voteType, setVoteType] = useState(null);

    const params = useParams();
    const articleId = params.articleId;
    const userId = getUserIdFromToken();

    const fetchComments = async () => {
        const data = await fetchCommentsByArticleId(articleId, 1, 10);
        return data.comments.items;
    };

    const { data: article, isPending } = useQuery({
        queryKey: ["article", articleId],
        queryFn: () => {
            return fetchArticle(articleId);
        },
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

    const toggleUpvote = async () => {
        if (voteType === UPVOTE) {
            setVoteCount((prev) => prev - 1);
            setVoteType(null);
            console.log("removed upvote");
            await removeArticleVote(userId, articleId);
        } else {
            setVoteCount((prev) => (voteType === DOWNVOTE ? prev + 2 : prev + 1));
            setVoteType(UPVOTE);
            console.log("upvoted");
            await upVoteArticle(userId, articleId);
        }
    };

    const handleDownVote = async () => {
        if (voteType === DOWNVOTE) {
            setVoteCount((prev) => prev + 1);
            setVoteType(null);
            console.log("removed downvote");
            await removeArticleVote(userId, articleId);
        } else {
            setVoteCount((prev) => (voteType === UPVOTE ? prev - 2 : prev - 1));
            setVoteType(DOWNVOTE);
            console.log("downvote");
            await downVoteArticle(userId, articleId);
        }
    };

    return (
        <div
            className={`flex-1  transition-all py-6 px-24 
		`}
        >
            <div className="grid grid-flow-row-dense grid-cols-4  grid-rows-1 gap-8">
                <div className="col-span-3">
                    <CommentProvider fetchComments={fetchComments}>
                        {isPending && <p>Fetching article...</p>}
                        {!isPending && (
                            <>
                                <ArticleSection article={article} />
                                <ArticleCommentSection/>
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

    function ArticleSection({ article }) {
        const { setCurrentArticleId } = useComments();
        const [followedUser, setFollowedUser] = useState(article.followed);
        const [isUnfollowing, setIsUnfollowing] = useState(false);

        const handleFollow = async () => {
            setFollowedUser((prev) => !prev);
            await followUser(article.author.userId);
        };

        const handleUnFollow = async () => {
            setFollowedUser((prev) => !prev);
            await unFollowUser(article.author.userId);
            handleCancelUnfollow();
        };

        const handleCancelUnfollow = () => {
            setIsUnfollowing(false);
        }

        const startUnfollowing = () => {
            setIsUnfollowing(true);
        }

        useEffect(() => {
            setCurrentArticleId(article.articleId);
        }, [setCurrentArticleId, article.articleId]);


        const UnfollowConfirmationModal = () => {
            return (
               <Modal
                  open={ isUnfollowing }
                  onClose={ handleCancelUnfollow }
                  className="p-6 rounded-2xl space-y-4"
               >
                   <div>
                       <h1 className="text-lg text-brightOrange-500">Unfollow user?</h1>
                       <p className="text-sm text-gray-500">Are you sure you want to unfollow this user?</p>
                   </div>
                   <div className="leave-modal-actions flex gap-4 justify-end">
                       <button
                          className="py-1 px-3 bg-surface-500 rounded-xl text-sm hover:bg-surface-700 hover:text-white"
                          onClick={ handleCancelUnfollow }>
                           Cancel
                       </button>
                       <button
                          className="py-1 px-3 bg-red-50 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"
                          onClick={ handleUnFollow }>
                           Unfollow
                       </button>
                   </div>
               </Modal>
            )
        }

        return (
           <div>
               {UnfollowConfirmationModal()}
                <div className="bg-surface-100 p-8 rounded-2xl">
                    <div className="flex items-center gap-3 justify-between">
                        <h1 className="text-4xl font-bold">{article.articleTitle}</h1>
                        {article.isOwned && (
                            <NavLink to={`/articles/${article.articleId}/edit`} >Edit</NavLink>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 my-4">
                        {article.tags.map((tag) => (
                            // <ArticleDetailTag
                            //     key={tag.tagId.toString()}
                            //     tag={tag}
                            //     onClick={() => console.log("Tag clicked", tag.tagName, tag.tagId)}
                            // />
                           <ArticleTag key={ tag.tagId } tag={tag}/>
                        ))}
                    </div>
                    <p className="flex text-sm">
                        <span>Posted on&nbsp;</span>
                        <span className="font-bold">{formatDateTimeVersion2(article.createdDateTime)}</span>
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        {/*<img*/}
                        {/*    src={article.author.userProfilePicUrl}*/}
                        {/*    alt={article.author.username}*/}
                        {/*    className="w-12 h-12 object-cover rounded-full"*/}
                        {/*/>*/}
                        <Avatar
                           imageUrl={article.author.userProfilePicUrl}
                           userName={article.author.username}
                           userId={article.author.userId}
                           // variant='navProfile'
                        />
                        <div className="flex items-center gap-2">
                            <p>{article.author.username}</p>
                            {!article.isOwned && (
                               <>
                                    <DotIcon />
                                   { followedUser ? (
                                      <button
                                         className="font-bold text-lightPurple-500 hover:text-obsidianBlack-500 hover:underline"
                                         onClick={ startUnfollowing }
                                      >
                                          Unfollow
                                      </button>
                                   ) : (
                                      <button
                                         className="font-bold hover:text-lightPurple-500 hover:underline"
                                         onClick={ handleFollow }
                                      >
                                          Follow
                                      </button>
                                   ) }
                               </>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        {/*<p className="break-words">{article.articleContent}</p>*/}
                        <ArticleDisplay htmlContent={article.articleHtmlContent} />
                    </div>

                    <div className="flex pt-4 items-center gap-4">
                        <VoteActions />
                        <ArticleActions article={article} />
                    </div>
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
                <RxDividerVertical
                    size={20}
                    className="text-black-75 flex"
                />
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

    function ArticleActions({ article }) {
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
        return <div className="p-4 bg-gray-100 rounded-lg shadow-md">Right side content here</div>;
    }
}
