import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar, Scatter } from "react-chartjs-2";
import useFetchData from "../utils/useFetchData";

import KpiCard from "../components/KpiCard";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

interface Module2Props {
	filters: { annee: string; region: string; dept: string };
}

interface ChartDataPoint {
	dept?: string;
	x: number;
	y: number;
}

export default function Module2({ filters }: Module2Props) {
	const queryParams = new URLSearchParams(filters).toString();
	const { data, loading } = useFetchData("dashboard-module2", queryParams);

	if (loading)
		return (
			<div className="p-10 text-center text-slate-400">
				Chargement du Module Social...
			</div>
		);

	const scatterRawData: ChartDataPoint[] = data?.scatter || [];
	const distributionRawData: ChartDataPoint[] = data?.distribution || [];

	const scatterChartData = {
		datasets: [
			{
				label: "Départements",
				data: scatterRawData,
				backgroundColor: "rgba(99, 102, 241, 0.6)",
				pointRadius: 6,
				pointHoverRadius: 8,
			},
		],
	};

	const scatterOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
		},
		scales: {
			x: {
				title: { display: true, text: "Pauvreté (%)" },
				grid: {
					color: "#334155",
					borderDash: [3, 3],
				},
			},
			y: {
				title: { display: true, text: "Social (%)" },
				grid: {
					color: "#334155",
					borderDash: [3, 3],
				},
			},
		},
	};

	const barChartData = {
		labels: distributionRawData.map(
			(d: ChartDataPoint) => d.dept || "Inconnu",
		),
		datasets: [
			{
				label: "Pauvreté",
				data: distributionRawData.map((d: ChartDataPoint) => d.x),
				backgroundColor: "#a855f7",
				borderRadius: { topLeft: 4, topRight: 4 },
			},
			{
				label: "Social",
				data: distributionRawData.map((d: ChartDataPoint) => d.y),
				backgroundColor: "#6366f1",
				borderRadius: { topLeft: 4, topRight: 4 },
			},
		],
	};

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: { font: { size: 11 } },
			},
		},
		scales: {
			x: {
				grid: { display: false },
				ticks: { font: { size: 10 } },
			},
			y: {
				grid: {
					color: "#334155",
					borderDash: [3, 3],
				},
			},
		},
	};

	return (
		<div className="space-y-8 animate-fade-in">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<KpiCard
					label="Chômage"
					value={data?.kpis?.chomage?.value}
					color="border-rose-400"
				/>
				<KpiCard
					label="Pauvreté"
					value={data?.kpis?.pauvrete?.value}
					color="border-amber-400"
				/>
				<KpiCard
					label="Loyer Moyen"
					value={data?.kpis?.loyer?.value}
					color="border-indigo-500"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
					<h3 className="text-xs font-bold text-slate-300 uppercase mb-6">
						Corrélation Pauvreté / Logement Social
					</h3>
					<div className="h-[300px] w-full relative">
						<Scatter
							data={scatterChartData}
							options={scatterOptions}
						/>
					</div>
				</div>

				<div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
					<h3 className="text-xs font-bold text-slate-300 uppercase mb-6">
						Distribution par département
					</h3>
					<div className="h-[300px] w-full relative">
						<Bar data={barChartData} options={barOptions} />
					</div>
				</div>
			</div>
		</div>
	);
}
