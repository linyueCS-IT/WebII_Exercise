import { useState, useEffect } from "react";
import Home from "./Home";

function MainPage() {
	const [message, setMessage] = useState("");
	const fetchHome = async () => {
		const fetchURL = `http://localhost:3000`;
		const requestOptions = {
			method: "GET",
			credentials: "include", // 🔥 Required to send cookies
			mode: "cors",
		};
		const response = await fetch(fetchURL, requestOptions);

		if (response.ok) {
			const data = await response.json();
			console.log("Fetched home:", data.message);
			setMessage(data.message);
		} else {
			console.error("Failed to fetch Home:", response.status);
		}
	};
	useEffect(() => {
		fetchHome();
	}, []);

	return <Home heading={message} />;
}

export default MainPage;
