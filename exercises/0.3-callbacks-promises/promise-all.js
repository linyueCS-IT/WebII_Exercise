import {pokemonDatabase } from "./pokemonDatabase.js";

function fetchPokemon(){
    const fetchTime = Math.floor(Math.random() * 500) + 1 ;
    setTimeout(() =>{
        console.log(pokemonDatabase)
    },fetchTime);
}

function createPokemon(pokemon){
    return new Promise( (resolve ,reject) =>{
        const createTime = Math.floor(Math.random() * 500 ) + 1;
        setTimeout(() =>{
            pokemonDatabase.push(pokemon);
            resolve(pokemon);
        },createTime);
    })
}

const pokemonPromises =
[
    createPokemon({ name: "Pikachu", type: "Electric" }),
    createPokemon({ name: "Eevee", type: "Normal" }),
    createPokemon({ name: "Alakazam", type: "Psychic" }),
    createPokemon({ name: "Gengar", type: "ghost" }),
    createPokemon({ name: "Gengar", type: "ghost" })
]
// Start the timer
console.time("Simultanaeous Operations with Promise Chaining")
Promise.all(pokemonPromises)
.then(() =>{
    fetchPokemon();
    // End the timer after all operations complete
    console.timeEnd("Simultanaeous Operations with Promise Chaining")
})