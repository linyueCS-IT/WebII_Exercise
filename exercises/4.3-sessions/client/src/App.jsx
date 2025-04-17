import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import DisplayAll from "./components/DisplayAll";
import DisplayOne from "./components/DisplayOne";
import Footer from "./components/Footer";
import MainPage from "./components/MainPage";
import IndexPage from "./components/Indexpage";
import LogOut from "./components/LogOut";

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
						<Route path="/" element={<MainPage />} />
						<Route path="/home" element={<Home />} />
						<Route path="/logout" element={<LogOut />} />
						<Route path="/list-one" element={<DisplayOne />} />
						<Route path="/list-all" element={<DisplayAll />} />
					</Routes>
					<Footer />
				</div>
			</Router>
		</>
	);
}

export default App;
