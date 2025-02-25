import http, { IncomingMessage, ServerResponse } from "http";
import { database } from "./model";
import { url } from "inspector";
import { escape } from "querystring";
import { isJSDocReadonlyTag } from "typescript";
import { URL } from 'url';

/**
 * TODO: Copy the route handling logic from the previous exercise
 * into these functions. You will need to use the party array from
 * the model.ts file to handle the requests.
 */

// GET /
export const getHome = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'GET' && req.url === '/'){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");    
        res.end(
            JSON.stringify( 
                { message: "Hello from the Pokemon Server!" }, null,2             
        ));
    }
};

// GET /pokemon
/**
 * Get all pokemon
 * curl -v http://localhost:3000/pokemon
 * curl -v http://localhost:3000/pokemon?type=Water
 * curl -v http://localhost:3000/pokemon?sortBy=name
 * @param req 
 * @param res 
 */
export const getAllPokemon = (req: IncomingMessage, res: ServerResponse) => {
    console.log("Get all pokemon");
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const queryParams = url.searchParams;
    let newDatabase;
    const typeFilter = queryParams.get("type");
    const sortBy = queryParams.get("sortBy");
    const orderBy = queryParams.get("order");
    if (typeFilter) {
        newDatabase = database.filter(db => db.type === typeFilter);      
    }else{
        newDatabase = database;
    }

    if (sortBy === "name") {
    newDatabase.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
    }
   
    // **Response**
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Filtered Pokémon", data: newDatabase }, null, 2));
};

// GET /pokemon/:id
/**
 * curl -v http://localhost:3000/pokemon/1
 * @param req 
 * @param res 
 */
export const getOnePokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'GET'  && req.url){
        const urlParts = req.url.split('/');
        const pokemonId = parseInt(urlParts[2]);
        const foundPokemon = database.find( pokemon => pokemon.id === pokemonId)
        if (foundPokemon){
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");    
            res.end(
                JSON.stringify(
                    { message: "Pokemon found", payload:foundPokemon} , null, 2
                )
            );
        }else{
            res.statusCode = 404;
            res.end(
                JSON.stringify(
                    {message: "Pokemon not found"}, null, 2
                )
            )
        }       
    }
};

// POST /pokemon
/**
 * curl -v -X POST -H "Content-Type: application/json" -d '{"name": "Bulbasaur", "type": "Grass"}' http://localhost:3000/pokemon
 * @param req 
 * @param res 
 * @returns 
 */
export const createPokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST" && req.url === '/pokemon'){
        // Ensure the request has the correct Content-Type
        if (req.headers["content-type"] !== "application/json") {
            res.statusCode = 400;
            return res.end(JSON.stringify({ message: "Invalid Content-Type. Expected application/json" }, null, 2));
        }
        let body = '';
        req.on ('data', (chunk) =>{
            body += chunk.toString();
        });
        req.on('end' , () =>{
            const newPokemon = JSON.parse(body)
            newPokemon.id = database.length + 1; // Simple ID assignment         
            database.push(newPokemon);
            res.statusCode = 201; // 'Created'        
            res.setHeader('Content-Type', 'application/json');        
            res.end(JSON.stringify({ message: 'Pokemon created!', payload: newPokemon }, null, 2));    
        });
    }};

// PUT /pokemon/:id
/**
 * curl -v -X PUT -H "Content-Type: application/json" -d '{"type": "Poison"}' http://localhost:3000/pokemon/2
 * @param req 
 * @param res 
 * @returns 
 */
export const updatePokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "PUT" && req.url?.startsWith("/pokemon/")) {
        if (req.headers["content-type"] !== "application/json") {
            res.statusCode = 400;
            return res.end(JSON.stringify({ message: "Invalid Content-Type. Expected application/json" }, null, 2));
        }

        const urlParts = req.url.split("/");
        const pokemonId = parseInt(urlParts[urlParts.length - 1]);
        console.log(`Updating Pokémon with ID: ${pokemonId}`); // Log ID for debugging
        
        if (Number.isNaN(pokemonId)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ message: "Invalid Pokemon ID" }, null, 2));
        }
        
        // Check if Pokémon exists
        const foundPokemonIndex = database.findIndex(pokemon => pokemon.id === pokemonId);
        
        if (foundPokemonIndex === -1) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ message: 'Pokémon not found' }, null, 2));
        }
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const updateData = JSON.parse(body);

                // Apply updates only for provided fields
                database[foundPokemonIndex] = {
                    ...database[foundPokemonIndex],
                    ...updateData,
                };

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Pokémon updated!", payload: database[foundPokemonIndex] }, null, 2));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: "Invalid JSON format" }, null, 2));
            }
        });
    } else {
        res.statusCode = 405;
        res.end(JSON.stringify({ message: "Method Not Allowed" }, null, 2));
    }
};


// DELETE /pokemon/:id
/**
 * curl -v -X DELETE http://localhost:3000/pokemon/2
 * @param req 
 * @param res 
 * @returns 
 */
export const deletePokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'DELETE' && req.url?.startsWith('/pokemon/')){
        const urlParts = req.url.split('/');
        const pokemonId = parseInt(urlParts[2]);
        const foundPokemonIndex = database.findIndex(pokemon => pokemon.id === pokemonId) 
        if (foundPokemonIndex === -1){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ message: 'Pokemon not found' }, null, 2));
        }
        
        const deletedPokemon = database[foundPokemonIndex]; // Store before deleting
        database.splice(foundPokemonIndex, 1);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Pokemon deleted!', payload: deletedPokemon }, null, 2));
    }
};


