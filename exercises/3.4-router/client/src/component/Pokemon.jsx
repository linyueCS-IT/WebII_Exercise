import { useParams } from "react-router-dom";

export default function Pokemon() {
	let { username } = useParams();
	return <h1>Profile of {username}</h1>;
}
