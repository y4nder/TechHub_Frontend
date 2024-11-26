import {configureStore} from "@reduxjs/toolkit";

import userReducer from "./user-slice";
import joinedClubsReducer from "./joined-clubs-slice";

const store = configureStore({
	reducer: {
		user: userReducer,
		joinedClubs: joinedClubsReducer
	}
});

export default store;