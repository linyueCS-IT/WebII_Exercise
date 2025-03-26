import React from "react"

const PokemonList = (props) =>{
	return (
		// <ul>
		// 	{/* {props.pokemons.map((pokemon) =>(
		// 		<li > {pokemon}</li>
		// 	))} */}
		// </ul>
		<ul>
			{props.pokemons.map((pokemon, index) => (
			<li key={index}>Welcome {pokemon}</li>
			))}
	  	</ul>
	)
}

export default PokemonList;