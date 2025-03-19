import { Request, Response } from "express";
import { database, Pokemon } from "./model";
import { isConstructorDeclaration } from "typescript";

/**
 * TODO: Copy the route handling logic from the previous exercise
 * into these functions. Make the necessary changes on the response of the express module.
 * You will need to use the array from the model.ts file to handle the requests.
 */

// GET /
export const getHome = (req: Request, res: Response) => {
	res.status(200).json({ message: "Hello from the Pokemon Server!" });
};

/** GET /pokemon
 * curl -v http://localhost:3000/pokemon
 * curl -v http://localhost:3000/pokemon?type=Water
 * curl -v http://localhost:3000/pokemon?sortBy=name
 * curl -v "http://localhost:3000/pokemon?sortBy=name&type=water"
 * curl http://localhost:3000/pokemon
 * curl http://localhost:3000/pokemon?type=Water
 * curl http://localhost:3000/pokemon?sortBy=name
 * curl "http://localhost:3000/pokemon?sortBy=name&type=water"
 * @param req
 * @param res
 */
export const getAllPokemon = (req: Request, res: Response) => {
	const filterType = req.query.type?.toString().toLowerCase();
	const sortByResult = req.query.sortBy?.toString().toLowerCase();

	if (sortByResult === "name") {
		database.sort((a, b) => a.name.localeCompare(b.name));
	}

	if (filterType) {
		const filterPokemon = database.filter(
			(pokemon) =>
				pokemon.type.toLocaleLowerCase() ===
				filterType.toLocaleLowerCase(),
		);
		if (filterPokemon.length > 0) {
			filterPokemon.forEach((pokemon) =>
				console.log("get Pokemon:\n", pokemon),
			);
			res.status(200).json({
				Message: `Get ${filterType} type Pokemon:`,
				filterPokemon,
			});
		} else {
			res.status(404).json({ Message: "Pokemon not found!" });
			return;
		}
	} else {
		database.forEach((data) =>
			console.log("Get all Pokemon:\n", JSON.stringify(data)),
		);
		res.status(200).json(database);
	}
};

/** GET /pokemon/:id
 * curl -v http://localhost:3000/pokemon/2
 * curl http://localhost:3000/pokemon/2
 * @param req
 * @param res
 */
export const getOnePokemon = (req: Request, res: Response) => {
	// In Express.js, req.url does not include the host or domain part of the URL. It only contains the path and query string of the URL.
	// url is not http://localhost:3000/pokemon/1 -> "/pokemon/1"
	// Use req.params.id instead of req.url.split("/").
	// const urlParts = req.url.split("/");
	const pokemonId = Number(req.params.id);
	// Check id valid
	if (isNaN(pokemonId)) {
		res.status(400).json({ Message: "Invalid Pokemon ID!" });
		return;
	}

	const foundPokemon = database.find((pokemon) => pokemon.id === pokemonId);

	// Check Pokemon exist or not
	if (!foundPokemon) {
		res.status(404).json({ Message: "Pokemon not found!" });
		return;
	}
	console.log("Delete Pokemon:\n", foundPokemon);
	res.status(200).json(foundPokemon);
};

/** POST /pokemon
 * curl -v -X POST -H "Content-Type: application/json" -d '{"name": "Bulbasaur", "type": "Grass"}' http://localhost:3000/pokemon
 * curl -X POST -H "Content-Type: application/json" -d '{"name": "Bulbasaur", "type": "Grass"}' http://localhost:3000/pokemon
 * @param req
 * @param res
 */
export const createPokemon = (req: Request, res: Response) => {
	// console.log(req.body);
	const newPokemon = {
		id: database.length + 1,
		name: req.body.name,
		type: req.body.type,
	} as Pokemon;
	// const newPokemon = req.body as Pokemon;
	// newPokemon.id = database.length + 1; // Simple ID assignment
	database.push(newPokemon);
	console.log("Create Pokemon successful!\n", newPokemon);
	console.log("Current database:\n", database);
	console;
	res.status(201).json(newPokemon);
};

/** PUT /pokemon/:id
 * curl -v -X PUT -H "Content-Type: application/json" -d '{"type": "Poison"}' http://localhost:3000/pokemon/2
 * curl -v -X PUT -H "Content-Type: application/json" -d '{"name": "Squirtle"}' http://localhost:3000/pokemon/2
 * curl -X PUT -H "Content-Type: application/json" -d '{"type": "Poison"}' http://localhost:3000/pokemon/2
 * curl -X PUT -H "Content-Type: application/json" -d '{"name": "Squirtle"}' http://localhost:3000/pokemon/2
 * @param req
 * @param res
 */
export const updatePokemon = (req: Request, res: Response) => {
	// Using req.params.id makes the semantics of the URL clearer, that the id is part of the resource
	// Can't use req.query.id
	/**
	 * To use req.params.id:
		- When the id is a resource identifier (e.g. to get a specific Pokmon).
		- When the URL path needs to contain id.
		To use req.query.id:
		- When id is a filter (for example, getting a subset of multiple Pokmon).
		- When id is optional
	 */
	const pokemonId = Number(req.params.id);

	// Check id valid
	if (isNaN(pokemonId)) {
		res.status(400).json({ Message: "Invalid Pokemon ID!" });
		return;
	}

	const foundPokemonId = database.findIndex(
		(pokemon) => pokemonId === pokemon.id,
	);

	// Check if Pokémon exists
	if (foundPokemonId === -1) {
		res.status(404).json({ Message: "Pokemon not found!" });
		return;
	}

	const updateData = req.body as Pokemon;
	database[foundPokemonId] = {
		...database[foundPokemonId],
		...updateData,
	};
	console.log(
		`Pokemon id: ${pokemonId} updated!!\n`,
		database[foundPokemonId],
	);
	res.status(200).json(database[foundPokemonId]);
};

/** DELETE /pokemon/:id
 * curl -v -X DELETE http://localhost:3000/pokemon/2
 * curl -X DELETE http://localhost:3000/pokemon/2
 * @param req
 * @param res
 */
export const deletePokemon = (req: Request, res: Response) => {
	const pokemonId = Number(req.params.id);
	// Check id valid
	if (isNaN(Number(pokemonId))) {
		res.status(400).json({ Message: "Invalid Pokemon ID!" });
		return;
	}

	const foundPokemonId = database.findIndex(
		(pokemon) => (pokemon.id = pokemonId - 1),
	);
	// console.log("delete id is ",foundPokemonId)
	// Check if Pokémon exists
	if (foundPokemonId === -1) {
		res.status(404).json({ Message: "Pokemon not found!" });
		return;
	}
	const deleteData = database[foundPokemonId];
	// way1
	database.splice(foundPokemonId, 1);
	// // way2
	// delete database[foundPokemonId];
	// // way3
	// const updateDatabase = database.filter(pokemon => pokemon.id !== foundPokemonId)
	console.log("Current database\n", deleteData);

	res.status(200).json({ Message: "Pokemon deleted!", deleteData });
};

// curl -X POST -H "Content-Type: application/json" -d '{"name": "Bulbasaur", "type": "Grass"}' http://localhost:3000/pokemon
// curl http://localhost:3000/pokemon/2
// curl -X PUT -H "Content-Type: application/json" -d '{"type": "Poison"}' http://localhost:3000/pokemon/2
// curl http://localhost:3000/pokemon
// curl -X DELETE http://localhost:3000/pokemon/2
// curl http://localhost:3000/pokemon?type=Water
// curl http://localhost:3000/pokemon?sortBy=name
// curl "http://localhost:3000/pokemon?sortBy=name&type=water"
