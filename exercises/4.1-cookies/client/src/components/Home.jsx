import { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import CookiesDisplay from "./CookiesDisplay";
import LanguageSelector from "./LanguageSelector";
function Home() {
	const [h2Tag, seth2Tag] = useState("");
	const getHome = async () => {
		const fetchURL = `http://localhost:3000`;
		const requestOptions = {
			method: "GET",
			credentials: "include", // 🔥 Required to send cookies
			mode: "cors",
		};
		const response = await fetch(fetchURL, requestOptions);
		console.log(response);
		if (response.ok) {
			const data = await response.json();
			console.log("Fetched home:", data.message);
			seth2Tag(data.message);
		} else {
			console.error("Failed to fetch Home:", response.status);
		}
	};
	useEffect(() => {
		getHome();
	}, []);

	return (
		<>
			<h4>{h2Tag}</h4>
			<img src={Logo} alt="Pokemon Logo" />
			<div>
				<CookiesDisplay />
			</div>
			<div> </div>
		</>
	);
}

export default Home;
