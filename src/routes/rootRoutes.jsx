import RootLayout from "../pages/RootLayout.jsx";
import authRoutes from "./authRoutes.jsx";
import AuthLayout from "../pages/AuthLayout.jsx";
import {mainRoutes} from "./mainRoutes.jsx";

const rootRoutes = [
	{
		path: "/",
		element: <AuthLayout />,
		children: [
			...authRoutes,
		]
	},
	{
		path: "/",
		element: <RootLayout/>,
		children: [
			...mainRoutes
		]
	}
];


export default rootRoutes;