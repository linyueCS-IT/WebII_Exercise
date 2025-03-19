/**
 * Model for the Pokemon. This is a simplified version of an actual
 * model that may be used in a larger application. The database is
 * represented as an array of Pokemon objects and is reset every time
 * the server restarts.
 */
import { Collection, ObjectId, MongoClient, MongoError } from "mongodb";
import { updatePokemon } from "./controller";

// Database connection parameters
const hostname = "127.0.0.1";
const DATABASE_NAME = "mydatabase";
let pokemonCollection: Collection<Pokemon> | undefined;
let client: MongoClient;

/**
 * Interface representing a Pokemon object.
 */
export interface Pokemon {
	name: string;
	type: string;
}

/**
 * In-memory database representation.
 * This array will be the intial document added to our collection of Pokemon.
 */
export const database: Pokemon[] = [{ name: "Pikachu", type: "Electric" }];

/**
 * Initializes the connection to the MongoDB database.
 *
 * - Establishes a connection using environment variables for authentication.
 * - Creates the "pokemon" collection if it does not already exist.
 * - Inserts initial Pokemon data if the collection is empty.
 */
export async function initDB() {
    try {
        const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_HOST}/`;

        // Initialize MongoDB client
        client = new MongoClient(url);
        await client.connect();
        console.log("Connected to MongoDb");

        const db = client.db(DATABASE_NAME);

		// Get the list of existing collections in the database
		const collections = await db.listCollections().toArray();
		const collectionNames = collections.map((col) => col.name);

		// Create "pokemon" collection if it does not exist
		if (!collectionNames.includes("Pokemon")) {
			console.log('Creating "pokemon" collection...');
			await db.createCollection("pokemon");
		}

		// Reference to the "pokemon" collection
		pokemonCollection = db.collection("pokemon");    
		
		// Check if the collection is empty and insert initial data if needed
		const userCount = await pokemonCollection.countDocuments();

		if (userCount === 0) {
			console.log("Inserting initial pokemons...");
			await pokemonCollection.insertMany(database);
		}

    } catch (err) {
        if (err instanceof MongoError) {
            console.error("MongoDB connection failed:", err.message);
            throw err;
        } else {
            console.error("Unexpected error:", err);
            throw err;
        }
    }
}

/**
 * Retrieves all Pokemon records from the database.
 * @returns The collection of Pokemon objects or undefined if not initialized.
 */
export async function getAll(): Promise<Collection<Pokemon> | undefined> {
	return pokemonCollection;
}


/**
 * Retrieves a single Pokemon by its unique ID.
 * @param id - The ID of the Pokemon to retrieve.
 * @returns The Pokemon object if found, otherwise undefined.
 */
export async function getOne(id: string): Promise<Pokemon | undefined> {
	const findPokemon = await pokemonCollection?.findOne({_id: new ObjectId(id)});
	//pokemonCollection? (Optional Chaining) If pokemonCollection is undefined, findOne() will not run, and the function will return undefined.
	return findPokemon!;
}

/**
 * Adds a new Pokemon to the database.
 * @param pokemon - The Pokemon object to add.
 */
export async function addOne(pokemon: Pokemon) {
	await pokemonCollection?.insertOne(pokemon);
}

/**
 * Updates an existing Pokémon in the database.
 *
 * @param {string} pokemonId - The ID of the Pokemon to update.
 * @param {Partial<Pokemon>} updatedData - An object containing the fields to update.
 * @returns {Promise<Pokemon | undefined>} - The updated Pokémon object if found, otherwise undefined.
 *
 * This function:
 * - Searches for a Pokdmon by its ID.
 * - Updates only the specified fields using MongoDB's `$set` operator.
 * - Returns the updated Pokémon document after modification.
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
 */
export async function updateOnePokemon(
	pokemonId: string,
	updatedData: Partial<Pokemon>,
): Promise<Pokemon | undefined> {
	// Check if the Pokemon exists in database
	const existPokemon = await getOne(pokemonId);
	if (!existPokemon){
		console.log("Pokemon not found");
	}

	const updatedPokemon = await pokemonCollection?.findOneAndUpdate(
		// {"_id.$" : pokemonId}, // Find the Pokemon by id
		{_id: new ObjectId(pokemonId)},
		{$set: updatedData},
		{returnDocument: "after"},
	);
	console.log(updatePokemon);
	// console.log(updatePokemon.value);
	return updatedPokemon?.value!;
}

/**
 * Deletes a new Pokemon to the database.
 *  @param id - The ID of the Pokemon to delete.
 */
export async function deleteOne(pokemonId: string) {}
