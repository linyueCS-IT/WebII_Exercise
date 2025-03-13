import { fetchPokemon, createPokemon } from "../src/app";
import { database } from "./../src/model";

describe("Pokemon CRUD Operations", () => {
	///* Make sure the database is empty before each test.  This runs before each test.  See https://jestjs.io/docs/api */

	beforeEach(() => {
		// Reset the database before each test to ensure tests are isolated
		database.length = 0;
		// database.push({ name: "Pikachu", type: "Electric" });
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
}); //eof test suite
