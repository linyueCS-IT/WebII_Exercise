import { useState } from "react";

import FetchOne from "./FetchOne";

export default function DisplayOne() {
	const [poke_Id, setPokeId] = useState(1);

	const inputHandler = (e) => {
		const value = e.target.value;
		setPokeId(value);
	};
	return (
		<div>
			<h1> Single Pokemon</h1>
			<input
				type="text"
				name="poke_id"
				onChange={inputHandler}
				placeholder="Enter Pokemon id"
				value={poke_Id}
			/>

			<br />
			<FetchOne pokeId={poke_Id} />
		</div>
	);
}
