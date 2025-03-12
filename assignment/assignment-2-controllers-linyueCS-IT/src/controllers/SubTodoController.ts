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

	registerRouter(router: Router<SubTodoProps>) {
		// PUT - update status
		router.put("/subTodos", this.completeSubTodo);
	}

	completeSubTodo = async (req: Request<SubTodoProps>, res: Response) => {
		const id = req.getId();

		if (isNaN(Number(id))) {
			res.send(StatusCode.BadRequest, "Invalid ID", {});
		}

		// const subTodo = await
	};
}
