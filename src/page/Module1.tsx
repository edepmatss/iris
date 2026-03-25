import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useFetchData from "../utils/useFetchData";

import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

interface Module1Props {
	filters: { annee: string; region: string; dept: string };
}

interface DataRow {
	name?: string;
	val?: string | number;
}

export default function Module1({ filters }: Module1Props) {
	const queryParams = new URLSearchParams({
		annee: filters.annee || "2023",
		region: filters.region || "",
		dept: filters.dept || "",
	}).toString();

	const { data, loading } = useFetchData("dashboard-module1", queryParams);

	if (loading)
		return (
			<div className="p-10 text-center text-slate-400 font-medium">
				Analyse des données IRIS...
			</div>
		);

	const kpis = data?.kpis || {};

	const densiteData =
		data?.map?.map((d: DataRow) => ({
			name: d.name || "Inconnu",
			val: parseFloat(String(d.val || 0)),
		})) || [];

	const top5Data =
		data?.top5?.map((d: DataRow) => ({
			name: d.name || "Inconnu",
			val: parseFloat(String(d.val || 0)),
		})) || [];

	const densiteChartData = {
		labels: densiteData.map((d: DataRow) => d.name),
		datasets: [
			{
				label: "Densité",
				data: densiteData.map((d: DataRow) => d.val),
				backgroundColor: "#6366f1",
				borderRadius: { topRight: 4, bottomRight: 4 },
				barThickness: 20,
			},
		],
	};

	const densiteOptions = {
		indexAxis: "y" as const,
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
		},
		scales: {
			x: {
				display: false,
				grid: { display: false },
			},
			y: {
				border: { display: false },
				grid: {
					color: "#f0f0f0",
					drawTicks: false,
				},
				ticks: {
					font: { size: 11 },
				},
			},
		},
	};

	const top5ChartData = {
		labels: top5Data.map((d: DataRow) => d.name),
		datasets: [
			{
				label: "Volume",
				data: top5Data.map((d: DataRow) => d.val),
				backgroundColor: "#a855f7",
				borderRadius: { topLeft: 4, topRight: 4 },
				barThickness: 35,
			},
		],
	};

	const top5Options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
		},
		scales: {
			x: {
				border: { display: false },
				grid: { display: false },
				ticks: {
					font: { size: 11 },
				},
			},
			y: {
				border: { display: false },
				grid: {
					color: "#334155",
					drawTicks: false,
				},
				ticks: {
					font: { size: 11 },
				},
			},
		},
	};

	return (
		<div className="animate-fade-in space-y-8">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
				<KpiCard
					label="Log. Sociaux"
					value={kpis.logementsSociaux?.value}
					color="border-indigo-500"
				/>
				<KpiCard
					label="Taux Chômage"
					value={kpis.chomage?.value}
					color="border-rose-400"
				/>
				<KpiCard
					label="Logts Vacants"
					value={kpis.vacance?.value}
					color="border-amber-400"
				/>
				<KpiCard
					label="Loyer Social"
					value={kpis.loyer?.value}
					color="border-teal-400"
				/>
				<KpiCard
					label="Parc Total"
					value={kpis.parcTotal?.value}
					color="border-slate-500"
				/>
				<KpiCard
					label="Population"
					value={kpis.population?.value}
					color="border-fuchsia-500"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartCard title="Densité de Population (Top départements)">
					<Bar data={densiteChartData} options={densiteOptions} />
				</ChartCard>

				<ChartCard title="Top 5 - Volume de Logements">
					<Bar data={top5ChartData} options={top5Options} />
				</ChartCard>
			</div>
		</div>
	);
}
