import React from "react"

const PokemonList = (props) =>{
	return (
		<ul>
			{props.pokemons.map((pokemon) =>(
				<li key={pokemon.id}>
				{""}
				{pokemon.name} 
				{pokemon.type} 
				{""}
			</li>
			))}			
	  	</ul>
	);
}

export default PokemonList;