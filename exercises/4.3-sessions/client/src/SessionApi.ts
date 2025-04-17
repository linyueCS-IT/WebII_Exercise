/*It acts like a bridge between your client-side React code and your server-side Node/Express API:

*Makes fetch() requests to http://localhost:3000/session, /login, /pokemon

*Sends and receives cookies using credentials: 'include'

*Lets you interact with server-side session data from the browser
*/
const API_BASE = "http://localhost:3000";

export const getSession = async () => {
	const res = await fetch(`${API_BASE}/session`, {
		credentials: "include",
	});
	return res.json();
};

export const login = async (name: string) => {
	const res = await fetch(`${API_BASE}/login`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name }),
	});
	return res.json();
};

export const addPokemon = async (name: string) => {
	const res = await fetch(`${API_BASE}/pokemon`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name }),
	});
	return res.json();
};
