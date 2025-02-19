import fs from "fs";
import { json } from "stream/consumers";

/** JSDoc annotations
 * 
 * @param {*} filename 
 * return string 
 */
export function readFromJsonFile(filename){
    let rawText = fs.readFileSync(filename).toString();
    let parsedJson = JSON.parse(rawText);
    return parsedJson
}

/**
 * 
 * @param {*} filename 
 * @param {*} data 
 */
export function writeToJsonFile(filename, data){
    let stringToWrite = JSON.stringify(data);
    fs.writeFileSync(filename,stringToWrite)
} 