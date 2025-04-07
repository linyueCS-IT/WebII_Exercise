import { IncomingMessage, ServerResponse } from "http";
import {
	
	getAllPokemon,
	getHome,
	getOnePokemon,
	
} from "./controller";

/**
 * A blueprint defining what a route handling function looks like.
 */
interface RouteHandler {
	(req: IncomingMessage, res: ServerResponse): void;
}

/**
 * A blueprint defining what the routes object looks like.
 */
interface Routes {
	[method: string]: {
		[path: string]: RouteHandler;
	};
}

/**
 * The routes object is a dictionary of HTTP methods.
 */
const routes: Routes = {
	GET: {
		"/": getHome,
		"/pokemon": getAllPokemon,
		"/pokemon/:id": getOnePokemon,
	},
	
};

/**
 * A function to handle requests based on defined routes.
 */
export const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
	console.log(`${req.method} ${req.url}`);

	let handler: RouteHandler | undefined;

	for (const route in routes[req.method ?? ""] || {}) {
		if (!route.includes(":")) {
			if (req.url?.split("?")[0] === route) {
				handler = routes[req.method ?? ""]?.[route];
				break;
			}
		} else {
			const regex = new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`);
			if (regex.test(req.url ?? "")) {
				handler = routes[req.method ?? ""][route];
				break;
			}
		}
	}

	if (handler) {
		handler(req, res);
	} else {
		res.statusCode = 404;
		res.end(JSON.stringify({ message: "Route not found" }, null, 2));
	}
};
