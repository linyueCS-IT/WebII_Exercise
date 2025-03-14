import http, { IncomingMessage, ServerResponse } from "http";
import Request from "./router/Request";
import Response, { StatusCode } from "./router/Response";
import Router from "./router/Router";
import TodoController from "./controllers/TodoController";
import postgres from "postgres";
import { TodoProps } from "./models/Todo";
import SubTodoController from "./controllers/SubTodoController";

/**
 * Options for creating a new Server instance.
 * @property host The hostname of the server.
 * @property port The port number of the server.
 * @property sql The postgres connection object.
 */
export interface ServerOptions {
	host: string;
	port: number;
	sql: postgres.Sql;
}

/**
 * A class that represents an HTTP server.
 * The server listens for incoming requests and routes them to the appropriate controller.
 */
export default class Server {
	private host: string;
	private port: number;
	private server: http.Server;
	private sql: postgres.Sql;
	private router: Router;
	private todoController: TodoController;
	// add subController
	private subController: SubTodoController;

	/**
	 * Initializes a new Server instance. The server is not started until the `start` method is called.
	 * @param serverOptions The options for creating a new Server instance.
	 */
	constructor(serverOptions: ServerOptions) {
		this.server = http.createServer();
		this.sql = serverOptions.sql;
		this.host = serverOptions.host;
		this.port = serverOptions.port;
		this.router = new Router();
		// create todoController instance
		this.todoController = new TodoController(this.sql);
		// create subTodoController instance
		this.subController = new SubTodoController(this.sql);
		// todoController instance call registerRoutes()
		this.todoController.registerRoutes(this.router);
		// subTodoController instance call registerRoutes()
		this.subController.registerRoutes(this.router);

		this.router.get("/", (req: Request, res: Response) => {
			res.send(StatusCode.OK, "Homepage!", {});
		});
	}

	/**
	 * Every time a request is made to the server, this method is called.
	 * It routes the request to the appropriate controller and sends the response back to the client.
	 * @param req The request object.
	 * @param res The response object.
	 */
	handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
		console.log(`>>> ${req.method} ${req.url}`);

		// Create a new Request and Response object for the current request using our custom classes.
		const request = new Request<TodoProps>(req);
		const response = new Response(res);

		if (!req.method) {
			response.send(StatusCode.BadRequest, "Invalid request method");
			return;
		}

		if (!req.url) {
			response.send(StatusCode.BadRequest, "Invalid request URL");
			return;
		}

		// Parse the request body and extract the incoming data.
		// This is only done for POST and PUT requests because they
		// normally data in their body whereas GET and DELETE requests do not.
		if (req.method === "POST" || req.method === "PUT") {
			await request.parseBody();
		}

		// Find the appropriate handler for the current request.
		const handler = this.router.findMatchingHandler(req.method, req.url);

		// If a handler is found, call it with the request and response objects.
		if (handler) {
			try {
				await handler(request, response);
			} catch (error) {
				const message = `Error while handling request: ${error}`;
				console.error(message);
				response.send(StatusCode.InternalServerError, message);
			}
		} else {
			// if no handler found, response 404
			response.send(
				StatusCode.NotFound,
				`Invalid route: ${req.method} ${req.url}`,
				{},
			);
		}
	};

	/**
	 * Starts the server and listens for incoming requests.
	 */
	start = async () => {
		this.server.on("request", this.handleRequest);
		await this.server.listen(this.port);
		console.log(`Server running at http://${this.host}:${this.port}/.`);
	};

	/**
	 * Stops the server and closes the database connection.
	 */
	stop = async () => {
		await this.sql.end();
		await this.server.close();
		console.log(`Server stopped.`);
	};
}
