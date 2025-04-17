import { get, IncomingMessage, ServerResponse } from "http";
import { database } from "./model";
import { createSession, getCookies, getSession, sessions } from "./session";

//for Filtering and Sorting
// import { URL } from "url";

/**
 * All of these function have a TODO comment. Follow the steps in the
 * instructions to know which function to work on, and in what order.
 */

// GET /
export const getHome = (req: IncomingMessage, res: ServerResponse) => {
	/**
	 * 1. Get the session object from the request using the getSession function.
	 * 2. Set the response status code to 200.
	 * 3. Set the response header "Content-Type" to "text/html".
	 * 4. Set the response header "Set-Cookie" to the session id.
	 * 5. End the response by rendering the HomeView template.
	 */

	//For Part1 only get session

	
	// const cookies = getCookies(req);
	// console.log("Parsed cookies:", cookies);
	const session = getSession(req);
	console.log("Session:", session);
	const sessionId = session["id"];

	console.log("Session:", sessionId);

	res.setHeader("Set-Cookie", [
        `session_id=${sessionId}`,
    ]);
	// const sessionId = getCookies(req)["session_id"];
	// console.log("session id: ",sessionId);

	
	// Set response headers
	res.statusCode = 200;
	
	//CORS (Cross-Origin Resource Sharing) Headers
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); //  Allow all access to client app
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "*"); //Allows all headers to be sent with cross-origin requests.
	res.setHeader("Access-Control-Allow-Credentials", "true"); //included this get access to cookies on clientside
	// For Part 1 only Set cookies

	// Send JSON response
	res.end(JSON.stringify({ message: "Welcome Guest!" }, null, 2));
};

export const login = async (req: IncomingMessage, res: ServerResponse) => {
	/**
	 * 1. Create the session ID using the createSession function.
	 * 2. Parse the request body to get the user's name.
	 * 3. Set the session data isLoggedIn to true.
	 * 4. Set the session data name to the user's name.
	 * 5. Set the response status code to 200.
	 * 6. Set the response header "Set-Cookie" to the session id.
	 * 7. End the response. Update the message to include the username and send the session info 
	 */
	console.log("/login");


	// create session
	

	// Update session data
	
    //set header info
	
	//CORS (Cross-Origin Resource Sharing) Headers
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); //  Allow this port origins
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Request-Method", "*");
	res.setHeader("Access-Control-Allow-Headers", "*"); //Allows all headers to be sent with cross-origin requests.
	res.setHeader("Access-Control-Allow-Credentials", "true"); //included this get access to cookies on clientside

    //setCookie with the new session id
	

	// Send response, send a Welcome with usenname message.
	res.end(
		JSON.stringify(
			{ message: `Welcome  !` },
			null,
			2,
		),
	);
	//res.end();
};

export const logout = async (req: IncomingMessage, res: ServerResponse) => {
	/**
	 * 1. Get the session object from the request using the getSession function.
	 * 2. Set the cookie to expire by setting the Expires attribute to a date in the past.
	 * 3. Set the response status code to 303.
	 * 4. Set the response header "Location" to "/".
	 * 5. Set the response header "Set-Cookie" to the session id with the expiration date.
	 * 6. End the response.
	 */

	

	res.statusCode = 200;
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); //  Allow this port origins
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Request-Method", "*");
	res.setHeader("Access-Control-Allow-Headers", "*"); //Allows all headers to be sent with cross-origin requests.
	res.setHeader("Access-Control-Allow-Credentials", "true"); //included this get access to cookies on clientside
	
	//setCookies,
	

	res.end();
};

// GET /pokemon
export const getAllPokemon = (req: IncomingMessage, res: ServerResponse) => {
	/**
	 * 1. Get the session object from the request using the getSession function.
	 * 2. Set the response status code to 200.
	 * 3. Set the response header "Content-Type" to "text/html".
	 * 4. Set the response header "Set-Cookie" to the session id.
	 * 5. End the response by rendering the ListView template.
	 *    Pass the title "All Pokemon", the database of pokemon, and the session data isLoggedIn.
	 * 6. In ListView.hbs, only display the form to create a new pokemon if the user is logged in.
	 */
	console.log("Get /pokemons");

	

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
	/** TODO:
	 * 1. Grab the language cookie from the request.
	 * 2. Get the language from the cookie.
	 * 3. Send the appropriate Pokemon data to the view based on the language.
	 */

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
		res.end(JSON.stringify({ message: "Pokemon not found" }, null, 2));
	}
};

export const createPokemon = async (
	req: IncomingMessage,
	res: ServerResponse,
) => {
	/**
	 * Before adding the Pokemon, check if the user is logged in.
	 * If not, set the response status code to 401 Unauthorized.
	 * Send a message "You must be logged in to view this page" depending on the user-agent.
	 *
	 * Finally, grab the session and set the session cookie.
	 */

	
	const body = await parseBody(req);
	const newPokemon = {
		id: database.length + 1, // ID "auto-increment".
		name: body.name,
		type: body.type,
	};

	database.push(newPokemon);

	res.statusCode = 200;
	
	res.end();
};

const parseBody = async (req: IncomingMessage) => {
	return new Promise<Record<string, string>>((resolve) => {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", () => {
			let parsedBody: Record<string, string>;

			// console.log("req headers in parsebody");
			// console.log(req.headers);

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
