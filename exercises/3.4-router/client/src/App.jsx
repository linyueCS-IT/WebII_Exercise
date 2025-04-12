import React from "react";
import "./App.css";
import Home from "./component/Home";
import NavBarOld from "./component/NavBarOld";
import About from "./component/About";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pokemon from "./component/Pokemon";
// ========================================1st step ========================================
// export default function App() {
// 	return (
// 		<div className="container">
// 			<article>
// 				<hgroup>
// 					<div>
// 						<h1>Hi friend ! </h1>
// 					</div>
// 				</hgroup>
// 			</article>
// 		</div>
// 	);
// }
// =======================================the 2nd step =========================================
// export default function App() {
// 	let component;
// 	//log this to understand the what it returns
// 	console.log(window.location);
// 	console.log("debug test!");

// 	switch (window.location.pathname) {
// 		case "/":
// 			component = <Home />;
// 			break;
// 		case "/about":
// 			component = <About />;
// 			break;
// 	}
// 	return (
// 		<>
// 			<article>
// 				<NavBarOld />
// 				{component}
// 			</article>
// 		</>
// 	);
// }
// =======================================the third step=========================================
export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/profile/:username" element={<Pokemon />} />
			</Routes>
		</Router>
	);
}
