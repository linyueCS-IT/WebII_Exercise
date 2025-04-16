export default function ShowView({ pokemon }) {
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<th>Title</th>
						<th>Name</th>
						<th>Type</th>
						<th>Info</th>
					</tr>
					<tr>
						<td>{pokemon.id}</td>
						{/*adding checks to avoid runtime errors:*/}
						<td>{pokemon.name}</td>
						<td>{pokemon.type}</td>
						<td>{pokemon.info}</td>
					</tr>
				</tbody>
			</table>
			<img src={pokemon.image} alt="Pokemon" width="300" />
		</div>
	);
}
