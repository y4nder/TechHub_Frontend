import { createContext, useState, useContext } from "react";


const SidebarContext = createContext();


export const useSidebar = () => {
	return useContext(SidebarContext);
};


export const SidebarProvider = ({ children }) => {
	const [expanded, setExpanded] = useState(true);

	return (
		<SidebarContext.Provider value={{ expanded, setExpanded }}>
			{children}
		</SidebarContext.Provider>
	);
};

export default SidebarContext;
