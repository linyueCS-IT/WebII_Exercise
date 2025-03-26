import React from "react";
import { useState } from "react";

function Greeting(props){
	const [color, setColor] = useState("green");
	const toggle = (color) =>{
		return color === "blue"? "red" : "blue"
	};

	return (
		<div>
			<h2 style={{color : color}}> Meet my {props.name} </h2>
    			<button onClick={() => setColor(toggle(color))}>
                Toggle Color
    		</button>
		</div>
	);	
}
export default Greeting;