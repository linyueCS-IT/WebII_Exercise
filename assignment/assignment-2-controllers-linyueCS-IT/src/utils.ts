export const camelToSnake = (camelCase: string): string => {
	return camelCase.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
};

export const snakeToCamel = (snakeCase: string): string => {
	return snakeCase
		.toLowerCase()
		.split("_")
		.map((word, index) => {
			return index === 0
				? word
				: word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join("");
};

export const convertToCase = (
	stringConverter: (key: string) => string,
	obj: Record<string, any>,
): Record<string, any> => {
	const newObj: Record<string, any> = {};

	for (const key in obj) {
		// Makes sure we don't go down the prototype chain.
		if (obj.hasOwnProperty(key)) {
			newObj[stringConverter(key)] = obj[key];
		}
	}

	return newObj;
};
