import {pokemonDatabase } from "./pokemonDatabase.js";
/**
 * Async/Await
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
// Start the timer
console.time("Sequentinal Operations with Async-Await");
async function createAllPokemon(){
    await createPokemon({ name: "Pikachu", type: "Electric" });
    await createPokemon({ name: "Eevee", type: "Normal" })
    await createPokemon({ name: "Alakazam", type: "Psychic" });
    await createPokemon({ name: "Gengar", type: "ghost" });
    await createPokemon({ name: "Dragonite", type: "Dragon" });
    fetchPokemon();
    console.timeEnd("Sequentinal Operations with Async-Await");
}

createAllPokemon()
