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

	registerRoutes(router: Router<SubTodoProps>) {
		// PUT - update status complete
		router.put("/todos/:todoId/subtodos/:subTodoId/complete", this.completeSubTodo);
		// PUT - update subTodo through todo id
		router.put("/todos/:todoId/subtodos/:subTodoId", this.updateSubTodo);
	}

	completeSubTodo = async (req: Request<SubTodoProps>, res: Response) => {
		try{
			const subTodoId = req.getSubTodoId();
			const todoId = req.getId();
	
			if (isNaN(Number(todoId)) || isNaN(Number(subTodoId))) {
				res.send(StatusCode.BadRequest, "Invalid todo ID", {});
				return;
			}
	
			const todo = await Todo.read(this.sql, todoId);
	
			if (!todo){
				res.send(StatusCode.NotFound,"Not found todo", {});
				return;
			}
	
			const subTodo = await todo.readSubTodo(subTodoId);
	
			// if (!subTodo){
			// 	res.send(StatusCode.NotFound,"Not found todo", {});
			// 	return;
			// }
			
			await subTodo.markComplete(todoId);	
			res.send(StatusCode.OK,"SubTodo marked as complete!",subTodo.props);
		}catch(error){
			console.error("Error updating todo:", error);
			res.send(StatusCode.BadRequest,"Failed to update subTodo");
		}	
	}
	updateSubTodo = async (req: Request<SubTodoProps>, res: Response) => {
		try {
			const todoId = req.getId();
			const subTodoId = req.getSubTodoId();
	
			if (isNaN(Number(todoId)) || isNaN(Number(subTodoId))) {
				res.send(StatusCode.BadRequest, "Invalid todo ID", {});
				return;
			}
	
			const todo = await Todo.read(this.sql, todoId);

			if (!todo) {
				res.send(StatusCode.NotFound, "Not found", {});
				return;
			}
			const subTodo = await todo.readSubTodo(subTodoId);
			const updateProps = req.props as Partial<SubTodoProps>;
			await subTodo.updateSubTodo(updateProps, todoId);
			res.send(
				StatusCode.OK,
				"SubTodo updated successfully!",
				subTodo.props,
			);
		} catch (error) {
			console.error("Error updating todo:", error);
			res.send(StatusCode.BadRequest, "Failed to update todo", {
				error: String(error),
			});
		}
	};
}
