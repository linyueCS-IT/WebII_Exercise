import React from "react"
function Welcome(props){
	return <h1 style={{color : props.color}}> Hello {props.name} </h1>
}

export default Welcome;