import React from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import MainHeader from "./components/MainHeader";
import { useState } from "react";
import Counter from "./components/Counter";

function App() {
	const [myPokemons, setMyPokemons] = useState([
		"Charmander",
		"Bulbasaur",
		"Squirtle",
		"Rhydon",
	]);
	//event handler to add new value to existing array of pokemons
	const addPokemon = (newPokemon) => {
		setMyPokemons([...myPokemons, newPokemon]);
	};
	const changeColor = () => {
		const colors = ["white", "steelblue", "pink", "yellow", "purple"];
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		// setBgColor("pink");
		setBgColor(randomColor);
	};
	const [name, setName] = useState("Charmander");
	// Example 1.Using useState for a Counter
	const [count, setCount] = useState(0);
	const [newPokemon, setNewPokemon] = useState("Ivysauri");
	const [bgColor, setBgColor] = useState("white");

	const eventHandler = (e) => {
		setName(e.target.value);
	};

	return (
		<div
			className="container"
			style={{ backgroundColor: bgColor, padding: "20px" }}
		>
			{/* <h2>Counter: {count}</h2> */}
			<Counter count={count} />
			<button onClick={() => setCount(count + 1)}>Increase</button>
			<button onClick={() => setCount(count - 1)}>Decrease</button>
			<article>
				<hgroup>
					<div>
						<MainHeader />{" "}
					</div>
				</hgroup>
				<h2>Meet my Pokemon: {name}</h2>
				<input type="text" value={name} onChange={eventHandler} />

			</article>
			<PokemonList pokemons={myPokemons} />
			<article>
				<input
					type="text"
					value={newPokemon}
					onChange={(e) => setNewPokemon(e.target.value)}
				/>
			</article>
			<button onClick={() => addPokemon(newPokemon)}>Add Pokemon</button>
			<button onClick={() => changeColor()}>Change Color</button>
		</div>
	);
}

export default App;
