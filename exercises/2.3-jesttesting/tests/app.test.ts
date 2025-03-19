import {
	fetchPokemon,
	createPokemon,
	addPokemon,
	updatePokemon,
	deletePokemon,
} from "../src/app";
import { database } from "./../src/model";
import { fetchPokemonWithError } from "../src/app";

// npm test --testNamePattern = "Pokemon was created"

describe("Pokemon CRUD Operations", () => {
	///* Make sure the database is empty before each test.  This runs before each test.  See https://jestjs.io/docs/api */

	beforeEach(() => {
		// Reset the database before each test to ensure tests are isolated
		database.length = 0;
		// database.push({ name: "Pikachu", type: "Electric" });
	});

	test("Pokemon was created", async () => {
		const initialLength = database.length;
		const newLength = await createPokemon({
			name: "Pikachu",
			type: "Electric",
		});
		expect(newLength).toBe(1);

		expect(database).toContainEqual({ name: "Pikachu", type: "Electric" });
	});

	test("Pokemon retrieve Pokemon after adding", async () => {
		const pokemon = { name: "Pikachu", type: "Electric" };
		await createPokemon(pokemon);
		const result = await fetchPokemon();
		expect(result).toEqual([{ name: "Pikachu", type: "Electric" }]);
	});

	test("Fetch Pokemon from database", async () => {
		database.push({ name: "Pikachu", type: "Electric" });
		const result = await fetchPokemon();
		expect(result).toEqual([{ name: "Pikachu", type: "Electric" }]);
	});

	test("fetchPokemonWithError throws an error", async () => {
		await expect(fetchPokemonWithError()).rejects.toThrow(
			"Failed to fetch Pokemon",
		);
	});

	test("Update Pokemon", async () => {
		database.push({ name: "Pikachu", type: "Electric" });
		const updateData = { name: "Pikachu", type: "Water" };
		const result = await updatePokemon(updateData);
		expect(result).toEqual({ name: "Pikachu", type: "Water" });
	});

	test("UpdatePokemon throws error if Pokemon is not found", async () => {
		const updateData = { name: "NonExistentPokemon", type: "Snow" };
		await expect(updatePokemon(updateData)).rejects.toThrow(
			"Pokemon not found",
		);
	});

	test("Delete Pokemon", async () => {
		database.push({ name: "Pikachu", type: "Electric" });
		const deleteDate = { name: "Pikachu", type: "Electric" };
		const result = await deletePokemon(deleteDate);
		expect(result).toEqual("Pokemon Deleted");
	});

	test("DeletePokemon throw error if if Pokemon is not found", async () => {
		const deleteData = { name: "NonExistentPokemon", type: "Snow" };
		await expect(deletePokemon(deleteData)).rejects.toThrow(
			"Pokemon not found",
		);
	});
}); //eof test suite
