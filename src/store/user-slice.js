import {createSlice} from "@reduxjs/toolkit";

const initialUserState = {
	userId : -1,
	userName : 'none'
}

const userSlice = createSlice({
	name: "user",
	initialState: initialUserState,
	reducers: {
		setUser(state, action){
			state.userId = action.payload.userId;
			state.username = action.payload.username;
		}
	}
});

export const userActions = userSlice.actions;

export default userSlice.reducer;