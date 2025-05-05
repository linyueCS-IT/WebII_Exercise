import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import DisplayAll from "./components/DisplayAll";
import DisplayOne from "./components/DisplayOne";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import About from "./components/About";
import NewPokemon from "./components/NewPokemon";

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
						<Route path="/about" element={<About />} />
						<Route path="/new" element={<NewPokemon />} />
						<Route path="/list-one" element={<DisplayOne />} />
						<Route path="/list-all" element={<DisplayAll />} />
						{/* Catch-all route for 404 page */}
						<Route path="*" element={<NotFound />} />
					</Routes>
					<Footer />
				</div>
			</Router>
		</>
	);
}

export default App;
