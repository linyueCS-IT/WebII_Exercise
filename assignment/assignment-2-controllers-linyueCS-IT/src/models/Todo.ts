import postgres from "postgres";
// import SubTodo, { SubTodoProps } from "./SubTodo";
import { camelToSnake, convertToCase, snakeToCamel } from "../utils";
import SubTodo, { SubTodoProps } from "./SubTodo";

export interface TodoProps {
	id?: number;
	title: string;
	description: string;
	status: "incomplete" | "complete";
	dueAt?: Date;
	createdAt: Date;
	completedAt?: Date;
	editedAt?: Date;
	// subTodos?: SubTodo[];
}

export default class Todo {
	constructor(
		private sql: postgres.Sql<any>,
		public props: TodoProps,
	) {}
	/**
	 *
	 */
	static async create(sql: postgres.Sql<any>, props: TodoProps) {
		const connection = await sql.reserve();

		const [row] = await connection<TodoProps[]>`
			INSERT INTO todos
				${sql(convertToCase(camelToSnake, props))}
			RETURNING *
		`;

		await connection.release();

		return new Todo(sql, convertToCase(snakeToCamel, row) as TodoProps);
	}
	/**
	 *
	 * @param sql
	 * @param id
	 * @returns
	 */
	static async read(sql: postgres.Sql<any>, id: number) {
		const connection = await sql.reserve();

		const [row] = await connection<TodoProps[]>`
			SELECT * FROM
			todos WHERE id = ${id}
		`;

		await connection.release();

		if (!row) {
			return null;
		}

		return new Todo(sql, convertToCase(snakeToCamel, row) as TodoProps);
	}

	/**
	 * Reads all todos from the database.
	 * TODO: This method should support filtering and sorting. The status
	 * of the todos should be filterable using a query parameter `status` and
	 * the todos should be sortable using the query parameters `sortBy` and `sortOrder`.
	 * @param sql The postgres connection object.
	 * @param @optional filters The filters to apply to the query.
	 * @param @optional sortBy The column to sort by.
	 * @returns The list of todos.
	 */
	static async readAll(
		sql: postgres.Sql<any>,
		filters?: Partial<TodoProps>,
		sortBy?: string,
		sortOrder: "ASC" | "DESC" = "ASC", // Add this parameter as optional, default "ASC"
	): Promise<Todo[]> {
		try {
			// dynamical variable
			let query = sql<TodoProps[]>`SELECT * FROM todos`;

			// Check filters is not null
			if (filters && Object.keys(filters).length > 0) {
				if (filters.status) {
					query = sql`${query} WHERE status = ${filters.status}`;
				}
			}
			// Check sortBy is not null
			if (sortBy) {
				const columnMap: { [key: string]: string } = {
					createdAt: "created_at",
					dueAt: "due_at",
					completedAt: "completed_at",
					editedAt: "edited_at",
					title: "title",
					description: "description",
					status: "status",
				};
				// if columnMap[sortBy] is false, default "created_at";
				const columnName = columnMap[sortBy] || "created_at";
				const order =
					sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";
				query = sql`${query} ORDER BY ${sql(columnName)} ${sql.unsafe(order)}`;
			}
			let rows = await query;
			return rows.map((row) => {
				const props = convertToCase(snakeToCamel, row) as TodoProps;
				return new Todo(sql, props);
			});
		} catch (error) {
			console.error("Error in Todo.readAll:", error);
			throw error;
		}
	}
	/**
	 *
	 * @param updateProps
	 */

