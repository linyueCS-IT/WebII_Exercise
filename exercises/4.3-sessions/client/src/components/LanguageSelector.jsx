import { useState } from "react";
//import { Button } from "@/components/ui/button";

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

function setCookie(name, value) {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
}

const LanguageSelector = () => {
	const [language, setLanguage] = useState(getCookie("language", "en"));

	const toggleLanguage = () => {
		setCookie("language", language === "en" ? "fr" : "en");
		setLanguage((prev) => (prev === "en" ? "fr" : "en"));
		window.location.reload(); // Reload the page when language changes
	};

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<button onClick={toggleLanguage}>
				{language === "en" ? "Switch to French" : "Passer en anglais"}
			</button>
		</div>
	);
};

export default LanguageSelector;
