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
		const waterPokemon = database.filter(
			(pokemon) =>
				pokemon.type.toLocaleLowerCase() ===
				filterType.toLocaleLowerCase(),
		);
		waterPokemon.forEach((pokemon) => console.log(pokemon));
		res.status(200).json({
			Message: "Get water type pokemon",
			waterPokemon,
		});
	} else {
		database.forEach((data) => console.log(JSON.stringify(data)));
		res.status(200).json(database);
	}
};

/** GET /pokemon/:id
 * curl -v http://localhost:3000/pokemon/1
 * @param req
 * @param res
 */
export const getOnePokemon = (req: Request, res: Response) => {
	console.log("get one");
	// In Express.js, req.url does not include the host or domain part of the URL. It only contains the path and query string of the URL.
	// url is not http://localhost:3000/pokemon/1 -> "/pokemon/1"
	// Use req.params.id instead of req.url.split("/").
	// const urlParts = req.url.split("/");
	const pokemonId = Number(req.params.id);
	console.log(pokemonId);
	// Check id valid
	if (isNaN(pokemonId)) {
		res.status(400).json({ Message: "Invalid Pokémon ID!" });
		return;
	}

	const foundPokemon = database.find((pokemon) => pokemon.id === pokemonId);

	// Check Pokemon exist or not
	if (!foundPokemon) {
	}
	console.log(foundPokemon);
	res.status(200).json(foundPokemon);
};

/** POST /pokemon
 * curl -v -X POST -H "Content-Type: application/json" -d '{"name": "Bulbasaur", "type": "Grass"}' http://localhost:3000/pokemon
 * @param req
 * @param res
 */
export const createPokemon = (req: Request, res: Response) => {
	console.log("Create Pokémon");
	console.log(req.body);
	const newPokemon = req.body as Pokemon;
	newPokemon.id = database.length + 1; // Simple ID assignment
	database.push(newPokemon);
	console.log(database);
	console.log("Create Pokémon successful!");
	res.status(201).json(newPokemon);
};

/** PUT /pokemon/:id
 * curl -v -X PUT -H "Content-Type: application/json" -d '{"type": "Poison"}' http://localhost:3000/pokemon/2
 * curl -v -X PUT -H "Content-Type: application/json" -d '{"name": "Squirtle"}' http://localhost:3000/pokemon/2
 * @param req
 * @param res
 */
export const updatePokemon = (req: Request, res: Response) => {
	const pokemonId = Number(req.params.id);

	// Check id valid
	if (isNaN(pokemonId)) {
		res.status(400).json({ Message: "Invalid Pokémon ID!" });
		return;
	}

	const foundPokemonId = database.findIndex(
		(pokemon) => pokemonId === pokemon.id,
	);

	// Check if Pokémon exists
	if (foundPokemonId === -1) {
		res.status(404).json({ Message: "Pokémon not found!" });
		return;
	}

	const updateData = req.body as Pokemon;
	database[foundPokemonId] = {
		...database[foundPokemonId],
		...updateData,
	};
	res.status(200).json(database[foundPokemonId]);
};

/** DELETE /pokemon/:id
 * curl -v -X DELETE http://localhost:3000/pokemon/1

 * @param req 
 * @param res 
 */
export const deletePokemon = (req: Request, res: Response) => {
	const pokemonId = Number(req.params.id);
	// Check id valid
	if (isNaN(Number(pokemonId))) {
		res.status(400).json({ Message: "Invalid Pokémon ID!" });
		return;
	}

	const foundPokemonId = database.findIndex(
		(pokemon) => (pokemon.id = pokemonId),
	);
	// Check if Pokémon exists
	if (foundPokemonId === -1) {
		res.status(404).json({ Message: "Pokémon not found!" });
		return;
	}
	const deleteData = database[foundPokemonId];
	// way1
	database.splice(foundPokemonId, 1);
	// // way2
	// delete database[foundPokemonId];
	// // way3
	// const updateDatabase = database.filter(pokemon => pokemon.id !== foundPokemonId)
	console.log(`Pokemon deleted! ${JSON.stringify(deleteData)}`);
	console.log("Pokemon deleted!", deleteData);

	res.status(200).json({ Message: "Pokemon deleted!", deleteData });
};
