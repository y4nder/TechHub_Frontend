// import {getUserIdFromToken} from "@/utils/token/token.js";
import {useSelector} from "react-redux";

export default function HomePage (){
	const user = useSelector((state) => state.user);
	const {clubs} = useSelector((state) => state.joinedClubs);

	return <h1> {JSON.stringify(clubs) }</h1>
}