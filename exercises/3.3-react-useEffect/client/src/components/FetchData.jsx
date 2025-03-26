import { useEffect, useState } from "react"
import PokemonList from "./PokemonList";
import React from "react";

const FetchData = () => {
    const [pokemon, setPokemon] = useState([]);

    async function fetchPokemon() {
        const response = await fetch("pokemonList.json");
        const data = await response.json();

        setPokemon(data);
    }

    useEffect(() => {
        fetchPokemon();
    }, []); //ensure its runs just once

    return (
        <div>
            <h4>List of Pokemon</h4>
            <PokemonList pokemons={pokemon} />
        </div>
    );
};

export default FetchData;
