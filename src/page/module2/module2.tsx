import { Scatter, Bubble } from "react-chartjs-2";
import useFetchData from "../../utils/useFetchData";
import { useSearch } from "../../context/SearchContext";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const Module2 = () => {
	const { searchQuery } = useSearch();
	const { data, loading } = useFetchData("module2", searchQuery);

	if (loading || !data)
		return <div className="p-10">Chargement du Module Social...</div>;

	const scatterData = {
		datasets: [
			{
				label: "Pauvreté vs Logement Social",
				data: data.scatter.map((d: any) => ({ x: d.x, y: d.y })),
				backgroundColor: "#6366f1",
			},
		],
	};

	const bubbleData = {
		datasets: [
			{
				label: "Top 10 Chômage (Taille = Parc Total)",
				data: data.bubble.map((d: any) => ({
					x: d.chomage,
					y: d.loyer,
					r: d.size / 50000, // Ajustez le ratio selon vos données
				})),
				backgroundColor: "rgba(14, 165, 233, 0.6)",
			},
		],
	};

	return (
		<div className="p-6 flex flex-col gap-6 bg-[#D5D5D8] h-full overflow-y-auto">
			<h2 className="text-2xl font-bold text-gray-800">
				Logement Social et Précarité
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Graphique de Corrélation */}
				<div className="bg-white p-6 rounded-2xl shadow-sm">
					<h3 className="font-bold mb-4">
						Corrélation Pauvreté / Logement Social
					</h3>
					<Scatter
						data={scatterData}
						options={{
							scales: {
								x: {
									title: {
										display: true,
										text: "Taux de Pauvreté (%)",
									},
								},
								y: {
									title: {
										display: true,
										text: "Taux Logements Sociaux (%)",
									},
								},
							},
						}}
					/>
				</div>

				{/* Graphique en Bulles */}
				<div className="bg-white p-6 rounded-2xl shadow-sm">
					<h3 className="font-bold mb-4">
						Focus Chômage & Loyers (Top 10)
					</h3>
					<Bubble
						data={bubbleData}
						options={{
							scales: {
								x: {
									title: {
										display: true,
										text: "Taux de Chômage (%)",
									},
								},
								y: {
									title: {
										display: true,
										text: "Loyer Moyen (€/m²)",
									},
								},
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Module2;
