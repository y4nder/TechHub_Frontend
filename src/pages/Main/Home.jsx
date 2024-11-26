// import {getUserIdFromToken} from "@/utils/token/token.js";
import {useSelector} from "react-redux";

export default function HomePage (){
	const user = useSelector((state) => state.user);

	return <h1> test test test from home page</h1>
}