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
	res.status(200).json({database});
};


/** GET /pokemon/:id
 * curl -v http://localhost:3000/pokemon/1
 * curl -X http://localhost:3000/pokemon/1
 * @param req 
 * @param res 
 */
export const getOnePokemon = (req: Request, res: Response) => {
	console.log("get one");
	const urlParts = req.url.split('/');
	const pokemonId = parseInt(urlParts[1]);
	console.log(pokemonId);
	const foundPokemon = database.find( pokemon => pokemon.id === pokemonId)
	console.log(foundPokemon);
	res.status(200).json(foundPokemon);
};


/** POST /pokemon
 * curl -v -X POST -H "Content-Type: application/json" -d '{"name": "Bulbasaur", "type": "Grass"}' http://localhost:3000/pokemon
 * @param req 
 * @param res 
 */
export const createPokemon = (req: Request, res: Response) => {
	console.log("create pokemon");
	console.log(req.body);
	const newPokemon = req.body as Pokemon;
	newPokemon.id = database.length + 1; // Simple ID assignment         
	database.push(newPokemon);
	console.log(database);
	console.log("create pokemon successful!");
	res.status(201).json(newPokemon);
};

/** PUT /pokemon/:id
 * curl -v -X PUT -H "Content-Type: application/json" -d '{"type": "Poison"}' http://localhost:3000/pokemon/2
 * @param req 
 * @param res 
 */
export const updatePokemon = (req: Request, res: Response) => {

	res.status(200).json();
};

/** DELETE /pokemon/:id
 * curl -v -X DELETE http://localhost:3000/pokemon/1

 * @param req 
 * @param res 
 */
export const deletePokemon = (req: Request, res: Response) => {
	res.status(200).json();
};
