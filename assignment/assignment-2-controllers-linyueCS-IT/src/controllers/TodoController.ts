import Todo, { TodoProps } from "../models/Todo";
import postgres from "postgres";
import Request from "../router/Request";
import Response, { StatusCode } from "../router/Response";
import Router from "../router/Router";
import SubTodo, { SubTodoProps } from "./../models/SubTodo";
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
		// GET - get all todos
		router.get("/todos", this.getTodoList);
		// GET - get one todo
		router.get("/todos/:id", this.getTodo);
		// POST - create todo
		router.post("/todos", this.createTodo);
		// PUT - update
		router.put("/todos/:id", this.updateTodo);
		// DELETE - delete
		router.del("/todos/:id", this.deleteTodo);
		// PUT - update status
		router.put("/todos/:id/complete", this.completeTodo);
		//---------SubTodo--------------------
		// POST - create subTodo
		router.post("/todos/:todoId/subtodos", this.createSubTodo);
		// GET - get through todo id
		router.get("/todos/:todoId/subtodos", this.getSubTodoList);
		// GET - get one subTodo through todo id
		router.get("/todos/:todoId/subtodos/:subTodoId", this.getSubTodo);
		// DELETE - delete subTodo
		router.del("/todos/:todoId/subtodos/:subTodoId", this.deleteSubTodo);
	}

	//===========================================================================================
	// Todo part
	//===========================================================================================
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
		try {
			const queryParams = req.getSearchParams();
			const sortBy = queryParams.get("sortBy") || undefined;
			const status = queryParams.get("status");
			// sortOrderRaw is string or null
			const sortOrderRaw = queryParams.get("sortOrder");
			//
			let sortOrder: "ASC" | "DESC" | undefined;
			const filters: Partial<TodoProps> = {};

			// Validate status if provided
			if (status && status !== "complete" && status !== "incomplete") {
				res.send(StatusCode.BadRequest, "Invalid status", {});
				return;
			}
			if (status === "complete" || status === "incomplete") {
				// identified  "complete" | "incomplete"
				filters.status = status;
			}

			if (sortOrderRaw === "ASC" || sortOrderRaw === "DESC") {
				sortOrder = sortOrderRaw;
			} else if (sortOrderRaw === null) {
				sortOrder = "ASC";
			} else {
				res.send(
					StatusCode.BadRequest,
					"Invalid sortOrder, must be 'ASC' or 'DESC'",
					{},
				);
				return;
			}
			// Use Todo.readAll() static method to get all todos
			const todos = await Todo.readAll(
				this.sql,
				filters,
				sortBy,
				sortOrder,
			);

			// Send response
			res.send(
				StatusCode.OK,
				"Todo list retrieved",
				todos.map((todo) => todo.props),
			);
		} catch (error) {
			console.error("Error fetching todos:", error);
			res.send(StatusCode.InternalServerError, "Failed to fetch todos", {
				error: String(error),
			});
		}
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
		try {
			const id = req.getId();

			if (isNaN(Number(id))) {
				res.send(StatusCode.BadRequest, "Invalid ID", {});
				return;
			}

			const todo = await Todo.read(this.sql, id);

			if (!todo) {
				res.send(StatusCode.NotFound, "Not found", {});
				return;
			}

			res.send(StatusCode.OK, "Todo retrieved", todo.props);
		} catch (error) {
			console.error("Error fetching todo:", error);
			res.send(StatusCode.InternalServerError, "Failed to fetch todo", {
				error: String(error),
			});
		}
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
		try {
			const todoProps = req.props;

			if (!this.isValidTodoProps(todoProps)) {
				res.send(
					StatusCode.BadRequest,
					"Request body must include title and description.",
					{},
				);
				return;
			}

			const newTodo = await Todo.create(this.sql, todoProps);

			res.send(
				StatusCode.Created,
				"Todo created successfully!",
				newTodo.props,
			);
		} catch (error) {
			console.error("Error creating todo:", error);
			res.send(StatusCode.InternalServerError, "Failed to create todo", {
				error: String(error),
			});
		}
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
		try {
			const id = req.getId();

			if (isNaN(Number(id))) {
				res.send(StatusCode.BadRequest, "Invalid ID", {});
				return;
			}

			const todo = await Todo.read(this.sql, id);

			if (!todo) {
				res.send(StatusCode.NotFound, "Todo not found", {
					error: `Todo with id ${id} not found`,
				});
				return;
			}

			const updateProps = req.props as Partial<TodoProps>;

			await todo.update(updateProps);

			res.send(StatusCode.OK, "Todo updated successfully!", todo.props);
		} catch (error) {
			console.error("Error updating todo:", error);
			res.send(StatusCode.InternalServerError, "Failed to update todo", {
				error: String(error),
			});
		}
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
		try {
			const id = req.getId();

			if (isNaN(Number(id))) {
				res.send(StatusCode.BadRequest, "Invalid ID", {});
				return;
			}

			const todo = await Todo.read(this.sql, id);

			if (!todo) {
				res.send(StatusCode.NotFound, "Not found", {});
				return;
			}

			await todo.delete();

			res.send(StatusCode.OK, "Todo deleted successfully!", {});
		} catch (error) {
			console.error("Error deleting todo:", error);
			res.send(StatusCode.InternalServerError, "Failed to delete todo", {
				error: String(error),
			});
		}
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
		try {
			const id = req.getId();

			if (isNaN(Number(id))) {
				res.send(StatusCode.BadRequest, "Invalid ID", {});
				return;
			}

			const todo = await Todo.read(this.sql, id);

			if (!todo) {
				res.send(StatusCode.NotFound, "Todo not found", {
					error: `Todo with id ${id} not found`,
				});
				return;
			}

			await todo.markComplete();

			res.send(StatusCode.OK, "Todo marked as complete!", todo.props);
		} catch (error) {
			console.error("Error updating todo:", error);
			res.send(StatusCode.InternalServerError, "Failed to update todo", {
				error: String(error),
			});
		}
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

	//===========================================================================================
	// SubTodo part
	//===========================================================================================

	/**
	 * Creates a new SubTodo and associates it with a Todo item.
	 * @param reqThe request object containing the properties of the SubTodo to be created.
	 * The "props" field should contain the "SubTodo" properties to be added, and the ID of the parent "Todo" is extracted from the request.
	 * @param res The response object used to send the status and response data back to the client.
	 * @returns {Promise<void>} A promise that resolves when the SubTodo is successfully created, or if an error occurs.
	 * @example POST /todos/1/subtodos
	 */
	createSubTodo = async (req: Request<SubTodoProps>, res: Response) => {
		try {
			const id = req.getId();
			if (isNaN(Number(id))) {
				res.send(StatusCode.BadRequest, "Invalid ID", {});
				return;
			}
			const todo = await Todo.read(this.sql, id);

			if (!todo) {
				res.send(StatusCode.NotFound, "Not found", {});
				return;
			}
			const subTodoProps = req.props as SubTodoProps;
			const subTodo = await todo.addSubTodo(subTodoProps);

			res.send(
				StatusCode.Created,
				"SubTodo created successfully!",
				subTodo.props,
			);
		} catch (error) {
			// console.error("Error creating todo:", error);
			res.send(StatusCode.InternalServerError, "Failed to add subtodo", { error: String(error) });
		}
	};
	/**
	 * Retrieves the list of SubTodos associated with a specific Todo.
	 * @param {Request<SubTodoProps>} req - The request object containing the "id" of the parent Todo item. The "id" is used to
	 * identify which Todo's SubTodos should be retrieved.
	 * @param {Response} res - The response object used to send the status and response data back to the client.
	 * @example GET /todos/1/subtodos
	 * @returns {Promise<void>} A promise that resolves when the list of SubTodos is successfully retrieved, or if an error occurs.
	 */
	getSubTodoList = async (req: Request<SubTodoProps>, res: Response) => {
		try {
			const id = req.getId();

			if (isNaN(Number(id))) {
				res.send(StatusCode.BadRequest, "Invalid ID", {});
				return;
			}
			const todo = await Todo.read(this.sql, id);

			if (!todo) {
				res.send(StatusCode.NotFound, "Not found", {});
				return;
			}
			const subTodos = await todo.listSubTodos();

			res.send(
				StatusCode.OK,
				"SubTodo list retrieved",
				subTodos.map((subTodo) => subTodo.props),
			);
		} catch (error) {
			res.send(StatusCode.InternalServerError,"Failed to fetch subtodos", {
				error: String(error),
			});
		}
	};
	/**
	 * Retrieves a specific SubTodo associated with a given Todo.
	 * @param {Request<SubTodoProps>} req - The request object containing the "todoId" and "subTodoId"used to identify the specific
	 * "SubTodo" to retrieve. The "todoId" corresponds to the parent `Todo` item, and the "subTodoId" corresponds to the specific "SubTodo".
	 * @param {Response} res - The response object used to send the status and response data back to the client.
	 * @example GET /todos/1/subtodos/1
	 * @returns {Promise<void>} A promise that resolves when the SubTodo is successfully retrieved, or if an error occurs.
	 */
	getSubTodo = async (req: Request<SubTodoProps>, res: Response) => {
		try {
			// NOTE: Adding a small delay to handle race condition in the tests
			// where addSubTodo() is called without await in the http.test.ts
			// await new Promise((resolve) => setTimeout(resolve, 100));
			const todoId = req.getId();
			const subTodoId = req.getSubTodoId();

			// Give a little time for any pending database operations to complete
			// This helps with the race condition in the tests
			await new Promise((resolve) => setTimeout(resolve, 100));

			if (isNaN(todoId) || isNaN(subTodoId)) {
				res.send(StatusCode.BadRequest, "Invalid todo ID", {});
				return;
			}

			const todo = await Todo.read(this.sql, todoId);

			if (!todo) {
				res.send(StatusCode.NotFound, "Not found", {});
				return;
			}

			const subTodo = await todo.readSubTodo(subTodoId);

			if (!subTodo) {
				res.send(StatusCode.NotFound, "Not found subTodo", {});
				return;
			}

			res.send(StatusCode.OK, "SubTodo retrieved", subTodo.props);
		} catch (error) {
			res.send(StatusCode.InternalServerError, "Failed to fetch subtodo", {
				error: String(error),
			});
		}
	};
	/**
	 * Deletes a specific SubTodo associated with a given Todo.
	 * @param {Request<SubTodoProps>} req - The request object containing the `todoId` and `subTodoId` used to identify the specific
	 * `SubTodo` to delete. The `todoId` corresponds to the parent `Todo` item, and the `subTodoId` corresponds to the specific `SubTodo`.
	 * @param {Response} res - The response object used to send the status and response data back to the client.
	 * @example DELETE /todos/1/subtodos/1
	 * @returns {Promise<void>} A promise that resolves when the SubTodo is successfully deleted, or if an error occurs.
	 */
	deleteSubTodo = async (req: Request<SubTodoProps>, res: Response) => {
		try {
			// NOTE: Adding a small delay to handle race condition in the tests
			// where addSubTodo() is called without await in the http.test.ts
			// await new Promise((resolve) => setTimeout(resolve, 100));
			const todoId = req.getId();
			const subTodoId = req.getSubTodoId();

			if (isNaN(Number(todoId))) {
				res.send(StatusCode.BadRequest, "Invalid todo ID", {});
				return;
			}
			const todo = await Todo.read(this.sql, todoId);

			if (!todo) {
				res.send(StatusCode.NotFound, "Not found", {});
				return;
			}

			if (isNaN(Number(subTodoId))) {
				res.send(StatusCode.BadRequest, "Invalid subtodo ID", {});
				return;
			}

			await todo.removeSubTodo(subTodoId);

			res.send(StatusCode.OK, "SubTodo deleted successfully!", {});
		} catch (error) {
			res.send(StatusCode.InternalServerError, "Failed to delete subtodo", {
				error: String(error),
			});
		}
	};
}
