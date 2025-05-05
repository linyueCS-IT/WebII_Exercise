import Logo from "/assets/Logo.png";

function Home() {
	return (
		<>
			<h1>Welcome to the Pokedex!</h1>

			<img src={Logo} alt="Pokemon Logo" />
		</>
	);
}

export default Home;
