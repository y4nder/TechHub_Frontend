import SignIn from "../pages/Authentication/SignIn.jsx";
import SignUp from "../pages/Authentication/SignUp.jsx";

const authRoutes = [
		{
			index: true,
			path: "/auth/sign-in",
			element: <SignIn/>
		},
		{
			path: "/auth/sign-up",
			element: <SignUp/>
		}

];

export default authRoutes;