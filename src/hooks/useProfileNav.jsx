import {createContext, useContext, useState} from "react";

const ProfileNavContext = createContext();

export const ProfileNavContextProvider = ({ children }) => {
	const [selectedNav, setSelectedNav] = useState(0);

	const values = {
		selectedNav,
		setSelectedNav,
	}

	return <ProfileNavContext.Provider value={values}>
		{children}
	</ProfileNavContext.Provider>;
}

export const useProfileNav = () => useContext(ProfileNavContext);