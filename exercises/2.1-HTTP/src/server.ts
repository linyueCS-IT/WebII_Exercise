import http, { IncomingMessage, ServerResponse } from "http"; // The core Node module we're using to build our server.

interface Pokemon {  
    id: number;  
    name: string;  
    type: string;
}
const database: Pokemon[] = [  
    // Add one Pokemon object here with ID 1.
    {
        id: 1,
        name: "Psyduck",
        type: "Water"
    },
    {
        id: 2,
        name: "Cubone",
        type: "Ground"
    }
];

const hostname = "127.0.0.1"; // or 'localhost'
const port = 3000;
/**
 *  req: Request Object
 *  res: Response Object
 */
const server = http.createServer(  (req: IncomingMessage, res: ServerResponse) => {    // Request handling will come later!  
    /** GET command   

     */
    if (req.method === "GET" && req.url === "/") {
        res.statusCode = 200;    
        res.setHeader("Content-Type", "application/json");    
        res.end(    
        JSON.stringify(    
            { message: "Hello from the Pokemon Server!" }, null,2 
        ));
    } 
 
    /** Get pokemon by id-- get one pokemon
     // Replace '1' with the Pokemon's ID
     curl -v http://localhost:3000/pokemon/1     
     */
    else if (req.method === 'GET' && req.url?.startsWith('/pokemon/')) {    
        // Find Pokemon by ID    
        const urlParts = req.url.split('/');    
        const pokemonId = parseInt(urlParts[2]);
        
        const foundPokemon = database.find(pokemon => pokemon.id === pokemonId);
        
        if (foundPokemon) {
            res.statusCode = 200;        
            res.setHeader('Content-Type', 'application/json');        
            res.end(JSON.stringify({ message: 'Pokemon found', payload: foundPokemon }, null, 2));    
        } else {        
                res.statusCode = 404;        
                res.end(JSON.stringify({ message: 'Pokemon not found' }, null, 2));
        }
    } 
    /** Get all pokemon
      curl -v http://localhost:3000/pokemon    
     */
    else if (req.method === "GET" && req.url === "/pokemon") {      
    // Existing: Get all Pokemon ...
        res.statusCode = 200;      
        res.setHeader("Content-Type", "application/json");      
        res.end(      
            JSON.stringify(      
            { message: "All Pokemon", payload: database }, null,2      
        ));      
    } 
    /** POST
curl -X POST http://localhost:3000/pokemon \
-H "Content-Type: application/json" \
-d '{"name":"Bulbasaur", "type":"Grass poison"}'   
    
    curl -X POST http://localhost:3000/pokemon \
    -H "Content-Type: application/json" \
    -d '{"name":"Pikachu","type":"Electric"}'
    */
    else if (req.method === 'POST' && req.url === '/pokemon') {    
        let body = ''; // To store incoming data    
        req.on('data', (chunk) => {        
            body += chunk.toString();    
        });
        
        req.on('end', () => {        
            const newPokemon = JSON.parse(body);
            // Add basic data logic (you'd likely use a database in a real application)        
            newPokemon.id = database.length + 1; // Simple ID assignment         
            database.push(newPokemon);
            res.statusCode = 201; // 'Created'        
            res.setHeader('Content-Type', 'application/json');        
            res.end(JSON.stringify({ message: 'Pokemon created!', payload: newPokemon }, null, 2));    
        });

      /** PUT : update data
curl -X PUT http://localhost:3000/pokemon/2 \
-H "Content-Type: application/json" \
-d '{"name":"Pikachu","type":"Electric"}'
       */
    } else if (req.method === 'PUT' && req.url?.startsWith('/pokemon/')) {
        // Find id  http://localhost:3000/pokemon
        // Extract Pokémon ID from URL
        const urlParts = req.url.split('/');
        const pokemonId = parseInt(urlParts[2]);

        // Find Pokémon by ID
        const foundPokemonIndex = database.findIndex(pokemon => pokemon.id === pokemonId);

        if (foundPokemonIndex === -1) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ message: 'Pokemon not found' }, null, 2));
        }

        let body = ''; // To store incoming data
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updatePokemon = JSON.parse(body);

                // Ensure received data contains valid properties
                if (!updatePokemon.name || !updatePokemon.type) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ message: 'Invalid request body. Name and type are required.' }, null, 2));
                }

                // Update the Pokémon data
                database[foundPokemonIndex] = { id: pokemonId, ...updatePokemon };

                res.statusCode = 200; // 'OK'
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Pokemon updated!', payload: database[foundPokemonIndex] }, null, 2));
            } catch (error) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Invalid JSON format' }, null, 2));
            }
        });       
    }
    /** DELETE
     curl -X DELETE http://localhost:3000/pokemon/2      
     
     */
    else if (req.method === 'DELETE' && req.url?.startsWith('/pokemon/')){
        const urlParts = req.url.split('/');
        const pokemonId = parseInt(urlParts[2]);
        const foundPokemonIndex = database.findIndex(pokemon => pokemon.id === pokemonId) 
        if (foundPokemonIndex === -1){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ message: 'Pokemon not found' }, null, 2));
        }       
        // delete a element by index
        database.splice(foundPokemonIndex, 1);
        res.statusCode = 200; // 'OK'
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Pokemon delete!', payload: database[foundPokemonIndex] }, null, 2));
    
    }   
});
server.listen(port, hostname, () => { 
    console.log(`Server running at http://${hostname}:${port}/`);
});


