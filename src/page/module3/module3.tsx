import { Bar, Scatter } from "react-chartjs-2";
import useFetchData from "../../utils/useFetchData";
import { useSearch } from "../../context/SearchContext";
import { Chart as ChartJS, registerables } from "chart.js";
import { Home } from "lucide-react";

ChartJS.register(...registerables);

const Module3 = () => {
	const { searchQuery } = useSearch();
	const { data, loading } = useFetchData("module3", searchQuery);

	if (loading || !data)
		return (
			<div className="p-10 text-gray-500 font-medium">
				Chargement du Module...
			</div>
		);

	// Configuration du graphique en Barres Horizontales (Vacance)
	const horizontalBarData = {
		labels: data.vacance.map((d: any) => d.region),
		datasets: [
			{
				label: "Taux de logements vacants (%)",
				data: data.vacance.map((d: any) => d.taux_vacance),
				backgroundColor: "#f43f5e",
				borderRadius: 4,
			},
		],
	};

	// Configuration du Scatter Plot (Maisons vs Social)
	const scatterData = {
		datasets: [
			{
				label: "Départements (Maisons vs Social)",
				data: data.scatter.map((d: any) => ({ x: d.x, y: d.y })),
				backgroundColor: "#8b5cf6",
			},
		],
	};

	// Calcul du KPI Résidences Principales
	const tauxPrincipaux =
		data.kpi.total > 0
			? ((data.kpi.principaux / data.kpi.total) * 100).toFixed(1)
			: 0;

	return (
		<div className="p-6 flex flex-col gap-6 bg-[#D5D5D8] h-full overflow-y-auto">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-800">
					Dynamique du Parc & Vacance
				</h2>

				{/* KPI */}
				<div className="bg-white px-6 py-3 rounded-xl shadow-sm flex items-center gap-4">
					<div className="bg-emerald-50 p-3 rounded-lg text-emerald-500">
						<Home size={24} />
					</div>
					<div>
						<p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
							Résidences Principales
						</p>
						<p className="text-xl font-black text-gray-800">
							{tauxPrincipaux} %
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Graphique Barres Horizontales */}
				<div className="bg-white p-6 rounded-2xl shadow-sm min-h-[400px] flex flex-col">
					<h3 className="font-bold mb-4 text-gray-700">
						Taux de vacance par Région
					</h3>
					<div className="flex-1">
						<Bar
							data={horizontalBarData}
							options={{
								indexAxis: "y", // Graphique horizontal
								maintainAspectRatio: false,
								plugins: { legend: { display: false } },
								scales: {
									x: {
										title: {
											display: true,
											text: "% de logements vacants",
										},
									},
								},
							}}
						/>
					</div>
				</div>

				{/* Graphique Scatter Plot */}
				<div className="bg-white p-6 rounded-2xl shadow-sm min-h-[400px] flex flex-col">
					<h3 className="font-bold mb-4 text-gray-700">
						Maisons individuelles vs Logement Social
					</h3>
					<div className="flex-1">
						<Scatter
							data={scatterData}
							options={{
								maintainAspectRatio: false,
								scales: {
									x: {
										title: {
											display: true,
											text: "Taux de maisons individuelles (%)",
										},
									},
									y: {
										title: {
											display: true,
											text: "Taux de logements sociaux (%)",
										},
									},
								},
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Module3;
