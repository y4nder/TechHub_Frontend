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
	}
];
