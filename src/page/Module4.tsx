import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import useFetchData from "../utils/useFetchData";

import KpiCard from "../components/KpiCard";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
);

interface Module4Props {
	filters: { annee: string; region: string; dept: string };
}

interface VacEvolPoint {
	dept: string;
	v21: number;
	v23: number;
}

export default function Module4({ filters }: Module4Props) {
	const queryParams = new URLSearchParams({
		annee: filters.annee || "2023",
		region: filters.region || "",
		dept: filters.dept || "",
	}).toString();

	const { data, loading } = useFetchData("dashboard-module4", queryParams);

	if (loading)
		return (
			<div className="p-10 text-center text-stone-400">
				Calcul des dynamiques en cours...
			</div>
		);

	const vacEvol: VacEvolPoint[] = data?.vacanceEvol || [];
	const partSociale: number = data?.kpis?.partSociale?.raw || 0;

	const barChartData = {
		labels: vacEvol.map((d: VacEvolPoint) => d.dept),
		datasets: [
			{
				label: "2021",
				data: vacEvol.map((d: VacEvolPoint) => d.v21),
				backgroundColor: "rgba(14, 116, 144, 0.6)",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.7,
			},
			{
				label: "2023",
				data: vacEvol.map((d: VacEvolPoint) => d.v23),
				backgroundColor: "#0e7490",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.7,
			},
		],
	};

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: { font: { size: 11 }, color: "#78716c" },
			},
		},
		scales: {
			x: {
				grid: { display: false },
				ticks: { font: { size: 11 } },
			},
			y: {
				grid: {
					color: "#f0f0f0",
					borderDash: [3, 3],
				},
				ticks: { font: { size: 11 } },
			},
		},
	};

	const doughnutData = {
		labels: ["Parc Social", "Parc Privé"],
		datasets: [
			{
				data: [partSociale, 100 - partSociale],
				backgroundColor: ["#0e7490", "#f5f5f4"],
				borderWidth: 0,
				cutout: "75%",
			},
		],
	};

	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
		},
	};

	return (
		<div className="space-y-8 animate-fade-in">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<KpiCard
					label="Loyer Moyen Social"
					value={data?.kpis?.loyerMoyen?.value}
					color="border-cyan-700"
					trend="up"
				/>
				<KpiCard
					label="Part Parc Social"
					value={data?.kpis?.partSociale?.value}
					color="border-emerald-500"
					trend="up"
				/>
				<KpiCard
					label="Écart Vacance 21→23"
					value={data?.kpis?.ecartVacance?.value}
					color="border-rose-500"
					trend={data?.kpis?.ecartVacance?.raw > 0 ? "up" : "down"}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
					<h3 className="text-xs font-bold text-stone-500 uppercase mb-6">
						Évolution de la vacance 2021 → 2023
					</h3>
					<div className="h-[280px] w-full relative">
						<Bar data={barChartData} options={barOptions} />
					</div>
				</div>

				<div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
					<h3 className="text-xs font-bold text-stone-500 uppercase mb-6 w-full text-left">
						Part du parc social
					</h3>
					<div className="relative w-[200px] h-[200px]">
						<Doughnut
							data={doughnutData}
							options={doughnutOptions}
						/>

						<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
							<span className="text-2xl font-bold font-['JetBrains_Mono'] text-slate-800">
								{partSociale.toFixed(1)}%
							</span>
							<span className="text-[10px] text-stone-400">
								Social
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
