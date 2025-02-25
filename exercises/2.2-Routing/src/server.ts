import http, { IncomingMessage, ServerResponse } from "http";
import {
	createPokemon,
	deletePokemon,
	getAllPokemon,
	getHome,
	getOnePokemon,
	updatePokemon,
} from "./controller";
const hostname = "127.0.0.1";
const port = 3000;

/**
 * A blueprint defining what a route handling function looks like.
 * A route handler takes a request and response object.
 * While it does not return anything, it is expected to send a response
 * back to the client using the response object.
 */
interface RouteHandler {
	(req: IncomingMessage, res: ServerResponse): void;
}

/**
 * A blueprint defining what the routes object looks like.
 * The routes object is a dictionary of HTTP methods.
 * Each HTTP method is a dictionary of routes.
 * Each route is a string that maps to a route handling function.
 * @see https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types-and-index-signatures
 */
interface Routes {
	[method: string]: {
		[path: string]: RouteHandler;
	};
}

/**
 * The routes object is a dictionary of HTTP methods.
 * Each HTTP method is a dictionary of routes.
 * Each route is a string that maps to a route handling function.
 */
const routes: Routes = {
	GET: {
		"/": getHome,
		"/pokemon": getAllPokemon,
		"/pokemon/:id": getOnePokemon
	},
	POST: {
		"/pokemon": createPokemon
	},
	PUT: {
		"/pokemon/:id": updatePokemon
	},
	DELETE: {
		"/pokemon/:id": deletePokemon
	},
};

/**
 * A function that handles all incoming requests.
 * It logs the request method and URL to the console.
 * It then checks if the request method and URL match a route handler.
 * If a route handler is found, it calls the route handler.
 * If a route handler is not found, it sends a 404 response.
 * @param req The request object.
 * @param res The response object.
 */
const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
	console.log(`${req.method} ${req.url}`);

	// TODO: Determine the route handler based on the request method and URL.
	if (!req.method || !req.url){
		res.statusCode = 400;
		res.end(JSON.stringify({ message: "Bad Request" }));
		return;
	}		
	
	const method = req.method.toUpperCase();
	// req.url is not full url, only contain path and query params, exclude hostname
	const parsedUrl = new URL(`${req.url}`, `http://${req.headers.host}`);
	const path = parsedUrl.pathname;
	
	// const handler = routes["GET"]["/"];
	let handler: RouteHandler | undefined = routes[method]?.[path];
	// const handler = routes[method][path]


	// If the route is not found, check for dynamic routes (e.g., /pokemon/:id)
	if (!handler) {
		for (const route in routes[method]) {
			const routeRegex = new RegExp("^" + route.replace(/:\w+/g, "(\\d+)") + "$"); // Match numbers only for ID
			const match = path.match(routeRegex);

			if (match) {
				req.url = path; // Keep original URL
				handler = routes[method][route];
				break;
			}
		}
	}

	if (handler) {
		handler(req, res);
	} else {
		res.statusCode = 404;
		res.end(JSON.stringify({ message: "Not Found" }));
	}
};
/**
 * Route registration is the process of adding a route to the routes object.
 * Populate the routes object by placing function references,
 * e.g., the `getAllPokemon` function you made, into these slots to establish paths.
 */
routes.GET["/"] = getHome;
routes.GET["/pokemon/:id"] = getOnePokemon;
routes.POST["/pokemon"] = createPokemon;
// TODO: Add the remaining routes to the routes object.
routes.GET["/pokemon"] = getAllPokemon;
routes.POST["/pokemon"] = createPokemon;
routes.PUT["/pokemon/:id"] = updatePokemon;
routes.DELETE["/pokemon/:id"] = deletePokemon;

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
