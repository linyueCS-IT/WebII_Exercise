import {pokemonDatabase } from "./pokemonDatabase.js";
/**
 * Promise
 */
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

// Step 5: use consolo.time() as timer
// Start the timer
console.time("Sequential Operations with Promise Chaining");
createPokemon({ name: "Pikachu", type: "Electric" })
    .then(() => createPokemon({ name: "Eevee", type: "Normal" }))
    .then(() => createPokemon({ name: "Alakazam", type: "Psychic" }))
    .then(() => createPokemon({ name: "Gengar", type: "ghost" }))
    .then(() => createPokemon({ name: "Dragonite", type: "Dragon" }))
    .then(() => { 
        fetchPokemon();
        console.timeEnd("Sequential Operations with Promise Chaining");
    })
    .catch(error => console.error('Error:', error));

