import express from "express";
import pokemonRouter from "./router";
import { getHome } from "./controller"; // ideally should not be in the controller.
const hostname = "127.0.0.1";

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

/**
 * Home route
 * Responds with a welcome message when the root URL is accessed.
 */
app.get("/", getHome);
// app.get("/pokemon/:id", (req, res) => {
// 	console.log("req.url:", req.url); // original url "/pokemon/1"
// 	console.log("req.path:", req.path); // path "/pokemon/1"
// 	console.log("req.params:", req.params); // Path parameter
// 	console.log("req.query:", req.query); // Query parameter { id: "1" }

// res.send("Check the console for req details!");
// });

/**
 * Indicate the router for the endpoint.
 */
app.use("/pokemon", pokemonRouter);
/**
 * if there were multiple endpoints in the application.
 * you'd for example, if there was /pokemonmovies
 * there would be a router to handle the endpoint and in the server.ts
 * app.use("/pokemonmovies",pokemonMoviesRouter)
 */

/**
 * Starts the Express server and listens on the specified port.
 */
app.listen(port, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
