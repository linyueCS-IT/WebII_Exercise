import React from "react";
import NavBarOld from "./NavBarOld";
import { useNavigate } from "react-router-dom";
export default function Home() {
	const navigate = useNavigate();
	return <button onClick={() => navigate("/about")}>Go to About</button>;
}
