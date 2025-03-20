import React from "react"


function Greeting(props){
	// return <h1 style={{color: "SteelBlue"}}> Hello there {props.name} </h1>
	return <h2 style={{color : props.color}}> Hello {props.name} </h2>
}
export default Greeting;