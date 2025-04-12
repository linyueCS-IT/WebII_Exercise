import { useState, useEffect } from "react";

function Clock() {
	const [time, setTime] = useState(new Date().toLocaleTimeString());

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date().toLocaleTimeString());
		}, 1000);

		return () => clearInterval(interval); // Cleanup to avoid memory leaks
	}, []);

	return (
		<div>
			<p>Current Time: {time}</p>
		</div>
	);
}

export default Clock;
