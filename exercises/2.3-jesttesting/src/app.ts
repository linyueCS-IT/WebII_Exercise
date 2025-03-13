import { database } from "./model";

interface Pokemon {
	name: string;
	type: string;
}
/**
 * Fetches and logs the current list of Pokémon.
 * @returns a Promise<Pokemon[]>
 */
export async function fetchPokemon(): Promise<Pokemon[]> {
	console.log(database);
	return database;
}

/**
 * Adds a new Pokémon to the database.
 * @param pokemon - The Pokemon to add.
 * @returns a Promise resolving to the updated database length.
 */
export async function createPokemon(pokemon: Pokemon): Promise<number> {
	database.push(pokemon);
	return database.length;
}

/**
 * Adds a Pokémon to the database and returns the updated list.
 * @param pokemon - The Pokemon to add.
 * @returns a Promise resolving to the updated Pokémon list.
 */
export async function addPokemon(pokemon: Pokemon): Promise<Pokemon[]> {
	database.push(pokemon);
	return database;
}

/**
 * Updates an existing Pokémon if found in the database.
 * @param pokemon - The Pokemon to update.
 * @returns a Promise resolving to the database length.
 */
export async function updatePokemon(pokemon: Pokemon): Promise<Pokemon> {
	const index = database.findIndex((p) => p.name === pokemon.name);
	if (index !== -1) {
		database[index] = pokemon;
	} else {
		throw new Error("Pokemon not found");
	}
	return database[index];
}

/**
 * Deletes a Pokémon from the database if it exists.
 * @param pokemon - The Pokemon to delete.
 * @returns a Promise resolving to a message.
 */
export async function deletePokemon(pokemon: Pokemon): Promise<string> {
	const index = database.findIndex((p) => p.name === pokemon.name);
	if (index !== -1) {
		database.splice(index, 1);
		return "Pokemon Deleted";
	} else {
		throw new Error("Pokemon not found");
	}
}

(async () => {
	await createPokemon({ name: "Bulbasaur", type: "Grass" });
	await fetchPokemon();
})();
