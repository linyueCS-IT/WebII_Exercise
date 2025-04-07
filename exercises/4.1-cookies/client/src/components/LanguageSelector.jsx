import { useState } from "react";

/**
 * Retrieves a cookie value by name. If the cookie does not exist,
 * it creates the cookie with a default value and returns it.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} defaultValue - The default value if the cookie is not found.
 * @returns {string} - The value of the cookie.
 */
function getCookie(name, defaultValue) {
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
function setCookie(name, value) {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
}

const LanguageSelector = () => {
	// -State to store the current language (retrieved from the "language" cookie
	// -using the custom function getCookie)
	//- If the cookie doesn’t exist, it defaults to `"en"` (English).
	const [language, setLanguage] = useState(getCookie("language", "en"));

	/**
	 * Toggles the language between English ("en") and French ("fr").
	 *
	 * Updates the cookie and reloads the page to apply the change.
	 */
	const toggleLanguage = () => {
		const newLanguage = language === "en" ? "fr" : "en";
		//code to set cookie [TODO]

		//You're updating the language state using the previous state value (prev).
		//This is a common and safe pattern in React when the new state depends on the old state.
		setLanguage((prev) => (prev === "en" ? "fr" : "en"));

		//code to reload the brower[TODO]
	};

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<button onClick={toggleLanguage}>Toggle Language</button>
		</div>
	);
};

export default LanguageSelector;
