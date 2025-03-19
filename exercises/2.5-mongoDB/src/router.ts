import { Router } from "express";
import {
	createPokemon,
	deletePokemon,
	getAllPokemon,
	getOnePokemon,
	updatePokemon,
} from "./controller";

const pokemonRouter: Router = Router();

pokemonRouter.get("/", getAllPokemon); // Get all Pokemon

pokemonRouter.get("/:id", getOnePokemon);

pokemonRouter.post("/", createPokemon);

pokemonRouter.put("/:id", updatePokemon);

pokemonRouter.delete("/:id", deletePokemon);

export default pokemonRouter;
