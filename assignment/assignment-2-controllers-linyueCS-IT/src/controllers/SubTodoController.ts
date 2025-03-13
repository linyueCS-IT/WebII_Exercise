import Todo, { TodoProps } from "../models/Todo";
import postgres from "postgres";
import Request from "../router/Request";
import Response, { StatusCode } from "../router/Response";
import Router from "../router/Router";
import { SubTodoProps } from "../models/SubTodo";

/**
 * Controller for handling SubTodo CRUD operations.
 * Routes are registered in the `registerRoutes` method.
 * Each method should be called when a request is made to the corresponding route.
 */
export default class SubTodoController {
	private sql: postgres.Sql<any>;

	constructor(sql: postgres.Sql<any>) {
		this.sql = sql;
	}

	/**
	 * Registers routes for handling SubTodo operations within a Todo application.
	 *
	 * @param {Router<SubTodoProps>} router - The router instance used to define API endpoints.
	 *
	 * @route PUT /todos/:todoId/subtodos/:subTodoId/complete
	 * @description Marks a specific SubTodo as complete within a given Todo.
	 * @param {string} todoId - The ID of the parent Todo.
	 * @param {string} subTodoId - The ID of the SubTodo to be marked as complete.
	 * @returns {Response} The updated SubTodo with completed status.
	 *
	 * @route PUT /todos/:todoId/subtodos/:subTodoId
	 * @description Updates a specific SubTodo's details within a given Todo.
	 * @param {string} todoId -Registers routes for handling SubTodo operations within a Todo application.
	 *
	 * @param {string} subTodoId - The ID of the SubTodo to be updated.
	 * @param {object} requestBody - The updated properties of the SubTodo.
	 * @returns {Response} The updated SubTodo object.
	 */
	registerRoutes(router: Router<SubTodoProps>) {
		// PUT - update status complete
		router.put(
			"/todos/:todoId/subtodos/:subTodoId/complete",
			this.completeSubTodo,
		);
		// PUT - update subTodo through todo id
		router.put("/todos/:todoId/subtodos/:subTodoId", this.updateSubTodo);
	}
	/**
	 * Marks a specific SubTodo as complete within a given Todo.
	 *
	 * @route PUT /todos/:todoId/subtodos/:subTodoId/complete
	 * @description This endpoint updates the status of a SubTodo to "complete".
	 *
	 * @param {Request<SubTodoProps>} req - The request object containing the IDs of the Todo and SubTodo.
	 * @param {Response} res - The response object used to send the result.
	 * @example PUT /todos/1/subtodos/1/complete
	 *
	 * @param {string} req.params.todoId - The ID of the parent Todo.
	 * @param {string} req.params.subTodoId - The ID of the SubTodo to be marked as complete.
	 *
	 * @returns {Response}
	 * - **200 OK**: If the SubTodo was successfully marked as complete.
	 * - **400 Bad Request**: If the provided IDs are invalid.
	 * - **404 Not Found**: If the Todo or SubTodo does not exist.
	 * - **500 Internal Server Error**: If an unexpected error occurs during processing.
	 */
	completeSubTodo = async (req: Request<SubTodoProps>, res: Response) => {
		try {
			// NOTE: Adding a small delay to handle race condition in the tests
			// where addSubTodo() is called without await in the http.test.ts
			// await new Promise((resolve) => setTimeout(resolve, 100));
			// get subTodo and todo Id from req
			const subTodoId = req.getSubTodoId();
			const todoId = req.getId();

			if (isNaN(Number(todoId)) || isNaN(Number(subTodoId))) {
				res.send(StatusCode.BadRequest, "Invalid todo ID", {});
				return;
			}

			const todo = await Todo.read(this.sql, todoId);

			if (!todo) {
				res.send(StatusCode.NotFound, "Not found todo", {});
				return;
			}

			const subTodo = await todo.readSubTodo(subTodoId);

			if (!subTodo) {
				res.send(StatusCode.NotFound, "Not found todo", {});
				return;
			}

			await subTodo.markComplete();

			res.send(
				StatusCode.OK,
				"SubTodo marked as complete!",
				subTodo.props,
			);
		} catch (error) {
			console.error("Error updating todo:", error);
			res.send(StatusCode.BadRequest, "Failed to update subTodo completed");
		}
	};
	/**
	 * Updates the details of a specific SubTodo within a given Todo
	 * @route PUT /todos/:todoId/subtodos/:subTodoId
	 * @description This endpoint updates the properties of a SubTodo.
	 *
	 * @param {Request<SubTodoProps>} req - The request object containing the IDs and updated properties.
	 * @param {Response} res - The response object used to send the result.
	 * @example PUT /todos/1/subtodos/1
	 *
	 * @param {string} req.params.todoId - The ID of the parent Todo.
	 * @param {string} req.params.subTodoId - The ID of the SubTodo to be updated.
	 *
	 * @returns {Response}
	 * - **200 OK**: If the SubTodo was successfully updated.
	 * - **400 Bad Request**: If the provided IDs are invalid or an update error occurs.
	 * - **404 Not Found**: If the Todo or SubTodo does not exist.
	 * - **500 Internal Server Error**: If an unexpected error occurs during processing.
	 */
	updateSubTodo = async (req: Request<SubTodoProps>, res: Response) => {
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
			const subTodo = await todo.readSubTodo(subTodoId);
			if (!subTodo) {
				res.send(StatusCode.NotFound, "Not found subTodo", {});
				return;
			}
			const updateProps = req.props as Partial<SubTodoProps>;

			await subTodo.updateSubTodo(updateProps);
			res.send(
				StatusCode.OK,
				"SubTodo updated successfully!",
				subTodo.props,
			);
		} catch (error) {
			console.error("Error updating todo:", error);
			res.send(StatusCode.InternalServerError, "Failed to update subtodo", {
				error: String(error),
			});
		}
	};
}
