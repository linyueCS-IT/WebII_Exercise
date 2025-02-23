import postgres from "postgres";
import { title } from "process";

// Instantly available connection
const sql = postgres({
	database: "BookDB", // Replace with your DB name.
});

// --- Start of your code ---

/**
 * Please read the exercise for more detailed instructions.
 *
 * 1. Declare the interface.
 * 2. Declare the variable using the interface as the type.
 * 3. INSERT a new row and retrieve the newly inserted ID.
 * 4. SELECT the new row.
 * 5. (Optional) UPDATE the row.
 * 6. (Optional) DELETE the row.
 * 7. console.log() after each operation.
 */

// --- End of your code ---


// 1. Declare the interface.
interface Book {
	id?: number;
	title: string;
	author: string;
}
// 2. Declare the variable using the interface as the type.

// 2.1 Omit<Book, "id"> 
// const newBook: Omit<Book, "id"> = {  
//     // omit id
//     // title: "1984",
//     // author: "George Orwell"
// 	title: "War and Peace",
//     author: "Leo Tolstoy"
// };

// 2.2 Partial<Book>
// const newBook = {
//     title: "1984",
//     author: "George Orwell"
// } as Partial<Book>;  // `id` can be null

// 2.3 Make attribute option when define it
// interface Book {
//     id?: number; 
//     title: string;
//     author: string;
// }
const newBook = {  
    // omit id
    // title: "1984",
    // author: "George Orwell"
	// title: "War and Peace",
    // author: "Leo Tolstoy"
	// title : "The Catcher in the Rye",
	// author: "J.D. Salinger"
	title : "Pride and Prejudice",
	author: "J.D. Salinger"
};

// 3. INSERT a new row and retrieve the newly inserted ID. 

async function insertBook(book: Book){ 
	// [newBook] always get this one 	
	const [newBook] = await sql ` 	
	INSERT INTO book 	
	(title, author) 	
	VALUES 	
	(${book.title},${book.author}) 	
	RETURNING * 	
	` 	
	return newBook 	
} 
	
// INSERT a new row and retrieve the newly inserted ID. 	
const newBookValue = await insertBook(newBook); 	
const newBookID = newBookValue.id 	
console.log("Newly book id: ", newBookID); 	
// 4. SELECT the new row.  
	
async function selectBook(newBookID: number){ 	
	const selectResult = await sql ` 	
	SELECT * FROM book 	
	WHERE id = ${newBookID} 	
	` 	
	return selectResult; 	
} 
	
// const returnBook = await selectBook(newBookID); 	
// console.log("New book is",returnBook); 	
// 5. (Optional) UPDATE the row. 	
// 6. (Optional) DELETE the row. 
	
async function deleteBook(newBookID: number){ 	
	const deleteResult = await sql ` 	
	DELETE FROM book 	
	WHERE id = ${newBookID} 	
	RETURNING * 	
	` 	
	return deleteResult; 	
} 

const deleteValue = await deleteBook(1); 	
console.log(deleteValue); 	
// 7. console.log() after each operation.  


// 8. create a table
async function CreateTable() {
	const newTable = await sql `
		CREATE TABLE "book" ( 
    "id" SERIAL,
    "title" VARCHAR(100) NOT NULL, 
    "author" VARCHAR(100) NOT NULL, 
    CONSTRAINT "pk_book_id" 
        PRIMARY KEY ("id"),
    CONSTRAINT "uq_book_title" 
        UNIQUE ("title") 
	);`
}

await sql.end() 

// // 3. INSERT a new row and retrieve the newly inserted ID.
// async function InsertBook(newBook: Book){
// 	try{
// 		const insertResult = await sql`
// 			INSERT INTO book 
// 			(title,author) 
// 			VALUES
// 			(${newBook.title},${newBook.author})
// 			RETURNING id,title
// 			`;
// 		// retrieve the newly inserted ID.
// 		console.log(`Newly inserted row ID: ${insertResult[0].id}`);
// 		console.log(`Newly inserted row title: ${insertResult[0].title}`);
// 		// // 4. SELECT the new row.
// 		const selectResult = await sql`
// 			SELECT * FROM book
// 			WHERE id = (${insertResult[0].id})
// 		`
// 		console.log("Selecting row ", selectResult)
// 		// 5. (Optional) UPDATE the row.
// 		const updateResult = await sql `
// 			UPDATE book 
// 			SET author = 'Jane Austin'
// 			WHERE id = ${insertResult[0].id}
// 			RETURNING *
// 		`
// 		console.log("Update row ", updateResult)
// 		// 6. (Optional) DELETE the row.
// 		const deleteResult = await sql `
// 			DELETE FROM book
// 			WHERE id = ${insertResult[0].id}
// 			RETURNING *
// 		`
// 		console.log("Delete row: ",deleteResult)
// 		// 7. console.log() after each operation.
// 	}catch(err){
// 		console.error("Error:", err)
// 	}finally{
// 		await sql.end(); // Close the database connection
// 	}
// }
// InsertBook(newBook);



