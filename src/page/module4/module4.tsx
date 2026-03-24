import { Bar, Doughnut } from "react-chartjs-2";
import useFetchData from "../../utils/useFetchData";
import { useSearch } from "../../context/SearchContext";
import { Chart as ChartJS, registerables } from "chart.js";
import { Banknote } from "lucide-react";

ChartJS.register(...registerables);

const Module4 = () => {
	const { searchQuery } = useSearch();
	const { data, loading } = useFetchData("module4", searchQuery);

	if (loading || !data)
		return (
			<div className="p-10 text-gray-500 font-medium">
				Chargement de la Dynamique du Parc...
			</div>
		);

	// Configuration du Bar Chart Groupé (Vacance 2021 vs 2023)
	const groupedBarData = {
		labels: data.vacance.map((d: any) => d.nom),
		datasets: [
			{
				label: "Taux de Vacance 2021 (%)",
				data: data.vacance.map((d: any) => d.vacants2021),
				backgroundColor: "#93c5fd", // Bleu clair
				borderRadius: 4,
			},
			{
				label: "Taux de Vacance 2023 (%)",
				data: data.vacance.map((d: any) => d.vacants2023),
				backgroundColor: "#3b82f6", // Bleu foncé
				borderRadius: 4,
			},
		],
	};

	// Configuration du Doughnut Chart (Part du Social)
	const partSociale = data.partSociale || 0;
	const partPrivee = 100 - partSociale;

	const doughnutData = {
		labels: ["Parc Social", "Parc Privé/Autre"],
		datasets: [
			{
				data: [partSociale, partPrivee],
				backgroundColor: ["#6366f1", "#e5e7eb"], // Indigo pour le social, Gris pour le reste
				hoverBackgroundColor: ["#4f46e5", "#d1d5db"],
				borderWidth: 0,
			},
		],
	};

	return (
		<div className="p-6 flex flex-col gap-6 bg-[#D5D5D8] h-full overflow-y-auto">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-800">
					Dynamique et Mobilité
				</h2>

				{/* KPI Financier */}
				<div className="bg-white px-6 py-3 rounded-xl shadow-sm flex items-center gap-4">
					<div className="bg-yellow-50 p-3 rounded-lg text-yellow-500">
						<Banknote size={24} />
					</div>
					<div>
						<p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
							Loyer Moyen Social
						</p>
						<p className="text-xl font-black text-gray-800">
							{data.loyerMoyen} €/m²
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Graphique Barres Groupées : Évolution Vacance */}
				<div className="bg-white p-6 rounded-2xl shadow-sm min-h-[350px] flex flex-col lg:col-span-2">
					<h3 className="font-bold mb-4 text-gray-700">
						Évolution de la Vacance (2021 vs 2023)
					</h3>
					<div className="flex-1">
						<Bar
							data={groupedBarData}
							options={{
								maintainAspectRatio: false,
								scales: {
									y: {
										title: {
											display: true,
											text: "Taux de vacance (%)",
										},
									},
								},
							}}
						/>
					</div>
				</div>

				{/* Doughnut Chart : Fluidité / Ratio Parc */}
				<div className="bg-white p-6 rounded-2xl shadow-sm min-h-[350px] flex flex-col items-center">
					<h3 className="font-bold mb-4 text-gray-700 self-start">
						Part du Parc Social (2023)
					</h3>
					<div className="flex-1 w-full max-w-[250px] relative flex justify-center items-center">
						<Doughnut
							data={doughnutData}
							options={{
								maintainAspectRatio: false,
								cutout: "75%", // Rend le beignet plus fin
								plugins: { legend: { position: "bottom" } },
							}}
						/>
						{/* Texte au centre du beignet */}
						<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
							<span className="text-3xl font-black text-gray-800">
								{partSociale}%
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Module4;
