import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	RadialLinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import useFetchData from "../utils/useFetchData";

import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";

ChartJS.register(
	CategoryScale,
	LinearScale,
	RadialLinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
);

interface Module3Props {
	filters: { annee: string; region: string; dept: string };
}

// Interfaces pour typer les données
interface VacanceDataPoint {
	name: string;
	val: number;
}

interface RadarDataPoint {
	s: string;
	A: number;
	B: number;
}

export default function Module3({ filters }: Module3Props) {
	const queryParams = new URLSearchParams({
		annee: filters.annee || "2023",
		region: filters.region || "",
		dept: filters.dept || "",
	}).toString();

	const { data, loading } = useFetchData("dashboard-module3", queryParams);

	if (loading)
		return (
			<div className="p-10 text-center text-slate-400 font-medium">
				Analyse de la vacance du parc...
			</div>
		);

	const kpis = data?.kpis || {};
	const vacanceData: VacanceDataPoint[] = data?.distribution || [];
	const radarRawData: RadarDataPoint[] = data?.radar || [
		{ s: "Maisons", A: 80, B: 28 },
		{ s: "Log. Sociaux", A: 10, B: 22 },
		{ s: "Vacants", A: 13, B: 6 },
		{ s: "Secondaires", A: 10, B: 4 },
		{ s: "Locatif priv.", A: 25, B: 45 },
	];

	// 1. FORMATAGE DES DONNÉES : On multiplie par 100 pour avoir de vrais pourcentages
	const formattedVacanceData = vacanceData.map((d: VacanceDataPoint) => ({
		name: d.name,
		val: Number((d.val * 100).toFixed(2)), // On garde 2 décimales maximum
	}));

	// 2. COULEURS : On se base sur les nouvelles valeurs formatées
	const barColors = formattedVacanceData.map((d: VacanceDataPoint) =>
		d.val > 12 ? "#a855f7" : d.val > 9 ? "#f59e0b" : "#10b981",
	);

	// --- CONFIGURATION CHART.JS ---

	const barChartData = {
		labels: formattedVacanceData.map((d: VacanceDataPoint) => d.name),
		datasets: [
			{
				label: "Vacance",
				data: formattedVacanceData.map((d: VacanceDataPoint) => d.val),
				backgroundColor: barColors,
				borderRadius: { topRight: 6, bottomRight: 6 },
				barThickness: 16,
			},
		],
	};

	const barOptions = {
		indexAxis: "y" as const,
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
		},
		scales: {
			x: {
				grid: {
					color: "#334155",
					borderDash: [3, 3],
				},
				ticks: {
					font: { size: 11 },
					callback: (value: number | string) => `${value}%`,
				},
			},
			y: {
				grid: { display: false },
				ticks: { font: { size: 11 } },
				border: { display: false },
			},
		},
	};

	const radarChartData = {
		labels: radarRawData.map((d: RadarDataPoint) => d.s),
		datasets: [
			{
				label: "Rural",
				data: radarRawData.map((d: RadarDataPoint) => d.A),
				backgroundColor: "rgba(16, 185, 129, 0.2)",
				borderColor: "#10b981",
				pointBackgroundColor: "#10b981",
				fill: true,
			},
			{
				label: "Urbain",
				data: radarRawData.map((d: RadarDataPoint) => d.B),
				backgroundColor: "rgba(99, 102, 241, 0.2)",
				borderColor: "#6366f1",
				pointBackgroundColor: "#6366f1",
				fill: true,
			},
		],
	};

	const radarOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom" as const,
				labels: { font: { size: 11 }, color: "#94a3b8" },
			},
		},
		scales: {
			r: {
				angleLines: { color: "#334155" },
				grid: { color: "#334155" },
				pointLabels: {
					font: { size: 11 },
					color: "#94a3b8",
				},
				ticks: {
					display: false,
				},
			},
		},
	};

	return (
		<div className="animate-fade-in space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<KpiCard
					label="Taux vacance moyen"
					value={kpis.tauxVacance?.value}
					color="border-amber-400"
				/>
				<KpiCard
					label="Résidences principales"
					value={kpis.residencesPrincipales?.value}
					color="border-teal-400"
				/>
				<KpiCard
					label="Résidences secondaires"
					value={kpis.residencesSecondaires?.value}
					color="border-indigo-500"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartCard title="Taux de vacance par département (%)">
					<Bar data={barChartData} options={barOptions} />
				</ChartCard>

				<ChartCard title="Rural vs Urbain — Radar typologique">
					<Radar data={radarChartData} options={radarOptions} />
				</ChartCard>
			</div>
		</div>
	);
}
