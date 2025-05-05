import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewPokemon() {
	const [inputField, setInputField] = useState({
		name: "",
		type: "",
	});
	const navigate = useNavigate();
	const inputsHandler = (event) => {
		const { name, value } = event.target;
		setInputField((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const submitHandler = async (event) => {
		event.preventDefault(); // prevent page reload
		const requestOptions = {
			method: "POST",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: inputField.name,
				type: inputField.type,
			}),
		};

		try {
			const response = await fetch(
				"http://localhost:3000/pokemon",
				requestOptions
			);

			if (response.ok) {
				setInputField({ name: "", type: "" }); //resetting the form
				navigate("/list-all"); //  redirect
			}
		} catch (error) {
			console.error("Error creating Pokemon:", error);
			alert("An Error occurred posting Todo:", error);
		}
	};

	return (
		<div>
			<h1>Add New Pokemon</h1>
			<table>
				<tbody>
					<tr>
						<td>Name</td>
						<td>
							<input
								type="text"
								name="name"
								value={inputField.name}
								placeholder=" Enter Name"
								onChange={inputsHandler}
							/>
						</td>
					</tr>
					<tr>
						<td>Type</td>
						<td>
							<input
								type="text"
								name="type"
								value={inputField.type}
								placeholder=" Enter Type"
								onChange={inputsHandler}
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<button onClick={submitHandler} style={{ marginTop: "16px" }}>
				Add Pokemon
			</button>
		</div>
	);
}

export default NewPokemon;
