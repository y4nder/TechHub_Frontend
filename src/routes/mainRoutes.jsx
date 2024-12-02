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
import RootProfileDetailsPage from "@/pages/RootProfileDetails.jsx";
import ProfilePostsPage from "@/pages/Main/ProfilePosts.jsx";
import ProfileRepliesPage from "@/pages/Main/ProfileReplies.jsx";
import ProfileUpVotedPage from "@/pages/Main/ProfileUpvoted.jsx";
import RootEditProfilePage from "@/pages/RootEditProfile.jsx";
import ProfileDetailsEditPage from "@/pages/Main/ProfileDetailsEdit.jsx";
import BookmarkedArticlesPage from "@/pages/Main/BookmarkedArticles.jsx";
import RootHistoryLayout from "@/pages/RootHistory.jsx";
import ReadHistoryPage from "@/pages/Main/ReadHistory.jsx";
import SearchHistoryPage from "@/pages/Main/SeachHistory.jsx";

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
		element: <RootClubLayout/>,
		children: [
			{
				index: true,
				element: <DiscoverClubsPage/>,
			},
			{
				path: "category/:categoryId/:categoryName",
				element: <CategoryClubsPage/>
			}

		]
	},
	{
		path: "/club/:clubId",
		element: <ClubDetailsPage/>,
	},
	{
		path: "/profile/:profileId",
		element: <RootProfilePage />, // Main layout with navigation tabs
		children: [
			{
				index: true, // Default child for /profile/:profileId
				element: <ProfilePostsPage />, // Posts page
			},
			{
				path: "replies",
				element: <ProfileRepliesPage />, // Replies page
			},
			{
				path: "upvotes",
				element: <ProfileUpVotedPage />, // Upvotes page
			},
		],
	},
	{
		path:"/bookmarks",
		element: <BookmarkedArticlesPage/>
	},
	{
		path:"/history",
		element: <RootHistoryLayout/>,
		children: [
			{
				index: true,
				path: "read",
				element: <ReadHistoryPage/>
			},
			{
				path: "searched",
				element: <SearchHistoryPage/>
			}
		]
	}
];
