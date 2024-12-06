import {getToken} from "@/utils/token/token.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function httpRequest(
   {
       method,
       endpoint,
       body = null,
       headers = {},
       queryParams = {},
       errorMessage = "An unexpected error occurred" }) {
    const url = new URL(apiBaseUrl + endpoint);

    Object.keys(queryParams).forEach((key) => url.searchParams.append(key, queryParams[key]));

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`, // Pass the token here
            ...headers,
        },
        body: body ? JSON.stringify(body) : null,
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            // Parse error response if available
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = null; // Handle cases where the response isn't JSON
            }
            throw new Error(errorData?.message || errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("HTTP request failed:", error);
        error.message = "HTTP request failed";
        throw error;
    }
}

export async function get({ endpoint, headers, queryParams }) {
    return httpRequest({
        method: "GET",
        endpoint,
        headers,
        queryParams,
    });
}

export async function post({ endpoint, body, headers }) {
    return httpRequest({
        method: "POST",
        endpoint,
        body,
        headers,
    });
}

export async function put({ endpoint, body, headers }) {
    return httpRequest({
        method: "PUT",
        endpoint,
        body,
        headers,
    });
}

export async function del({ endpoint, body, headers }) {
    return httpRequest({
        method: "DELETE",
        endpoint,
        body,
        headers,
    });
}

