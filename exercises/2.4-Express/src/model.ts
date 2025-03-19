/**
 * Model for the Pokemon. This is a much smaller version of an actual
 * model that you've used in your assignment. The database is just an
 * array of Pokemon objects. Since it's only an array, it will be reset
 * every time the server restarts.
 */

export interface Pokemon {
	id: number;
	name: string;
	type: string;
}

export const database: Pokemon[] = [
	{ id: 1, name: "Pikachu", type: "Electric" },
	// { id: 2, name: "bulbasaur", type: "grass" },
	// { id: 3, name: "squirtle", type: "Water" },
	// { id: 4, name: "kakuna", type: "bug" },
	// { id: 5, name: "bulbasaur", type: "grass" },
	// { id: 6, name: "Gyarados", type: "Water" },
];
