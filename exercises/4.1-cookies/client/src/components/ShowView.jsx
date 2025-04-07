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
						<td>{pokemon.name?.en}</td>
						<td>{pokemon.type?.en}</td>
						<td>{pokemon.info?.en}</td>
					</tr>
				</tbody>
			</table>
			<img src={pokemon.image} alt="Pokemon" width="300" />
		</div>
	);
}
