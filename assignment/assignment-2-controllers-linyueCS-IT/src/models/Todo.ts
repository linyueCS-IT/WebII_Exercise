import postgres from "postgres";
// import SubTodo, { SubTodoProps } from "./SubTodo";
import { camelToSnake, convertToCase, snakeToCamel } from "../utils";

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
	): Promise<Todo[]> {
		const connection = await sql.reserve();

		const rows = await connection<TodoProps[]>`
			SELECT *
			FROM todos
		`;

		await connection.release();

		return rows.map(
			(row) =>
				new Todo(sql, convertToCase(snakeToCamel, row) as TodoProps),
		);
	}

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

	async delete() {
		const connection = await this.sql.reserve();

		const result = await connection`
			DELETE FROM todos
			WHERE id = ${this.props.id}
		`;

		await connection.release();

		return result.count === 1;
	}

	async markComplete() {
		await this.update({ status: "complete", completedAt: new Date() });
	}
}
