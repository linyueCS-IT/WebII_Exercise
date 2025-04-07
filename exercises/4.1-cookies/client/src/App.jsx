import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import DisplayAll from "./components/DisplayAll";
import DisplayOne from "./components/DisplayOne";
import Footer from "./components/Footer";

function App() {
	return (
		<>
			<Router
				future={{
					v7_startTransition: true,
				}}
			>
				<div>
					<NavBar />

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/list-one" element={<DisplayOne />} />
						<Route path="/list-all" element={<DisplayAll />} />
					</Routes>
				</div>
				<Footer />
			</Router>
		</>
	);
}

export default App;
