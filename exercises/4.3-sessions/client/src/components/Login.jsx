import { useState } from "react";
//import { getCookie } from "cookies-next";
//import { useNavigate } from "react-router";
import Home from "./Home";

// function LoggedIn() {
// 	const session = getCookie("session_id") || {}; // Get sessionInfo from cookie
// 	console.log(session);
// 	if (session.data.loggedIn === true) {
// 		return true;
// 	}
// }
export default function Login() {
	//let navigate = useNavigate();
	const [userName, setUserName] = useState("");
	const [message, setMessage] = useState("");
	const [LoggedIn, setLoggedIn] = useState(false);

	const login = async () => {
		const fetchURL = `http://localhost:3000/login`;
		const requestOptions = {
			method: "POST",
			credentials: "include", // 🔥 Required to send cookies
			mode: "cors",
			body: JSON.stringify({
				username: userName,
			}),
		};
		const response = await fetch(fetchURL, requestOptions);

		if (response.ok) {
			const data = await response.json();

			if (data.session?.data?.isLoggedIn === true) {
				sessionStorage.setItem("userName", data.session.data.name);
				sessionStorage.setItem(
					"isLoggedIn",
					data.session.data.isLoggedIn
				);

				setLoggedIn(true);
				setMessage(data.message);
			} else {
				setMessage("Login failed.");
			}
		} else {
			console.error("Failed to log in:", response.status);
		}
	};

	const handleLogin = () => {
		login();
	};
	return (
		<div>
			{!LoggedIn && (
				<>
					<input
						type="text"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						placeholder="Enter username"
					/>

					<button onClick={handleLogin}>Login</button>
				</>
			)}
			{isLoggedIn && (
				<>
					<button onClick={handleLogout}>Logout</button>
				</>
			)}

			{LoggedIn && <Home heading={message} />}
		</div>
	);
}
