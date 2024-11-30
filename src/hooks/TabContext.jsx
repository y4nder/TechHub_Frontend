import React, { createContext, useContext, useState } from "react";

// Create the context
const TabContext = createContext();

// Provider component
export const TabProvider = ({ children }) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const value = {
		selectedTab,
		setSelectedTab,
	};

	return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

// Custom hook to use the TabContext
export const useTabContext = () => useContext(TabContext);
