import {pokemonDatabase } from "./pokemonDatabase.js";

// Callbacks
// Step 3 : create fetchPokemon()
// Step 3.2 : Declare a variable called fetchTime 
//            and initialize it to a random number between 1 and 500.
function fetchPokemon() {
    const fetchTime = Math.floor(Math.random() * 500) + 1;
    setTimeout(() => {
        // End the timer after all operations complete
        console.timeEnd("Sequential Operations with Callbacks");
        console.log(pokemonDatabase);
    }, fetchTime);
}

// Step 4-8 :  create function createPokemon(pokemon)

// function createPokemon(pokemon){
//     const createTime = Math.floor(Math.random() * 500) + 1;
//     setTimeout(() => {
//         pokemonDatabase.push(pokemon);
//     }, createTime);
// }

// createPokemon({ name: "Pikachu", type: "Electric" });
// createPokemon({ name: "Genger", type: "ghost" });
// fetchPokemon();

/**
 * About run that, sometime display 5 objects, sometime dsplay 4 objects, sometime are 3 object
 * This is because we’re using random values for fetchTime and createTime. 
 * If createTime is greater than fetchTime, it means that the createPokemon function 
 * will take longer to run. If it takes longer to run than fetchPokemon, 
 * then it should make sense that when fetchPokemon prints, it does not have the new Pokemon 
 * inside of pokemonDatabase to print, so it only prints the original three.
 * How to fix that ? 
 * use callback!!!
 */

function createPokemon(pokemon, callback) {
    const createTime = Math.floor(Math.random() * 500) + 1;
    setTimeout(() => {
        pokemonDatabase.push(pokemon);
        if (callback) callback(); // Call the next operation
    }, createTime);
}
// Start the timer
console.time("Sequential Operations with Callbacks");
createPokemon({ name: "Pikachu", type: "Electric" }, () =>{
    createPokemon({ name: "Genger", type: "ghost" },() =>{
        createPokemon({ name: "Alakazam", type: "Psychic" },() =>{
            createPokemon({ name: "Gengar", type: "ghost" },() =>{
                createPokemon({ name: "Dragonite", type: "Dragon" },fetchPokemon);
            });
        });
    });
});

