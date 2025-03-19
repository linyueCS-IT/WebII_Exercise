/**
 * Import required modules from Express and the model file.
 * - Request and Response are types from Express used for handling HTTP requests and responses.
 * - getOne, getAll, and addOne are functions from the model that interact with the database.
 */
import { Request, Response } from "express";
import { getOne, getAll, addOne, updateOnePokemon, deleteOne } from "./model";

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
	console.log("Get my all Pokemon");

	
};

/**
 * Handles GET requests to /pokemon/:id
 * Fetches a single Pokemon by its ID.
 */
export const getOnePokemon = async (req: Request, res: Response) => {
	console.log(`Getting one Pokemon by ID `);
	const pokemonId = req.params.id; // Extract ID from request parameters

	const foundPokemon = await getOne(pokemonId); // Get collection

	/** TODO Return appropriate server responses */
};

/**
 * POST /pokemon - Adds a new Pokemon to the database.
 */
export const createPokemon = (req: Request, res: Response) => {
	console.log(`Adding a new Pokemon `);
	const newPokemon = req.body;
	
	 

	/** TODO Return appropriate server responses */
};

/**
 * PUT /pokemon/:id - Updates an existing Pokemon by its ID.
 */
export const updatePokemon = async (req: Request, res: Response) => {
	try {
		/** Complete this section */
	} catch (error) {
		console.error("Error updating Pokemon:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

/**
 * DELETE /pokemon/:id - Deletes a Pokemon from the database by its ID.
 */
export const deletePokemon = async (req: Request, res: Response) => {
	try {
		/** Complete this section */
	} catch {
		console.error("Error deleting Pokemon:", Error);
		res.status(500).json({ message: "Internal server error" });
	}
};
