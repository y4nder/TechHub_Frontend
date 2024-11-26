import {createSlice} from "@reduxjs/toolkit";
import {fetchProfileNav} from "@/utils/http/users.js";

const initialUserState = {
	userId : -1,
	username : 'none',
	userProfilePicUrl: null,
	reputationPoints: -1
}

const userSlice = createSlice({
	name: "user",
	initialState: initialUserState,
	reducers: {
		setUser(state, action){
			state.userId = action.payload.userId;
			state.username = action.payload.username;
			state.userProfilePicUrl = action.payload.userProfilePicUrl;
			state.reputationPoints = action.payload.reputationPoints;
		}
	}
});

export const dispatchFetchProfileNav = (userId) => {
	return async (dispatch) => {
		const fetchData = async () => {
			return await fetchProfileNav(userId);
		};

		try{
			const data = await fetchData();
			dispatch(userActions.setUser(data))
		} catch (error) {
			//
		}
	}
}

export const userActions = userSlice.actions;

export default userSlice.reducer;