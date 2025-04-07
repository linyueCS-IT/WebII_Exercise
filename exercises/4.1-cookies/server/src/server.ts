import http from "http";
import { handleRequest } from "./router";

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
