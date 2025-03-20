import React from "react"
const PokemonList = (props) =>{
	return (
		<ul>
			{props.pokemons.map((pokemon) =>(
				<li > {pokemon}</li>
			))}
		</ul>
	)
}

export default PokemonList;