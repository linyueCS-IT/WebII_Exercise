import postgres from "postgres";
import { camelToSnake, convertToCase, snakeToCamel } from "../utils";
import { title } from "process";
import Todo from "./Todo";

/**
 * The properties, or "shape", of a SubTodo.
 */
export interface SubTodoProps {
	id?: number;
	title: string;
	status: "incomplete" | "complete";
	createdAt: Date;
	completedAt?: Date;
	todoId: number;
}

export default class SubTodo {
	/**
	 * Initializes a new instance of the SubTodo class.
	 * @param sql The sql parameter is an instance of a Postgres client.
	 * It's used for database operations (queries, updates, deletions, etc.)
	 * related to this Todo instance. By passing sql, each Todo instance can
	 * interact with the database.
	 *
	 * @param subTodoProps This parameter holds the properties of the SubTodo (like id, title, etc.).
	 */
	constructor(
		private sql: postgres.Sql<any>,
		public props: SubTodoProps,
	) {
		this.sql = sql;
		this.props = props;
	}
	/**
	 * Marks a SubTodo as complete by updateSubTodo().
	 *
	 * @param {number} todoId - The ID of the parent Todo item associated with the SubTodo to be marked as complete.
	 *
	 * @returns {Promise<void>} A promise that resolves once the SubTodo has been marked as complete.
	 */
	async markComplete(todoId: number): Promise<void> {
		await this.updateSubTodo(
			{ status: "complete", completedAt: new Date() },
			todoId,
		);
	}
	/**
	 * Updates a SubTodo record in the database.
	 *
	 * This method updates the properties of an existing SubTodo record identified by "todoId" and "id".
	 * The properties to update are passed as a partial object, and the "edited_at" timestamp is automatically updated to the current date and time.
	 *
	 * @param {Partial<SubTodoProps>} updateProps - A partial object containing the properties to update. The keys correspond to the columns of the SubTodo table in camelCase, and the values are the new values to be set.
	 * @param {number} todoId - The ID of the parent Todo item to which this SubTodo belongs. This is used to filter which SubTodo to update based on the `todoId` and the `id` of the SubTodo.
	 *
	 * @throws {Error} Throws an error if the SubTodo is not found or not updated.
	 *
	 * @returns {Promise<void>} A promise that resolves once the update operation is completed.
	 */
	async updateSubTodo(updateProps: Partial<SubTodoProps>, todoId: number) {
		const [row] = await this.sql`
		UPDATE subtodos
		SET
			${this.sql(convertToCase(camelToSnake, updateProps))}, edited_at = ${new Date()}
		WHERE
			todo_id = ${todoId} and id = ${this.props.id}
		RETURNING *
	`;
		if (!row) {
			throw new Error("SubTodo not found or not updated");
		}
		this.props = { ...this.props, ...convertToCase(snakeToCamel, row) };
	}
}
const sql = postgres({
	database: "TodoDB",
});
