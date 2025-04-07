import { useState, useEffect } from "react";

export default function CookieDisplay() {
	const [cookies, setCookies] = useState({});

	useEffect(() => {
		// Parse document.cookie into an object
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
		const parseCookies = () => {
			if (!document.cookie) return {};
			return document.cookie.split("; ").reduce((acc, cookie) => {
				const [name, value] = cookie.split("=");
				acc[name] = value;
				return acc;
			}, {});
		};

		setCookies(parseCookies());
	}, []); // Runs once on mount

	return (
		<>
			<h2>Cookies</h2>
			<ul>
				{Object.entries(cookies).map(([name, value]) => (
					<li key={name}>
						{name}: {value}
					</li>
				))}
			</ul>
		</>
	);
}
