import {useParams} from "react-router-dom";
import {convertToTypedValue} from "@/utils/formatters/analyticsHelper.js";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getClubAnalytics} from "@/utils/http/clubs.js";
import {getTenReportedArticles} from "@/utils/http/articles.js";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {getModerators} from "@/utils/http/users.js";
import Avatar from "@/components/ui/Avatar.jsx";
import ArticleCard from "@/components/ArticleCard.jsx";
import DynamicList from "@/components/pagination/DynamicList.jsx";
import {ReportedArticleListItem} from "@/components/pagination/paginatedItems/ReportedArticleListItem.jsx";
import {ShieldCheck} from "lucide-react";
import {getClubArticlesForMod} from "@/utils/http/moderators.js";

const gradients = [
	"bg-gradient-to-br from-orange-500 to-yellow-100",
	"bg-gradient-to-br from-purple-500 to-pink-100",
	"bg-gradient-to-br from-blue-500 to-green-100",
	"bg-gradient-to-br from-red-500 to-yellow-300",
	"bg-gradient-to-br from-teal-500 to-cyan-100",
];

export default function ClubModeratorDashboardPage() {
	const {clubId} = useParams();
	const userId = getUserIdFromToken();
	const {
		data : analytics,
		isPending: isPendingAnalytics,
		isError,
		error
	} = useQuery({
		queryKey: ['club', clubId, 'analytics'],
		queryFn: async() => {
			const data = await getClubAnalytics(clubId);
			return data.analyticsData.analytics;
		}
	})

	// Infinite query for fetching articles
	const {
		data : clubArticles,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["articles", "club", clubId],
		queryFn: ({ pageParam = 1 }) =>
			getClubArticlesForMod(clubId, userId, pageParam, 10),
		getNextPageParam: (lastPage) => {
			const { pageNumber, totalPages } = lastPage.articles;
			return pageNumber < totalPages ? pageNumber + 1 : undefined;
		}
	});

	const {
		data : moderators,
		isPending: isPendingModerators,
	} = useQuery({
		queryKey: ['users', clubId, 'moderators'],
		queryFn: async() => {
			const data = await getModerators(clubId);
			return data.moderators;
		}
	})

	const {
		data : reportedArticlesData,
		isPending: isPendingReportedArticles,
	} = useQuery({
		queryKey: ['reportedArticles', clubId],
		queryFn: async() => {
			const data = await getTenReportedArticles(clubId);
			return data.reportedArticles;
		}
	})

	const articles =
		clubArticles?.pages.flatMap((page) => page.articles.items) || [];

	return (
		<div className="mt-5 grid grid-cols-6">
			<div className="left-side col-span-5 gap-4">
				{ isPendingAnalytics && (<p>Loading Analytics...</p>) }
				{ !isPendingAnalytics && analytics && (
					<div className="analytics-cards flex flex-wrap gap-6">
						{ analytics.map((a, index) => (
							<ClubAnalyticsCard key={ index } item={ a } index={index}/>
						)) }
					</div>
				) }

				<div
					className={ `justify-center pt-8 `}>
					{ articles.length === 0 ? (
						<div className="flex flex-grow items-center justify-center">
							<p className="text-center text-gray-500">No articles found for this club.</p>
						</div>
					) : (
						<div className="space-y-4 px-3 ">
							<h1 className="font-bold text-xl px-2">Popular Posts</h1>
							<DynamicList
								items={articles}
								hasNextPage={hasNextPage}
								fetchNextPage={fetchNextPage}
								isFetchingNextPage={isFetchingNextPage}
								containerStyle="flex flex-row overflow-x-auto scrollbar-hider gap-8"
								renderItem={(article, ref) => (
									<ArticleCard ref={ref} key={article.articleId.toString()} article={article} />
								)}
							/>
						</div>
					) }
				</div>
			</div>
			<div className="right-side col-span-1  px-4 space-y-5 border-gray-200">
				<div className="moderators flex flex-col gap-3  ">
					{ isPendingModerators && (<p>Loading Moderators...</p>) }
					{ !isPendingModerators && moderators && (
						<div className=" p-4 flex flex-col gap-2 border bg-lightPurple-10 rounded-2xl">
							<h1 className="font-medium text-lg text-lightPurple-500">Moderators</h1>
							<div className=" space-y-2 rounded-2xl">
								{ moderators.map((moderator) => (
									<div
										key={ moderator.userId }
										className="flex gap-4 border py-2 px-3 rounded-2xl items-center border-lightPurple-200 bg-surface-200 drop-shadow-sm group hover:bg-lightPurple-50"
									>
										<Avatar
											imageUrl={ moderator.userProfilePicUrl }
											username={ moderator.userName }
											userid={ moderator.userId }
										/>
										<div>
											<p className="font-medium">
												{ moderator.username }
											</p>
											<p className="flex text-lightPurple-500 gap-1 text-sm self-end">
												<ShieldCheck size={ 18 }/>
												{ moderator.roleName }
											</p>
										</div>
									</div>
								)) }
							</div>
						</div>
					) }
				</div>
				<div className="reports space-y-2 bg-red-50 p-4 rounded-2xl border border-red-200">
					<h1 className="font-medium text-red-400 pl-1">Reports</h1>
					<div className="flex flex-col gap-3">
						{isPendingReportedArticles ? (
							<p>Loading Reported Articles...</p>
						) : Array.isArray(reportedArticlesData) && reportedArticlesData.length > 0 ? (
							reportedArticlesData.map((reportedArticle) => (
								<ReportedArticleListItem
									key={`${reportedArticle.articleId}_${reportedArticle.reporterId}`}
									report={reportedArticle}
								/>
							))
						) : (
							<p className="text-gray-500">No reported articles available.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)



	function ClubAnalyticsCard({item, index}) {
		const { label, value } = convertToTypedValue(item);

		// Pick a gradient based on the index
		const gradient = gradients[index % gradients.length];

		return (
			<div
				className={`rounded-2xl p-4 px-7 w-full max-w-[200px] shadow-sm space-y-1 text-white ${gradient}`}
			>
				<p className="font-sans font-thin text-sm">{label}</p>
				<p className="font-medium text-2xl">{value}</p>
			</div>
		);
	}
}