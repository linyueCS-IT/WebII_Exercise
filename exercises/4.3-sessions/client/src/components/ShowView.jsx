export default function ShowView({ pokemon }) {
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Type</th>
					</tr>
					<tr>
						<td>{pokemon.id}</td>
						<td>{pokemon.name}</td>
						<td>{pokemon.type}</td>
					</tr>
				</tbody>
			</table>
			<img
				src={`../assets/${pokemon.name}.png`}
				alt={pokemon.name}
				width="300"
			/>
		</div>
	);
}
