const apiBaseUrl = "http://localhost:5057";

export async function httpRequest({ method, endpoint, body = null, headers = {}, queryParams = {} }) {
	const url = new URL(apiBaseUrl + endpoint);

	Object.keys(queryParams).forEach(key =>
		url.searchParams.append(key, queryParams[key])
	);

	const options = {
		method,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: body ? JSON.stringify(body) : null,
	};

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "An error occurred");
		}

		return await response.json();
	} catch (error) {
		console.error("HTTP request failed:", error);
		throw error;
	}
}

export async function get({ endpoint, headers }) {
	return httpRequest({
		method: "GET",
		endpoint,
		headers,
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
