import React from "react";
import "./App.css";
import Greeting from "./components/Greeting";
import PokemonList from "./components/PokemonList";
import Welcome from "./components/Welcome";
import MainHeader from "./components/MainHeader";
import { useState } from "react";

// class Welcome extends React.Component {
// 	constructor(props) {
// 	  super(props);
// 	}
// 	render() {
// 	  return <h1 style={{color: "SteelBlue"}} >Meet my {this.props.name}</h1>;
// 	}
// }

// function Welcome(props){
// 	return <h1 style={{color : props.color}}> Hello {props.name} </h1>
// }
// function Greeting(props){
// 	// return <h1 style={{color: "SteelBlue"}}> Hello there {props.name} </h1>
// 	return <h2 style={{color : props.color}}> Hello {props.name} </h2>
// }
// const PokemonList = (props) =>{
// 	return (
// 		<ul>
// 			{props.pokemons.map((pokemon) =>(
// 				<li > {pokemon}</li>
// 			))}
// 		</ul>
// 	)
// }

function App() {
	// const name = "Linyue";
	// const name2 = "Pokemon";
	// const myColor = "SteelBlue";
	// const myPokemons = ["Charmander", "Bulbasaur", "Pikachu", "Squirtle"]
	const [count, setCount] = useState(0);
	
	return (
		<div className="container">
			<article>
				<hgroup>
					<div>
						{/* <h1 style={{color: "SteelBlue"}}> Meet my {name}</h1> */}
						{/* <Welcome name="Pokemons" /> */}
						{/* <Greeting name = "Pokemon" /> */}
						{/* <Welcome name = {name} color = {myColor} />
						<Greeting name = {name2} />
						<p>My friend has <b>power</b></p> */}
						{/* {
							<ul>
								{myPokemon.map((pokemon) =>(
									<li > {pokemon}</li>
								))}
							</ul>
						} */}
						{/* <PokemonList pokemons ={myPokemons}></PokemonList> */}
						<MainHeader /> {" "}
					</div>
				</hgroup>
				<h3> Counter: {count} </h3>
				{/* <button onClick={() => alert("Hi there")} >Click Me</button> */}
			</article>
			<button onClick={() => setCount(count + 1)}>Increase</button>
		</div>
	);
}

export default App;