	async update(updateProps: Partial<TodoProps>) {
		const connection = await this.sql.reserve();

		const [row] = await connection`
			UPDATE todos
			SET
				${this.sql(convertToCase(camelToSnake, updateProps))}, edited_at = ${new Date()}
			WHERE
				id = ${this.props.id}
			RETURNING *
		`;

		await connection.release();

		// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
		this.props = { ...this.props, ...convertToCase(snakeToCamel, row) };
	}
	/**
	 *
	 * @returns
	 */
	async delete() {
		const connection = await this.sql.reserve();

		const result = await connection`
			DELETE FROM todos
			WHERE id = ${this.props.id}
		`;

		await connection.release();

		return result.count === 1;
	}
	/**
	 *
	 */
	async markComplete() {
		await this.update({ status: "complete", completedAt: new Date() });
	}

	/**
	 * Add a subTodo and should be associated with a Todo item
	 * @param subTodoProps Holds the properties of the SubTodo (like id, title, status, etc.).
	 *
	 * @returns The new SubTodo instance. Since this is an async function,
	 * it returns a Promise that resolves to the new SubTodo instance.
	 * The reason for this being an async function is that it interacts
	 * with the database through the sql parameter, whose operations are asynchronous.
	 */
	async addSubTodo(subTodoProps: SubTodoProps): Promise<SubTodo> {
		const [subTodo] = await this.sql`
			INSERT INTO subtodos
			(title, status, created_at, todo_id) 
			VALUES 
			(${subTodoProps.title}, ${subTodoProps.status}, ${new Date()}, ${this.props.id})
			RETURNING *
		`;
		console.log("Add subTodo in db", subTodo);
		// Covert to Snake Case
		const subTodoForSnakeCase: any = {};

		Object.entries(subTodo).forEach(([key, value]) => {
			subTodoForSnakeCase[snakeToCamel(key)] = value;
		});
		console.log(
			"Add subTodo and return subTodo Props",
			subTodoForSnakeCase,
		);
		return new SubTodo(this.sql, subTodoForSnakeCase as SubTodoProps);
	}
	/**
	 * Retrieves a list of SubTodo base on the id of associated Todo
	 *
	 * @returns The a list of SubTodo instances. Since this is an async function,
	 * it returns a Promise that resolves to the new SubTodo instance.
	 * The reason for this being an async function is that it interacts
	 * with the database through the sql parameter, whose operations are asynchronous.
	 */
	async listSubTodos(): Promise<SubTodo[]> {
		const subTodos = await this.sql`
			SELECT * FROM subtodos
			WHERE todo_id = ${this.props.id}
		`;

		return subTodos.map((subTodo) => {
			// Covert to Snake Case
			const subTodoForSnakeCase: any = {};
			Object.entries(subTodo).forEach(([key, value]) => {
				subTodoForSnakeCase[snakeToCamel(key)] = value;
				console.log("List subTodo", subTodoForSnakeCase);
			});
			return new SubTodo(this.sql, subTodoForSnakeCase as SubTodoProps);
		});
	}

	/**
	 * Delete a SubTodo from database. It's an instance method because
	 * it's used to delete the specific SubTodo instance on which it's called.
	 *
	 * @param subTodoId The Id of SubTodo
	 */

	async removeSubTodo(subTodoId: number): Promise<void> {
		const [subTodos] = await this.sql`
			DELETE FROM subtodos
			WHERE id = ${subTodoId}
			RETURNING *			
		`;
	}
	/**
	 *
	 * @param subTodoId
	 */
	async readSubTodo(subTodoId: number): Promise<SubTodo> {
		const [subTodos] = await this.sql`
			SELECT * FROM subtodos
			WHERE todo_id = ${this.props.id} and id = ${subTodoId}
		`;
		return new SubTodo(
			this.sql,
			convertToCase(snakeToCamel, subTodos) as SubTodoProps,
		);
	}
	async updateSubTodo(
		subTodoId: number,
		updateProps: Partial<SubTodoProps>,
	): Promise<SubTodo> {
		return await this.sql.begin(async (sql) => {
			const subTodo = await this.readSubTodo(subTodoId);
			if (!subTodo) {
				throw new Error("SubTodo not found");
			}
			await subTodo.updateSubTodo(updateProps, subTodoId);
			return subTodo;
		});
	}
}
