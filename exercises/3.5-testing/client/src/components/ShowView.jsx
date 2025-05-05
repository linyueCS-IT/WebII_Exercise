export default function ShowView({ pokemon }) {
	return (
		<div>
			<div>
				<p>
					<strong>Title:</strong> {pokemon.name}
				</p>
				<p>
					<strong>Kind:</strong> {pokemon.type}
				</p>
			</div>
			<img
				src={`../assets/${pokemon.name}.png`}
				alt={pokemon.name}
				width="300"
			/>
		</div>
	);
}
