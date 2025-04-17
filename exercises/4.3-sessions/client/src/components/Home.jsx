import { Navigate } from "react-router-dom";
import Logo from "/assets/Logo.png";
import { useNavigate } from "react-router-dom";
// import Login from "./Login";

import { useEffect, useState } from "react";


function Home({ heading }) {
	const [userName, setUserName] = useState("");

	const [header, setHeader] = useState(heading);

	const login = async () => {};

	//const logOut = async () => {};

	// useEffect(() => {
	// 	setHeader(isLoggedIn ? message : heading);
	// }, [heading, message, isLoggedIn]);

	const handleLogin = () => {
		login();
		// Reset the input
	};

	console.log(heading);
	return (
		<>
			<h1>{header}</h1>

			<div>
				<img src={Logo} alt="Pokemon Logo" />
				{/* <Login />				 */}
			</div>
		</>
	);
}

export default Home;
