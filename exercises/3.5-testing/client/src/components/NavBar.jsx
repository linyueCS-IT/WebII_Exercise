import { Link } from "react-router-dom";

function NavBar() {
	return (
		<nav className="nav">
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/new">Add New Pokemon</Link>
				</li>
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
