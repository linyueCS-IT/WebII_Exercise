import postgres from "postgres";
import Server from "./src/Server";
import { HttpResponse, makeHttpRequest } from "./tests/client";

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
		"GET",
		"/todos",
	);

	console.log(statusCode, body);

	await sql.end();
	await server.stop();
};

main();
