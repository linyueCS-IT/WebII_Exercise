import fs from "fs";
import { readFromJsonFile, writeToJsonFile} from "./utilities.js";
import { faker } from "@faker-js/faker";
// User-Defined Modules
// Step 4 : call writeFileSync()
fs.writeFileSync('./core-modules.txt','hello world!');

// Step 5 : npm init -y create a package.jason
/**Step 6 : 
 * {
    "name": "src",
    "version": "1.0.0",
    "type": "module",
    ...
}
 */

// Step 6.3 : fs.readFileSync(...)
const content = fs.readFileSync('./core-modules.txt');
// Step 6.4 : .toString()
console.log(content.toString());

const pokemon = readFromJsonFile('pokemon.json');
console.log(pokemon);
writeToJsonFile('pokemon.json', pokemon);

// NPM Modules
// Step 5 npm i @faker-js/faker
// Step 6 : import { faker } from "@faker-js/faker";
// step 7 : use faker to randomly-generated nickname for each pokemon nickname
// function generateNickName(){
//     // return faker.person.firstName();
//     return faker.internet.username();
// }

pokemon.forEach(function (poke){
    poke.nickname = faker.person.firstName();
});
console.log(pokemon);