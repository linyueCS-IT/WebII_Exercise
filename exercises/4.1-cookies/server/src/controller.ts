import { IncomingMessage, ServerResponse } from "http";
import { database } from "./model";


/**
 * TODO: Copy the route handling logic from the previous exercise
 * into these functions. You will need to use the party array from
 * the model.ts file to handle the requests.
 */

// GET /
export const getHome = (req: IncomingMessage, res: ServerResponse) => {
	 /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Welcome message to the view based on the language.
     */
	 console.log('Request received at getHome');
	 console.log('Cookies:', req.headers.cookie);
	

	let message = "WELCOME";
	// Check if English or French is present in the cookies.
	// const cookies = getCookies(req);
	// const languageCode = cookies.language === "fr" ? "fr" : "en";

	
	

	// Set response headers
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");	
	/*
	* CORS (Cross-Origin Resource Sharing) Headers
	* res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); Specifies which origins (websites) are allowed to access the server. 
	* res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");  Defines which HTTP methods are allowed for cross-origin requests.
	* res.setHeader("Access-Control-Allow-Headers", "*"); Allows all headers to be sent with cross-origin requests.This is useful if the client needs to send custom headers.
	* res.setHeader("Access-Control-Allow-Credentials", "true");Allows credentials (cookies, authorization headers) to be sent in cross-origin requests.If this is true, "Access-Control-Allow-Origin" cannot be "*" (it must be a specific domain like http://localhost:5173).
	*
	* NOTE:
	* Below is an example of setting HttpOnly to prevent JavaScript access,protecting cookies from being stolen by client-side scripts (e.g., XSS attacks).
	   res.setHeader("Set-Cookie", [
		"likes=darkChocoLate; Path=/; HttpOnly; Secure; SameSite=Strict",
		"lovesWebDev=false; Path=/; Max-Age=86400"
	]);
	
	*/
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); 
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); 
	res.setHeader("Access-Control-Allow-Headers", "*");  
	res.setHeader("Access-Control-Allow-Credentials", "true"); 

	// Set cookies
	res.setHeader("Set-Cookie", [
		"likes=somethingYouLike;SameSite=Strict",
		"lovesWebDev=false",
	]);

	// res.setHeader("Set-Cookie", [
	// 	"likes=somethingYouLike; SameSite=Strict; Path=/",
	// 	"lovesWebDev=false; SameSite=Strict; Path=/; Max-Age=86400",
	//   ]);

	console.log(req.headers.cookie)
    // Send JSON response
	res.end(JSON.stringify({ message: message }, null, 2));
};

// GET /pokemon
export const getAllPokemon = (req: IncomingMessage, res: ServerResponse) => {
	 /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Pokemon data to the view based on the language.
	 * 4. Set the response headers based on the getHome example
     */
	console.log("Get all pokemon");

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	
	//Set the Cor headers
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");

	res.end(
		JSON.stringify(
			{ message: "All Pokemon", payload: database },
			null,
			2,
		),
	);
};

// GET /pokemon/:id
export const getOnePokemon = (req: IncomingMessage, res: ServerResponse) => {
	 /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Pokemon data to the view based on the language.
     */
	
	 const id = Number(req.url?.split("/")[2]);
	 const foundPokemon = database.find((pokemon) => pokemon.id === id);


	if (foundPokemon) {
		
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
	    // set the CORs headers from getHome example.
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		res.setHeader("Access-Control-Allow-Headers", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true");

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



/**
 * @returns The cookies of the request as a Record type object.
 * @example name=Pikachu; type=Electric => { "name": "Pikachu", "type": "Electric" }
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
 */
const getCookies = (req: IncomingMessage): Record<string, string> => {
	/** TODO:
	 * 1. Get the cookie header from the request. (req.headers.cookie)
	 * 2. Parse the cookie header into a Record<string, string> object.
	 *    - Split the cookie header by the semicolon + space.
	 *      - Ex. "name=Pikachu; type=Electric" -> make sure to split by "; "!
	 *    - Split each cookie by the equals sign.
	 *    - You may need to decode the value.
	 *    - Assign the name as the key and the value as the value.
	 * 3. Return the object, empty object if there a no cookies..
	 */

	return {};
};
