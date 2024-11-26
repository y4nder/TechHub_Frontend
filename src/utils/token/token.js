import {jwtDecode} from 'jwt-decode';


const tokenKey = "token";

export function storeToken(token){
	localStorage.setItem(tokenKey, token);
}

// Check if token exists and if it is valid (not expired)
export function checkToken() {
	const token = localStorage.getItem(tokenKey);

	if (!token) {
		return false; // No token found
	}

	const decodedToken = jwtDecode(token);
	if (!decodedToken) {
		return false; // Invalid token format
	}

	const currentTime = Date.now() / 1000; // Get current time in seconds
	const tokenExpiry = decodedToken.exp; // Expiry time in seconds from the token

	return tokenExpiry > currentTime; // Check if token is expired
}

export function getToken() {
	const token = localStorage.getItem(tokenKey);

	if (!token || token.trim() === "") {
		return null;
	}

	try {
		const decodedToken = jwtDecode(token);
		const currentTime = Date.now() / 1000; // JWT expiration time is in seconds

		if (decodedToken.exp < currentTime) {
			localStorage.removeItem(tokenKey);  // Optionally clear expired token
			return null;
		}

		return token;
	} catch (error) {
		return null;
	}
}

export function getUserIdFromToken() {
const token = getToken();
	if (!token) return null;

	try {
		const decoded = jwtDecode(token);
		const userId = +decoded[import.meta.env.VITE_TOKEN_NAME_IDENTIFIER_KEY];
		return userId || -1;
	} catch (error) {
		console.error("Failed to decode token", error);
		return null;
	}
}

export function getUserDataFromToken(token){
	const decoded = jwtDecode(token);
	const userId = decoded[import.meta.env.VITE_TOKEN_NAME_IDENTIFIER_KEY];
	const username = decoded[import.meta.env.VITE_TOKEN_NAME_KEY];
	return {
		userId: +userId,
		username
	}
}

