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
	// Add completed time
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
	 * @returns {Promise<void>} A promise that resolves once the SubTodo has been marked as complete.
	 */
	async markComplete(): Promise<void> {
		await this.updateSubTodo({
			status: "complete",
			completedAt: new Date(),
		});
	}
	/**
	 * Updates a SubTodo record in the database.
	 * @param {Partial<SubTodoProps>} updateProps - A partial object containing the properties to update.
	 * The keys correspond to the columns of the SubTodo table in camelCase, and the values are the new values to be set.
	 * @throws {Error} Throws an error if the SubTodo is not found or not updated.
	 * @returns {Promise<void>} A promise that resolves once the update operation is completed.
	 */
	async updateSubTodo(updateProps: Partial<SubTodoProps>) {
		const [row] = await this.sql`
		UPDATE subtodos
		SET
			${this.sql(convertToCase(camelToSnake, updateProps))}, edited_at = ${new Date()}
		WHERE
			id = ${this.props.id}
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
