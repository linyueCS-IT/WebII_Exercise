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
		// -----get todos----
		// "GET",
		// "/todos",
		// -----get todo----		
		// "GET",
		// "/todos/2",
		// -----post todo----
		// "POST",
		// "/todos",
		// {
		// 	title : "webIII",
		// 	description : "assignment"
		// },
		// -----update todo----
		// "PUT",
		// "/todos/1",
		// {
		// 	title : "app dev",
		// 	description : "project"
		// }
		// -----update todo complete ----
		// "PUT",
		// "/todos/1/complete",
		// -----delete todo ----
		// "DELETE",
		// "/todos/1"
		// -----post subTodo----
		// "POST",
		// "/todos/1/subtodos",
		// {
		// 	title: "Test SubTodo3",
		// 	status: "incomplete",
		// 	createdAt: new Date(),
		// }
		// -----get subtodos----
		// "GET",
		// "/todos/1/subtodos",
		// -----get subtodo----
		// -----put subtodo complete----
		"PUT",
		"/todos/1/subtodos/1/complete",	
		// -----put subtodo complete----
		// "PUT",
		// "/todos/1/subtodos/1",
		// {
		// 	title: "Updated Test SubTodo"
		// }			
			
	);

	console.log(statusCode, body);

	await sql.end();
	await server.stop();
};

main();
