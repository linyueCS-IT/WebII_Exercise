import { IncomingMessage, ServerResponse } from "http";
import { database } from "./model";

// GET /
export const getHome = (req: IncomingMessage, res: ServerResponse) => {
	// Set response headers
	res.statusCode = 200;

	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); //  Allow all origins
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "*"); //Allows all headers to be sent with cross-origin requests.
	res.setHeader("Access-Control-Allow-Credentials", "true"); //included this get access to cookies on clientside

	res.end(JSON.stringify({ message: "Welcome Guest!" }, null, 2));
};

// GET /pokemon
export const getAllPokemon = (req: IncomingMessage, res: ServerResponse) => {
	console.log("Get all pokemon");

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Allow all origins
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Request-Method", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true"); //included this get access to cookies on clientside

	res.end(
		JSON.stringify({ message: "All Pokemon", payload: database }, null, 2),
	);
};

// GET /pokemon/:id
export const getOnePokemon = (req: IncomingMessage, res: ServerResponse) => {
	const pokemonId = Number(req.url?.split("/")[2]);
	const foundPokemon = database.find((pokemon) => pokemon.id === pokemonId);

	if (foundPokemon) {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Allow this port

		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		res.setHeader("Access-Control-Request-Method", "*");
		res.setHeader("Access-Control-Allow-Headers", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true"); //included this get access to cookies on clientside

		res.end(
			JSON.stringify(
				{ message: "Pokemon found", payload: foundPokemon },
				null,
				2,
			),
		);
	} else {
		res.statusCode = 404;
		res.setHeader("Content-Type", "application/json");
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Allow this port

		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		res.setHeader("Access-Control-Request-Method", "*");
		res.setHeader("Access-Control-Allow-Headers", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true"); //included this get access to cookies on clientside
		res.end(JSON.stringify({ message: "Pokemon not found" }, null, 2));
	}
};

// POST /pokemon
export const createPokemon = async (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	const body = await parseBody(req);
	const newPokemon = {
		id: database.length + 1, // ID "auto-increment".
		name: body.name,
		type: body.type,
	};

	console.log("In create pokemon");
	database.push(newPokemon);

	res.statusCode = 201;
	res.setHeader("Content-Type", "application/json");

	//res.setHeader("Location", "/pokemon");

	res.end(JSON.stringify(newPokemon));
};

const parseBody = async (req: IncomingMessage) => {
	return new Promise<Record<string, string>>((resolve) => {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", () => {
			let parsedBody: Record<string, string>;

			if (
				req.headers["content-type"]?.includes("x-www-form-urlencoded")
			) {
				// application/x-www-form-urlencoded => name=Pikachu&type=Electric
				parsedBody = Object.fromEntries(
					new URLSearchParams(body).entries(),
				);
			} else {
				// application/json => {"name":"Pikachu","type":"Electric"}
				parsedBody = JSON.parse(body);
			}

			resolve(parsedBody);
		});
	});
};
