import React, { useState, useEffect } from "react";
import "./App.css";
import MainHeader from "./components/MainHeader";
import FetchData from "./components/FetchData";
import Clock from "./components/Clock";

function App() {
	const [pokemonId, setPokemonId] = useState(1);
	const [selectedPokemon, setSelectedPokemon] = useState(null);
	const [showClock, setShowClock] = useState(true);

	useEffect(() => {
		const fetchSelectedPokemon = async () => {
			const response = await fetch("pokemonList.json");
			const data = await response.json();
			const pokemon = data.find((p) => p.id === pokemonId);
			setSelectedPokemon(pokemon);
		};

		fetchSelectedPokemon();
	}, [pokemonId]);

	const handleFetchNewPokemon = () => {
		setPokemonId((prevId) => (prevId % 4) + 1); // Cycle through Pokémon IDs
	};

	return (
		<div className="App">
			<MainHeader />
			<h2>Selected Pokémon</h2>
			{selectedPokemon ? (
				<div>
					<h3>{selectedPokemon.name}</h3>
					<p>Type: {selectedPokemon.type}</p>
				</div>
			) : (
				<p>Select a Pokémon</p>
			)}
			<FetchData />
			<button onClick={handleFetchNewPokemon}>Fetch New Pokémon</button>
			<button onClick={() => setShowClock(!showClock)}>
				Toggle Clock
			</button>
			{showClock && <Clock />}
		</div>
	);
}

export default App;
