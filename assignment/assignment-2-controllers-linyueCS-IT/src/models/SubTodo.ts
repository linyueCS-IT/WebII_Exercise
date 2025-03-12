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
	 * Marks a subTodo as complete in the database.
	 *
	 */
	async markComplete(): Promise<void> {
		await this.sql`
            UPDATE subtodos
            SET 
            status = 'complete', created_at = ${new Date()}
            WHERE id = ${this.props.id} 
            RETURNING *
        `;
		// Update the local subProps
		this.props.status = "complete";
		this.props.createdAt = new Date();
		console.log(`${this.props.title}'s status is ${this.props.status}`);
	}
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
