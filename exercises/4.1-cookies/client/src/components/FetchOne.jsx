import { useState, useEffect } from "react";
import ShowView from "./ShowView";

export default function FindOne({ pokeId }) {
	const [pokemon, setPokemon] = useState([]);

	const fetchTodo = async () => {
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

			if (response.ok) {
				const data = await response.json();

				setPokemon(data.payload);
			}
		} catch (error) {
			console.error("Error fetching Pokemon:", error);
		}
	};
	//Run once when component mounts
	useEffect(() => {
		if (!pokeId) return; // Avoid fetching if Id is empty

		fetchTodo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pokeId]);

	if (pokeId !== null) {
		return (
			<div>
				<ShowView pokemon={pokemon} />
			</div>
		);
	} else return <p>Pokemon not found</p>;
}
