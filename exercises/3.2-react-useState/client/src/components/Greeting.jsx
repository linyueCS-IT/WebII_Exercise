import React from "react";
import { useState } from "react";

// Example 2 : Changing a HTML element Add a toggle function to change the colour of the
// text to red if blue, and vice versa. Watch the change using Inspect on the browser.
function Greeting(props) {
	const [color, setColor] = useState("green");
	const toggle = (color) => {
		return color === "orange" ? "green" : "orange";
	};

	return (
		<div>
			<h2 style={{ color: color }}> Meet my {props.name} </h2>
			<button onClick={() => setColor(toggle(color))}>
				Toggle Color
			</button>
		</div>
	);
}
export default Greeting;
