/**
 * Retrieves a cookie value by name. If the cookie does not exist,
 * it creates the cookie with a default value and returns it.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} defaultValue - The default value if the cookie is not found.
 * @returns {string} - The value of the cookie.
 */
export function getCookie(name, defaultValue) {
	const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
		const [key, value] = cookie.split("=");
		acc[key] = decodeURIComponent(value);
		return acc;
	}, {});

	if (cookies[name]) {
		return cookies[name]; // Return the cookie if it exists
	}

	// If the cookie doesn't exist, create it with the default value
	document.cookie = `${name}=${encodeURIComponent(defaultValue)}; path=/;`;
	return defaultValue; // Return the newly set default value
}

/**
 * Sets a cookie with the specified name and value.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to store in the cookie.
 */
export function setCookie(name, value) {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
}
