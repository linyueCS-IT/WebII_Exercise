import { useState, useEffect } from "react";

import ShowView from "./ShowView";

export default function FetchOne({ pokeId }) {
	const [pokemon, setPokemon] = useState([]);

	const fetchPokemon = async () => {
		if (pokeId === "") return; // Do not show anything if input is empty
		const requestOptions = {
			method: "GET",
			credentials: "include", // 🔥 Required to send cookies
			mode: "cors",
		};
		try {
			const response = await fetch(
				`http://localhost:3000/pokemon/${pokeId}`,
				requestOptions
			);
			console.log(response.data);
			if (response.ok) {
				const data = await response.json();
				setPokemon(data.payload);
			} else if (response.status === 404) {
				// Pokemon not found
				setPokemon(null); // Clear any previous result
				console.warn("Pokemon not found");
			}
		} catch (error) {
			console.error("Error fetching Pokemon:", error);
		}
	};
	//Run once when component mounts
	useEffect(() => {
		if (!pokeId) return; // Avoid fetching if pokeId is empty

		fetchPokemon();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pokeId]);

	if (pokemon !== null) {
		return (
			<div>
				<ShowView pokemon={pokemon} />
			</div>
		);
	} else return <p>Pokemon not found</p>;
}
