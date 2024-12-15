// utils/localStorageHelper.js

export const storeJoinedClubs = (clubs) => {
	try {
		localStorage.setItem('joinedClubs', JSON.stringify(clubs));
	} catch (error) {
		console.error("Error storing joined clubs in localStorage", error);
	}
};

export const getJoinedClubsFromStorage = () => {
	try {
		const clubs = localStorage.getItem('joinedClubs');
		return clubs ? JSON.parse(clubs) : [];
	} catch (error) {
		console.error("Error retrieving joined clubs from localStorage", error);
		return [];
	}
};
