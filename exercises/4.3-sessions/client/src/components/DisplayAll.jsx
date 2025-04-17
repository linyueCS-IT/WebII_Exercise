import { useState, useEffect } from "react";

export default function DisplayAll() {
	const [pokemon, setPokemon] = useState([]);
	const getAll = async () => {
		const fetchURL = `http://localhost:3000/pokemon`;
		const requestOptions = {
			method: "GET",
			credentials: "include", // 🔥 Required to send cookies
			mode: "cors",
		};
		const response = await fetch(fetchURL, requestOptions);
		console.log(response);
		if (response.ok) {
			const data = await response.json();
			console.log("Fetched pokes:", data.payload);
			setPokemon(data.payload);
		} else {
			console.error("Failed to fetch pokemon:", response.status);
		}
	};
	useEffect(() => {
		getAll();
	}, []);
	return (
		<div>
			<h4>List of all the Pokemons</h4>

			<table>
				<tbody>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Type</th>
					</tr>
					{pokemon.map((poke) => (
						<tr key={poke.id}>
							<td>{poke.id}</td>
							<td>{poke.name}</td>
							<td>{poke.type}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
