import postgres from "postgres";
import Todo, { TodoProps } from "../src/models/Todo";
// import { SubTodoProps } from "../src/models/SubTodo";
import Server from "../src/Server";
import { StatusCode } from "../src/router/Response";
import { HttpResponse, makeHttpRequest } from "./client";

describe("Todo HTTP operations", () => {
	const sql = postgres({
		database: "TodoDB",
	});

	const server = new Server({
		host: "localhost",
		port: 3000,
		sql,
	});

	/**
	 * Helper function to create a Todo with default or provided properties.
	 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR#short-circuit_evaluation
	 * @param props The properties of the Todo.
	 * @default title: "Test Todo"
	 * @default description: "This is a test todo"
	 * @default status: "incomplete"
	 * @default dueAt: A week from today
	 * @default createdAt: The current date/time
	 * @returns A new Todo object that has been persisted in the DB.
	 */
	const createTodo = async (props: Partial<TodoProps> = {}) => {
		const todoProps: TodoProps = {
			title: props.title || "Test Todo",
			description: props.description || "This is a test todo",
			status: props.status || "incomplete",
			dueAt:
				props.dueAt ||
				new Date(new Date().setDate(new Date().getDate() + 7)),
			createdAt: props.createdAt || new Date(),
		};

		return await Todo.create(sql, todoProps);
	};

	beforeAll(async () => {
		await server.start();
	});

	/**
	 * Clean up the database after each test. This function deletes all the rows
	 * from the todos and subtodos tables and resets the sequence for each table.
	 * @see https://www.postgresql.org/docs/13/sql-altersequence.html
	 */
	afterEach(async () => {
		const tables = ["todos", "subtodos"];

		try {
			for (const table of tables) {
				await sql.unsafe(`DELETE FROM ${table}`);
				await sql.unsafe(
					`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1;`,
				);
			}
		} catch (error) {
			console.error(error);
		}
	});

	// Close the connection to the DB after all tests are done.
	afterAll(async () => {
		await sql.end();
		await server.stop();
	});

	test("Homepage was retrieved successfully.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/",
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(Object.keys(body).includes("message")).toBe(true);
		expect(Object.keys(body).includes("payload")).toBe(true);
		expect(body.message).toBe("Homepage!");
		expect(body.payload).toMatchObject({});
	});

	test("Invalid path returned error.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/tods",
		);

		expect(statusCode).toBe(StatusCode.NotFound);
		expect(Object.keys(body).includes("message")).toBe(true);
		expect(Object.keys(body).includes("payload")).toBe(true);
		expect(body.message).toBe("Invalid route: GET /tods");
		expect(body.payload).toMatchObject({});
	});

	test("Todo was created.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"POST",
			"/todos",
			{
				title: "Test Todo",
				description: "This is a test todo",
				dueAt: new Date(new Date().setDate(new Date().getDate() + 7)),
			},
		);

		expect(statusCode).toBe(StatusCode.Created);
		expect(Object.keys(body).includes("message")).toBe(true);
		expect(Object.keys(body).includes("payload")).toBe(true);
		expect(body.message).toBe("Todo created successfully!");
		expect(Object.keys(body.payload).includes("id")).toBe(true);
		expect(Object.keys(body.payload).includes("title")).toBe(true);
		expect(Object.keys(body.payload).includes("description")).toBe(true);
		expect(body.payload.id).toBe(1);
		expect(body.payload.title).toBe("Test Todo");
		expect(body.payload.description).toBe("This is a test todo");
		expect(body.payload.status).toBe("incomplete");
		expect(body.payload.createdAt).not.toBeNull();
		expect(body.payload.dueAt).not.toBeNull();
		expect(body.payload.editedAt).toBeNull();
		expect(body.payload.completedAt).toBeNull();
	});

	test("Todo was not created due to missing title.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"POST",
			"/todos",
			{
				description: "This is a test todo",
				dueAt: new Date(new Date().setDate(new Date().getDate() + 7)),
			},
		);

		expect(statusCode).toBe(StatusCode.BadRequest);
		expect(Object.keys(body).includes("message")).toBe(true);
		expect(Object.keys(body).includes("payload")).toBe(true);
		expect(body.message).toBe(
			"Request body must include title and description.",
		);
		expect(body.payload).toMatchObject({});
	});

	test("Todo was retrieved.", async () => {
		const todo = await createTodo();
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			`/todos/${todo.props.id}`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe("Todo retrieved");
		expect(body.payload.title).toBe(todo.props.title);
		expect(body.payload.description).toBe(todo.props.description);
		expect(body.payload.status).toBe(todo.props.status);
		expect(body.payload.createdAt).toBe(todo.props.createdAt.toISOString());
		expect(body.payload.dueAt).toBe(todo.props.dueAt?.toISOString());
		expect(body.payload.editedAt).toBeNull();
		expect(body.payload.completedAt).toBeNull();
	});

	test("Todo was not retrieved due to invalid ID.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/todos/abc",
		);

		expect(statusCode).toBe(StatusCode.BadRequest);
		expect(body.message).toBe("Invalid ID");
		expect(body.payload).toMatchObject({});
	});

	test("Todo was not retrieved due to non-existent ID.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/todos/1",
		);

		expect(statusCode).toBe(StatusCode.NotFound);
		expect(body.message).toBe("Not found");
		expect(body.payload).toMatchObject({});
	});

	test("Todo was updated.", async () => {
		const todo = await createTodo();
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"PUT",
			`/todos/${todo.props.id}`,
			{
				title: "Updated Test Todo",
			},
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe("Todo updated successfully!");
		expect(body.payload.title).toBe("Updated Test Todo");
		expect(body.payload.description).toBe(todo.props.description);
		expect(body.payload.status).toBe(todo.props.status);
		expect(body.payload.createdAt).toBe(todo.props.createdAt.toISOString());
		expect(body.payload.dueAt).toBe(todo.props.dueAt?.toISOString());
		expect(body.payload.editedAt).not.toBeNull();
		expect(body.payload.completedAt).toBeNull();
	});

	test("Todo was deleted.", async () => {
		const todo = await createTodo();
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"DELETE",
			`/todos/${todo.props.id}`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe("Todo deleted successfully!");
		expect(body.payload).toMatchObject({});
	});

	test("Todo was marked as complete.", async () => {
		const todo = await createTodo();
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"PUT",
			`/todos/${todo.props.id}/complete`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe("Todo marked as complete!");
		expect(body.payload.status).toBe("complete");
		expect(body.payload.completedAt).not.toBeNull();
		expect(body.payload.editedAt).not.toBe(todo.props.editedAt);
	});

	test("Todos were listed.", async () => {
		const todo1 = await createTodo();
		const todo2 = await createTodo();
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/todos",
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe("Todo list retrieved");
		expect(body.payload).toBeInstanceOf(Array);
		expect(body.payload[0].title).toBe(todo1.props.title);
		expect(body.payload[0].description).toBe(todo1.props.description);
		expect(body.payload[0].status).toBe(todo1.props.status);
		expect(body.payload[0].createdAt).toBe(
			todo1.props.createdAt.toISOString(),
		);
		expect(body.payload[0].dueAt).toBe(todo1.props.dueAt?.toISOString());
		expect(body.payload[0].editedAt).toBeNull();
		expect(body.payload[0].completedAt).toBeNull();
		expect(body.payload[1].title).toBe(todo2.props.title);
		expect(body.payload[1].description).toBe(todo2.props.description);
		expect(body.payload[1].status).toBe(todo2.props.status);
		expect(body.payload[1].createdAt).toBe(
			todo2.props.createdAt.toISOString(),
		);
		expect(body.payload[1].dueAt).toBe(todo2.props.dueAt?.toISOString());
		expect(body.payload[1].editedAt).toBeNull();
		expect(body.payload[1].completedAt).toBeNull();
	});

	test("Todos were listed and filtered by completion status.", async () => {
		const todo1 = await createTodo();
		await createTodo();
		await createTodo();
		await makeHttpRequest("PUT", `/todos/${todo1.props.id}/complete`);
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/todos?status=complete",
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe("Todo list retrieved");
		expect(body.payload).toBeInstanceOf(Array);
		expect(body.payload).toHaveLength(1);
		expect(body.payload[0].title).toBe(todo1.props.title);
		expect(body.payload[0].description).toBe(todo1.props.description);
		expect(body.payload[0].status).toBe("complete");
		expect(body.payload[0].createdAt).toBe(
			todo1.props.createdAt.toISOString(),
		);
		expect(body.payload[0].dueAt).toBe(todo1.props.dueAt?.toISOString());
		expect(body.payload[0].editedAt).not.toBeNull();
		expect(body.payload[0].completedAt).not.toBeNull();
	});

	test("Todos were not listed due to invalid status.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/todos?status=abc",
		);

		expect(statusCode).toBe(StatusCode.BadRequest);
		expect(body.message).toBe("Invalid status");
		expect(body.payload).toMatchObject({});
	});

	test("Todos were listed and sorted by due date.", async () => {
		const todo1 = await createTodo({
			title: "Todo 1",
			dueAt: new Date("2021-12-31"),
		});
		const todo2 = await createTodo({
			title: "Todo 2",
			dueAt: new Date("2022-02-01"),
		});
		const todo3 = await createTodo({
			title: "Todo 3",
			dueAt: new Date("2022-01-12"),
		});
		const todo4 = await createTodo({
			title: "Todo 4",
			dueAt: new Date("2022-01-01"),
		});
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			`/todos?sortBy=dueAt`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe("Todo list retrieved");
		expect(body.payload).toBeInstanceOf(Array);
		expect(body.payload).toHaveLength(4);
		expect(body.payload[0].title).toBe(todo1.props.title);
		expect(body.payload[1].title).toBe(todo4.props.title);
		expect(body.payload[2].title).toBe(todo3.props.title);
		expect(body.payload[3].title).toBe(todo2.props.title);
	});

	// TODO: Uncomment the following tests if implementing SubTodo functionality.

	// test("SubTodo was added to the Todo.", async () => {
	// 	const todo = await createTodo();
	// 	const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 		"POST",
	// 		`/todos/${todo.props.id}/subtodos`,
	// 		{
	// 			title: "Test SubTodo",
	// 			status: "incomplete",
	// 			createdAt: new Date(),
	// 		},
	// 	);

	// 	expect(statusCode).toBe(StatusCode.Created);
	// 	expect(body.message).toBe("SubTodo created successfully!");
	// 	expect(Object.keys(body.payload).includes("id")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("title")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("status")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("createdAt")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("todoId")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("description")).toBe(false);
	// 	expect(body.payload.title).toBe("Test SubTodo");
	// 	expect(body.payload.status).toBe("incomplete");
	// 	expect(body.payload.todoId).toBe(todo.props.id);
	// });

	// test("SubTodos were listed for the Todo.", async () => {
	// 	const todo = await createTodo();
	// 	const subTodoProps: SubTodoProps = {
	// 		title: "SubTodo 1",
	// 		status: "incomplete",
	// 		createdAt: new Date(),
	// 		todoId: todo.props.id!,
	// 	};

	// 	todo.addSubTodo(subTodoProps);

	// 	const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 		"GET",
	// 		`/todos/${todo.props.id}/subtodos`,
	// 	);

	// 	expect(statusCode).toBe(StatusCode.OK);
	// 	expect(body.message).toBe("SubTodo list retrieved");
	// 	expect(body.payload).toBeInstanceOf(Array);
	// 	expect(body.payload[0].title).toBe(subTodoProps.title);
	// 	expect(body.payload[0].status).toBe(subTodoProps.status);
	// 	expect(body.payload[0].createdAt).toBe(
	// 		subTodoProps.createdAt.toISOString(),
	// 	);
	// 	expect(body.payload[0].todoId).toBe(subTodoProps.todoId);
	// });

	// test("SubTodo was retrieved.", async () => {
	// 	const todo = await createTodo();
	// 	const subTodoProps: SubTodoProps = {
	// 		title: "SubTodo 1",
	// 		status: "incomplete",
	// 		createdAt: new Date(),
	// 		todoId: todo.props.id!,
	// 	};

	// 	todo.addSubTodo(subTodoProps);

	// 	const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 		"GET",
	// 		`/todos/${todo.props.id}/subtodos/1`,
	// 	);

	// 	expect(statusCode).toBe(StatusCode.OK);
	// 	expect(body.message).toBe("SubTodo retrieved");
	// 	expect(body.payload).not.toBeInstanceOf(Array);
	// 	expect(Object.keys(body.payload).includes("id")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("title")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("status")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("createdAt")).toBe(true);
	// 	expect(Object.keys(body.payload).includes("todoId")).toBe(true);
	// 	expect(body.payload.title).toBe(subTodoProps.title);
	// 	expect(body.payload.status).toBe(subTodoProps.status);
	// 	expect(body.payload.createdAt).toBe(
	// 		subTodoProps.createdAt.toISOString(),
	// 	);
	// 	expect(body.payload.todoId).toBe(subTodoProps.todoId);
	// });

	// test("SubTodo was updated.", async () => {
	// 	const todo = await createTodo();
	// 	const subTodoProps: SubTodoProps = {
	// 		title: "SubTodo 1",
	// 		status: "incomplete",
	// 		createdAt: new Date(),
	// 		todoId: todo.props.id!,
	// 	};

	// 	todo.addSubTodo(subTodoProps);

	// 	const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 		"PUT",
	// 		`/todos/${todo.props.id}/subtodos/1`,
	// 		{
	// 			title: "Updated Test SubTodo",
	// 		},
	// 	);

	// 	expect(statusCode).toBe(StatusCode.OK);
	// 	expect(body.message).toBe("SubTodo updated successfully!");
	// 	expect(body.payload.title).toBe("Updated Test SubTodo");
	// 	expect(body.payload.status).toBe("incomplete");
	// 	expect(body.payload.createdAt).not.toBeNull();
	// 	expect(body.payload.editedAt).not.toBeNull();
	// 	expect(body.payload.todoId).toBe(todo.props.id);
	// 	expect(Object.keys(body.payload).includes("description")).toBe(false);
	// });

	// test("SubTodo was deleted.", async () => {
	// 	const todo = await createTodo();
	// 	const subTodoProps: SubTodoProps = {
	// 		title: "SubTodo 1",
	// 		status: "incomplete",
	// 		createdAt: new Date(),
	// 		todoId: todo.props.id!,
	// 	};

	// 	todo.addSubTodo(subTodoProps);

	// 	const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 		"DELETE",
	// 		`/todos/${todo.props.id}/subtodos/1`,
	// 	);

	// 	expect(statusCode).toBe(StatusCode.OK);
	// 	expect(body.message).toBe("SubTodo deleted successfully!");
	// 	expect(body.payload).toMatchObject({});
	// });

	// test("SubTodo was marked as complete.", async () => {
	// 	const todo = await createTodo();
	// 	const subTodoProps: SubTodoProps = {
	// 		title: "SubTodo 1",
	// 		status: "incomplete",
	// 		createdAt: new Date(),
	// 		todoId: todo.props.id!,
	// 	};

	// 	todo.addSubTodo(subTodoProps);

	// 	const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 		"PUT",
	// 		`/todos/${todo.props.id}/subtodos/1/complete`,
	// 	);

	// 	expect(statusCode).toBe(StatusCode.OK);
	// 	expect(body.message).toBe("SubTodo marked as complete!");
	// 	expect(body.payload.status).toBe("complete");
	// 	expect(body.payload.completedAt).not.toBeNull();
	// });
});
