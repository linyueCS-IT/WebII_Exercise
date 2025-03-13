/**
 * Model for the Pokemon. The database is just an
 * array of Pokemon objects.
 */

export interface Pokemon {
	name: string;
	type: string;
}

export const database: Pokemon[] = [];

// { name: "Pikachu", type: "Electric" }
