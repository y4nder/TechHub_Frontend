import HomePage from "../pages/Main/Home.jsx";
import ArticlePage from "@/pages/Main/Article.jsx";
import DiscoverArticlePage from "@/pages/Main/DiscoverArticle.jsx";
import NewArticle from "@/pages/Main/NewArticle.jsx";
import RootArticle from "@/pages/RootArticle.jsx";
import EditArticlePage from "@/pages/Main/EditArticle.jsx";
import NewArticlePage from "@/pages/Main/NewArticle.jsx";

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
];
