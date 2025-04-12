import React from "react";

const PokemonList = ({ pokemons }) => {
	return (
		<ul>
			{pokemons.map((pokemon) => (
				<li key={pokemon.id}>{pokemon.name}</li>
			))}
		</ul>
	);
};

export default PokemonList;
