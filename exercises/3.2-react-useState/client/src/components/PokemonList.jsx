import React from "react"

const PokemonList = (props) =>{
	return (
		<ul>
			{props.pokemons.map((pokemon, index) => (
			<li key={index}>{pokemon}</li>
			))}
	  	</ul>
	)
}

export default PokemonList;