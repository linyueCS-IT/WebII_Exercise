import { useState } from "react";
import FindOne from "./FetchOne";

export default function DisplayOne() {
	const [poke_Id, setpokeId] = useState(1);

	const inputHandler = (e) => {
		const value = e.target.value;
		setpokeId(value);
	};
	return (
		<div>
			<h4> Single Pokemons</h4>
			<input
				type="text"
				name="poke_id"
				onChange={inputHandler}
				placeholder="Enter Pokemon id"
				value={poke_Id}
			/>

			<br />
			<FindOne pokeId={poke_Id} />
		</div>
	);
}
