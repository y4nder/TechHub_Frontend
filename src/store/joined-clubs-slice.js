import {createSlice} from "@reduxjs/toolkit";
import {fetchJoinedClubs} from "@/utils/http/clubs.js";

const initialJoinedClubsState = {
	clubs : [],
	hasError : false
}

const joinedClubsSlice = createSlice({
	name: "joinedClubs",
	initialState: initialJoinedClubsState,
	reducers: {
		setJoinedClubs: (state, action) => {
			console.log(action.payload);
			state.clubs = action.payload.clubs;
			state.hasError = false;
		},
		setHasError(state) {
			state.hasError = true;
		}
	}
})

export const dispatchFetchJoinedClubs = (userId) => {
	return async (dispatch) => {
		const fetchData = async () => {
			return await fetchJoinedClubs(userId);
		};

		try{
			const data = await fetchData();
			dispatch(joinedClubsActions.setJoinedClubs(data));
		} catch (error) {
			dispatch(joinedClubsActions.setHasError());
		}
	}
}

export const joinedClubsActions = joinedClubsSlice.actions;

export default joinedClubsSlice.reducer;