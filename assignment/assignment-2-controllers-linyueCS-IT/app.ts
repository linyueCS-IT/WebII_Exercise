import postgres from "postgres";
import Server from "./src/Server";
import { HttpResponse, makeHttpRequest } from "./tests/client";
import { time } from "console";
import { title } from "process";
import Todo from "./src/models/Todo";

/**
 * Only use this if your tests are running slowly
 * and you need a way to test your server manually.
 */

const sql = postgres({
	database: "TodoDB",
});

const server = new Server({
	host: "localhost",
	port: 3000,
	sql,
});

const main = async () => {
	await server.start();

	const { statusCode, body }: HttpResponse = await makeHttpRequest(
		// "GET",
		// "/todos",
		// "GET",
		// "/todos/2",
		// "POST",
		// "/todos",
		// {
		// 	title : "webII",
		// 	description : "assignment"
		// },
		// "PUT",
		// "/todos/1",
		// {
		// 	title : "app dev",
		// 	description : "project"
		// }
		// "DELETE",
		// "/todos/1"
		// "POST",
		// "/todos/1/subtodos",
		// {
		// 	title: "Test SubTodo3",
		// 	status: "incomplete",
		// 	createdAt: new Date(),
		// }
		"GET",
		"/todos/1/subtodos",
	);

	console.log(statusCode, body);

	await sql.end();
	await server.stop();
};

main();
