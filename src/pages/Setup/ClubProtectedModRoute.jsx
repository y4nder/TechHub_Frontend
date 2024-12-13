import {Navigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

export default function ClubProtectedModRoute({role, children}) {
	const {clubId} = useParams();
	const { clubs:joinedClubs } = useSelector(state => state.joinedClubs);
	const joined = joinedClubs.find((c) => c.clubId === +clubId);

	if(!joined) {
		return <Navigate to={'/not-a-member'} replace={true} />
	}

	if(clubId &&
		joined &&
		!joined.roles.find(r => r.roleName === role)
	) {
		return <Navigate to={'/unauthorized'} replace/>
	}

	return children;
}