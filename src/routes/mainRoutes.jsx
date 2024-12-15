import HomePage from "../pages/Main/Home.jsx";
import ArticlePage from "@/pages/Main/Article.jsx";
import DiscoverArticlePage from "@/pages/Main/DiscoverArticle.jsx";
import RootArticle from "@/pages/RootArticle.jsx";
import EditArticlePage from "@/pages/Main/EditArticle.jsx";
import NewArticlePage from "@/pages/Main/NewArticle.jsx";
import RootClubLayout from "@/pages/RootClub.jsx";
import DiscoverClubsPage from "@/pages/Main/DiscoverClubs.jsx";
import CategoryClubsPage from "@/pages/Main/CategoryClubs.jsx";
import ClubDetailsPage from "@/pages/Main/ClubDetails.jsx";
import RootProfilePage from "@/pages/RootProfile.jsx";
import ProfilePostsPage from "@/pages/Main/ProfilePosts.jsx";
import ProfileRepliesPage from "@/pages/Main/ProfileReplies.jsx";
import ProfileUpVotedPage from "@/pages/Main/ProfileUpvoted.jsx";
import BookmarkedArticlesPage from "@/pages/Main/BookmarkedArticles.jsx";
import RootHistoryLayout from "@/pages/RootHistory.jsx";
import ReadHistoryPage from "@/pages/Main/ReadHistory.jsx";
import SearchHistoryPage from "@/pages/Main/SeachHistory.jsx";
import RootEditProfilePage from "@/pages/RootEditProfile.jsx";
import ProfileAccountDetailsPage from "@/pages/Main/ProfileAccountDetails.jsx";
import CreateNewClubPage from "@/pages/Main/CreateNewClub.jsx";
import ProfileSecurityPage from "@/pages/Main/ProfileSecurity.jsx";
import ProfileNotificationsPage from "@/pages/Main/ProfileNotifications.jsx";
import DiscoverTagsPage from "@/pages/Main/DiscoverTags.jsx";
import TagPage from "@/pages/Main/Tag.jsx";
import ClubProtectedModRoute from "@/pages/Setup/ClubProtectedModRoute.jsx";
import {Moderator} from "@/utils/constants/roleConstants.js";
import ClubModeratorDashboardPage from "@/pages/Main/Moderators/ClubModeratorDashboard.jsx";
import ClubPostsPage from "@/pages/Main/Moderators/ClubPosts.jsx";
import ClubReportsPage from "@/pages/Main/Moderators/ClubReports.jsx";
import ClubModeratorsPage from "@/pages/Main/Moderators/ClubModerators.jsx";
import EditClubPage from "@/pages/Main/Moderators/EditClub.jsx";

export const mainRoutes = [
	{
		path: "/home",
		element: <HomePage />,
	},
	{
		path: "/articles",
		element: <RootArticle />,
		children: [
			{
				index: true, // Default route for /articles
				element: <DiscoverArticlePage />,
			},
			{
				path: "new", // Relative path (resolves to /articles/new)
				element: <NewArticlePage />,
			},
			{
				path: "new/:clubId", // Relative path (resolves to /articles/new)
				element: <NewArticlePage />,
			},
			{
				path: ":articleId", // Relative path (resolves to /articles/:articleId)
				element: <ArticlePage />,
			},
			{
				path: ":articleId/edit", // Relative path (resolves to /articles/:articleId/edit)
				element: <EditArticlePage />,
			},
		],
	},
	{
		path: "/clubs",
		element: <RootClubLayout />,
		children: [
			{
				index: true,
				element: <DiscoverClubsPage />,
			},
			{
				path: "category/:categoryId/:categoryName",
				element: <CategoryClubsPage />,
			},
		],
	},
	{
		path: "/club/:clubId",
		element: <ClubDetailsPage />,
	},
	{
		path: "/club/:clubId/moderate",
		element: <ClubProtectedModRoute role={Moderator}/>,
		children: [
			{
				index: true,
				element: <ClubModeratorDashboardPage/>,
			},
			{
				path: "posts",
				element: <ClubPostsPage/>
			},
			{
				path: "moderators",
				element: <ClubModeratorsPage/>
			},
			{
				path: "reports",
				element: <ClubReportsPage/>
			},
		]
	},
	{
		path: "/club/:clubId/edit",
		element: <EditClubPage />,
	},
	{
		path: "/club/create",
		element: <CreateNewClubPage />,
	},
	{
		path: "/profile/:profileId",
		element: <RootProfilePage />,
		children: [
			{
				index: true,
				element: <ProfilePostsPage />,
			},
			{
				path: "replies",
				element: <ProfileRepliesPage />,
			},
			{
				path: "upvotes",
				element: <ProfileUpVotedPage />,
			},
		],
	},
	{
		path: "/profile/:profileId/settings",
		element: <RootEditProfilePage />,
		children: [
			{
				index: true,
				element: <ProfileAccountDetailsPage />,
			},
			{
				path: "security",
				element: <ProfileSecurityPage />,
			},
			{
				path: "notifications",
				element: <ProfileNotificationsPage />,
			}

		],
	},
	{
		path: "/bookmarks",
		element: <BookmarkedArticlesPage />,
	},
	{
		path: "/history",
		element: <RootHistoryLayout />,
		children: [
			{
				index: true,
				path: "read",
				element: <ReadHistoryPage />,
			},
			{
				path: "searched",
				element: <SearchHistoryPage />,
			},
		],
	},
	{
		path: "/tags",
		element: <DiscoverTagsPage />,
	},
	{
		path: "/tags/:tagId",
		element: <TagPage/>
	}
];
