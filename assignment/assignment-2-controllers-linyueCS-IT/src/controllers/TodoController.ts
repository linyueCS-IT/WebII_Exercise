import Todo, { TodoProps } from "../models/Todo";
import postgres from "postgres";
import Request from "../router/Request";
import Response, { StatusCode } from "../router/Response";
import Router from "../router/Router";

/**
 * Controller for handling Todo CRUD operations.
 * Routes are registered in the `registerRoutes` method.
 * Each method should be called when a request is made to the corresponding route.
 */
export default class TodoController {
	private sql: postgres.Sql<any>;

	constructor(sql: postgres.Sql<any>) {
		this.sql = sql;
	}

	/**
	 * TODO: To register a route, call the corresponding method on
	 * the router instance based on the HTTP method of the route.
	 *
	 * @param router Router instance to register routes on.
	 *
	 * @example router.get("/todos", this.getTodoList);
	 */
	registerRoutes(router: Router<TodoProps>) {
		router.get("/todos", this.getTodoList);
	}

	/**
	 * TODO: Part 1: This method should be called when a GET request is made to /todos.
	 * It should retrieve all todos from the database and send them as a response.
	 * TODO: Part 2: This method should also support filtering and sorting. The status
	 * of the todos should be filterable using a query parameter `status` and
	 * the todos should be sortable using the query parameter `sortBy`.
	 *
	 * @param req The request object.
	 * @param res The response object.
	 *
	 * @example GET /todos
	 * @example GET /todos?status=complete
	 * @example GET /todos?sortBy=createdAt
	 */
	getTodoList = async (req: Request<TodoProps>, res: Response) => {
		res.send(StatusCode.OK, "Todo list!", {});
	};

	/**
	 * TODO: This method should be called when a GET request is made to /todos/:id.
	 * It should retrieve a single todo from the database and send it as a response.
	 *
	 * @param req The request object.
	 * @param res The response object.
	 *
	 * @example GET /todos/1
	 */
	getTodo = async (req: Request<TodoProps>, res: Response) => {
		res.send(StatusCode.OK, "Todo!", {});
	};

	/**
	 * TODO: This method should be called when a POST request is made to /todos.
	 * It should create a new todo in the database and send it as a response.
	 *
	 * @param req The request object.
	 * @param res The response object.
	 *
	 * @example POST /todos { "title": "New Todo", "description": "A new todo" }
	 */
	createTodo = async (req: Request<TodoProps>, res: Response) => {
		res.send(StatusCode.OK, "Todo created!", {});
	};

	/**
	 * TODO: This method should be called when a PUT request is made to /todos/:id.
	 * It should update an existing todo in the database and send it as a response.
	 *
	 * @param req The request object.
	 * @param res The response object.
	 *
	 * @example PUT /todos/1 { "title": "Updated title" }
	 * @example PUT /todos/1 { "description": "Updated description" }
	 * @example PUT /todos/1 { "title": "Updated title", "dueAt": "2022-12-31" }
	 */
	updateTodo = async (req: Request<TodoProps>, res: Response) => {
		res.send(StatusCode.OK, "Todo updated!", {});
	};

	/**
	 * TODO: This method should be called when a DELETE request is made to /todos/:id.
	 * It should delete an existing todo from the database.
	 *
	 * @param req The request object.
	 * @param res The response object.
	 *
	 * @example DELETE /todos/1
	 */
	deleteTodo = async (req: Request<TodoProps>, res: Response) => {
		res.send(StatusCode.OK, "Todo deleted!", {});
	};

	/**
	 * TODO: This method should be called when a PUT request is made to /todos/:id/complete.
	 * It should mark an existing todo as complete in the database and send it as a response.
	 *
	 * @param req The request object.
	 * @param res The response object.
	 *
	 * @example PUT /todos/1/complete
	 */
	completeTodo = async (req: Request<TodoProps>, res: Response) => {
		res.send(StatusCode.OK, "Todo completed!", {});
	};

	/**
	 * This is something called a type guard. It's a function that checks if a
	 * given object is of a certain type. If the object is of that type, the
	 * function returns true, otherwise it returns false. This is useful for
	 * checking if the request body is a valid TodoProps object.
	 * @param props Must be `any` type because we don't know what the request body will be.
	 * @returns Whether or not the given object is a valid TodoProps object.
	 * @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
	 */
	isValidTodoProps = (props: any): props is TodoProps => {
		return (
			props.hasOwnProperty("title") &&
			props.hasOwnProperty("description") &&
			typeof props.title === "string" &&
			typeof props.description === "string"
		);
	};
}
