import Greeting from "./Greeting";
import Welcome from "./Welcome";
import React from "react";
// import HeaderBody from;

function MainHeader(){
    const name = "Pokemons";
    const color = "SteelBlue";
	return (
		<>
            <Welcome name = {name} color = {color}/>
            <Greeting name = {name} color = {color}/>
		</>
	);
}

export default MainHeader;