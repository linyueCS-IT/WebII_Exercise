import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

function NavBar() {
	return (
		<nav className="nav">
			<ul>
				<li>
					<Link to="/list-one">List Single Pokemon</Link>
				</li>
				<li>
					<Link to="/list-all">List All Pokemon</Link>
				</li>
			</ul>
		</nav>
	);
}
export default NavBar;
