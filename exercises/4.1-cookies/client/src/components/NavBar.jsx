import { Link } from "react-router-dom";
import DisplayOne from "./DisplayOne";
import DisplayAll from "./DisplayAll";
import Home from "./Home";
import LanguageSelector from "./LanguageSelector";
import { getCookie } from "./cookieUtils";

function NavBar() {
	const language = getCookie("language", "en");
	const homeText = language === "fr" ? "Accueil" : "Home";
	const DisplayOneText =
		language === "fr" ? "Lister un Pokémon" : "DisplayOne";
	const DisplayAllText =
		language === "fr" ? "Lister tous les Pokémon" : "DisplayAll";
	return (
		<nav className="nav">
			<LanguageSelector />
			<ul>
				<li>
					{/* <Link to="/"> home</Link> */}
					<Link to="/"> {homeText}</Link>
				</li>
				<li>
					{/* <Link to="/list-one"> DisplayOne</Link> */}
					<Link to="/list-one"> {DisplayOneText}</Link>
				</li>
				<li>
					{/* <Link to="/list-all"> DisplayAll</Link> */}
					<Link to="/list-all"> {DisplayAllText}</Link>
				</li>
			</ul>
		</nav>
	);
}
export default NavBar;
