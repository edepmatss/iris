import { Bar, Scatter } from "react-chartjs-2";
import useFetchData from "../../utils/useFetchData";
import { useSearch } from "../../context/SearchContext";
import { Chart as ChartJS, registerables } from "chart.js";
import { MapPin } from "lucide-react";

ChartJS.register(...registerables);

const Module5 = () => {
	const { searchQuery } = useSearch();
	const { data, loading } = useFetchData("module5", searchQuery);

	if (loading || !data)
		return (
			<div className="p-10 text-gray-500 font-medium">
				Chargement de l'Analyse Territoriale...
			</div>
		);

	// 1. Stacked Bar Chart : Mouvements Démographiques (Naturel vs Migratoire)
	const stackedBarData = {
		labels: data.dynamics.map((d: any) => d.nom),
		datasets: [
			{
				label: "Solde Naturel (%)",
				data: data.dynamics.map((d: any) => d.naturel),
				backgroundColor: "#34d399", // Vert
				stack: "Stack 0",
			},
			{
				label: "Solde Migratoire (%)",
				data: data.dynamics.map((d: any) => d.migratoire),
				backgroundColor: "#60a5fa", // Bleu
				stack: "Stack 0",
			},
		],
	};

	// 2. Scatter Plot : Attractivité (Solde Migratoire vs Variation Population)
	const scatterData = {
		datasets: [
			{
				label: "Attractivité des départements",
				data: data.dynamics.map((d: any) => ({
					x: d.migratoire,
					y: d.variation,
				})),
				backgroundColor: "#f472b6", // Rose
			},
		],
	};

	// 3. Bar Chart : Typologie (Individuel vs Social)
	const typologyData = {
		labels: data.typology.map((d: any) => d.nom),
		datasets: [
			{
				label: "Maisons Individuelles (%)",
				data: data.typology.map((d: any) => d.individuels),
				backgroundColor: "#fbbf24", // Jaune
			},
			{
				label: "Logements Sociaux (%)",
				data: data.typology.map((d: any) => d.sociaux),
				backgroundColor: "#818cf8", // Indigo
			},
		],
	};

	// KPI basique
	const avgVariation =
		data.dynamics.length > 0
			? (
					data.dynamics.reduce(
						(acc: number, curr: any) =>
							acc + parseFloat(curr.variation),
						0,
					) / data.dynamics.length
				).toFixed(2)
			: 0;

	return (
		<div className="p-6 flex flex-col gap-6 bg-[#D5D5D8] h-full overflow-y-auto">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-800">
					Analyse Territoriale & Démographique
				</h2>

				<div className="bg-white px-6 py-3 rounded-xl shadow-sm flex items-center gap-4">
					<div className="bg-blue-50 p-3 rounded-lg text-blue-500">
						<MapPin size={24} />
					</div>
					<div>
						<p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
							Variation Démographique Moy.
						</p>
						<p className="text-xl font-black text-gray-800">
							{avgVariation} %
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Stacked Bar : Dynamique de population */}
				<div className="bg-white p-6 rounded-2xl shadow-sm min-h-[350px] flex flex-col lg:col-span-2">
					<h3 className="font-bold mb-4 text-gray-700">
						Moteurs de la croissance démographique (Naturel vs
						Migratoire)
					</h3>
					<div className="flex-1">
						<Bar
							data={stackedBarData}
							options={{
								maintainAspectRatio: false,
								scales: {
									x: { stacked: true },
									y: {
										stacked: true,
										title: {
											display: true,
											text: "Taux (%)",
										},
									},
								},
							}}
						/>
					</div>
				</div>

				{/* Scatter Plot : Attractivité */}
				<div className="bg-white p-6 rounded-2xl shadow-sm min-h-[350px] flex flex-col">
					<h3 className="font-bold mb-4 text-gray-700">
						Matrice d'attractivité (Migratoire vs Variation Globale)
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
											text: "Solde Migratoire (%)",
										},
									},
									y: {
										title: {
											display: true,
											text: "Variation Population Globale (%)",
										},
									},
								},
							}}
						/>
					</div>
				</div>

				{/* Bar Chart : Typologie */}
				<div className="bg-white p-6 rounded-2xl shadow-sm min-h-[350px] flex flex-col">
					<h3 className="font-bold mb-4 text-gray-700">
						Typologie du Parc (Individuel vs Social)
					</h3>
					<div className="flex-1">
						<Bar
							data={typologyData}
							options={{
								maintainAspectRatio: false,
								scales: {
									y: {
										title: {
											display: true,
											text: "Part dans le parc (%)",
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

export default Module5;
