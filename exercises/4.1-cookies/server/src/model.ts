export interface Pokemon {
	id: number;
	name: { en: string; fr: string };
	type: { en: string; fr: string };
	info: { en: string; fr: string };
	image: string;
}

export const database: Pokemon[] = [
	{
		id: 1,
		name: { en: "Bulbasaur", fr: "Bulbizarre" },
		type: { en: "🌱 Grass", fr: "🌱 Plante" },
		info: {
			en: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
			fr: "Il a une plante sur le dos depuis la naissance. Elle grandit avec lui.",
		},
		image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
	},
	{
		id: 2,
		name: { en: "Charmander", fr: "Salamèche" },
		type: { en: "🔥 Fire", fr: "🔥 Feu" },
		info: {
			en: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
			fr: "Préfère les endroits chauds. Quand il pleut, de la vapeur sort de la pointe de sa queue.",
		},
		image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
	},
	{
		id: 3,
		name: { en: "Squirtle", fr: "Carapuce" },
		type: { en: "💧 Water", fr: "💧 Eau" },
		info: {
			en: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
			fr: "Après sa naissance, son dos enflera et durcira pour former une carapace. Crache des bulles avec puissance.",
		},
		image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
	},
];
