/**
 * Import required modules from Express and the model file.
 * - Request and Response are types from Express used for handling HTTP requests and responses.
 * - getOne, getAll, and addOne are functions from the model that interact with the database.
 */
import { Request, Response } from "express";
import { getOne, getAll, addOne, deleteOne, updateOnePokemon } from "./model";
import { ObjectId } from "mongodb";
import { FILE } from "dns";

/**
 * TODO: Copy the route handling logic from the previous exercise
 * into these functions. You will need to use the data from
 * the model.ts file to handle the requests.
 */

/**
 * Handles the root route.
 * Responds with a simple welcome message.
 */
export const getHome = (req: Request, res: Response) => {
	res.status(200).json({ message: "Hello from the Pokemon Server!" });
};

/**
 * Handles GET requests to /pokemon.
 * Retrieves all Pokemon from the database and sends them as a response.
 */
export const getAllPokemon = async (req: Request, res: Response) => {
	try {
		const pokemonCollection = await getAll(); // Get collection
		const filterType = req.query.type?.toString().toLowerCase();
		const sortByResult = req.query.sortBy?.toString().toLowerCase();
		if (pokemonCollection) {
			const pokemons = await pokemonCollection.find().toArray(); // Fetch pokemons as an array
			if (filterType) {
				const filterPokemon = pokemons.filter(
					(pokemon) =>
						pokemon.type.toLowerCase() === filterType.toLowerCase(),
				);
				if (filterPokemon.length > 0) {
					console.log(`get ${filterType} Pokemon:\n`);
					filterPokemon.forEach((pokemon) => console.log(pokemon));
					res.status(200).json({
						Message: `Get ${filterType} type Pokemon:`,
						filterPokemon,
					});
				} else {
					console.log("Pokemon not found!");
					res.status(404).json({ Message: "Pokemon not found!" });
					return;
				}
			} else {
				if (sortByResult && sortByResult === "name") {
					console.log(`Get all Pokemon order by ${sortByResult}:\n`);
					pokemons.sort((a, b) => a.name.localeCompare(b.name));
					pokemons.forEach((pokemon) => console.log(pokemon));
					res.status(200).json(pokemons);
				} else {
					pokemons.forEach((pokemon) =>
						console.log("Get all Pokemon:\n", pokemon),
					);
					res.status(200).json(pokemons);
				}
			}
		} else {
			res.status(400).json({
				success: false,
				message: "Pokemon Collection does not exists",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Handles GET requests to /pokemon/:id
 * Fetches a single Pokemon by its ID.
 */
export const getOnePokemon = async (req: Request, res: Response) => {
	// console.log(`Getting one Pokemon by ID `);
	try {
		const pokemonId = req.params.id; // Extract ID from request parameters

		if (!pokemonId) {
			console.log("Pokemon does not exists");
			res.status(400).json({
				success: false,
				message: "Pokemon does not exists",
			});
		}
		const foundPokemon = await getOne(pokemonId); // Get collection

		if (!foundPokemon) {
			console.log("Pokemon not found");
			res.status(404).json({
				success: false,
				message: "Pokemon not found",
			});
		}
		console.log("Get Pokemon:\n", foundPokemon);
		res.status(200).json({
			success: "Pokemon Found",
			foundPokemon,
		});

		/** TODO Return appropriate server responses -done */
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * POST /pokemon - Adds a new Pokemon to the database.
 */
export const createPokemon = (req: Request, res: Response) => {
	console.log(`Adding a new Pokemon `);
	try {
		const newPokemon = req.body;
		addOne(newPokemon);
		console.log(newPokemon);
		res.status(200).json({
			success: "new pokemon added",
			newPokemon,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * PUT /pokemon/:id - Updates an existing Pokemon by its ID.
 */
export const updatePokemon = async (req: Request, res: Response) => {
	try {
		const pokemonId = req.params.id;
		const updateData = req.body;
		const updatedPokemon = await updateOnePokemon(pokemonId, updateData);

		console.log(`Update a Pokemon `);
		console.log(updatedPokemon);

		res.status(200).json({
			success: "pokemon updated",
			updatedPokemon,
		});
	} catch (error) {
		console.error("Error updating Pokemon:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

/**
 * DELETE /pokemon/:id - Deletes a Pokemon from the database by its ID.
 */
export const deletePokemon = async (req: Request, res: Response) => {
	console.log(`Delete a Pokemon `);
	try {
		const pokemonId = req.params.id;
		// Check id valid
		if (!ObjectId.isValid(pokemonId)) {
			res.status(400).json({ message: "Invalid Pokemon ID!" });
			return;
		}
		const foundPokemon = await getOne(pokemonId);
		if (!foundPokemon) {
			res.status(404).json({ Message: "Pokemon not found!" });
			return;
		}
		await deleteOne(pokemonId);
		console.log("pokemon deleted!\n");
		res.status(200).json({
			success: "pokemon deleted",
		});
	} catch (error) {
		console.error("Error deleting Pokemon:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

/**
curl -v -X POST -H "Content-Type: application/json" -d '{"name": "Bulbasaur", "type": "Grass"}' http://localhost:3000/pokemon
curl -v http://localhost:3000/pokemon/67dcdf8bdef280c3ab9f7562
curl -v -X PUT -H "Content-Type: application/json" -d '{"type": "Poison"}' http://localhost:3000/pokemon/curl -v http://localhost:3000/pokemon/67dcdf8bdef280c3ab9f7562
curl -v http://localhost:3000/pokemon
curl -v -X DELETE http://localhost:3000/pokemon/67dcdf8bdef280c3ab9f7562
curl -v http://localhost:3000/pokemon?type=Water 
curl -v http://localhost:3000/pokemon?type=Electric
curl -v http://localhost:3000/pokemon?sortBy=name
 */
