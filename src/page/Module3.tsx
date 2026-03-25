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
			<div className="p-10 text-center text-stone-400 font-medium">
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
		d.val > 12 ? "#e05c3a" : d.val > 9 ? "#d97706" : "#059669",
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
					color: "#f0f0f0",
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
				backgroundColor: "rgba(5, 150, 105, 0.2)",
				borderColor: "#059669",
				pointBackgroundColor: "#059669",
				fill: true,
			},
			{
				label: "Urbain",
				data: radarRawData.map((d: RadarDataPoint) => d.B),
				backgroundColor: "rgba(14, 116, 144, 0.2)",
				borderColor: "#0e7490",
				pointBackgroundColor: "#0e7490",
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
				labels: { font: { size: 11 }, color: "#78716c" },
			},
		},
		scales: {
			r: {
				angleLines: { color: "#e2dfd8" },
				grid: { color: "#e2dfd8" },
				pointLabels: {
					font: { size: 11 },
					color: "#78716c",
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
					color="border-amber-500"
				/>
				<KpiCard
					label="Résidences principales"
					value={kpis.residencesPrincipales?.value}
					color="border-emerald-500"
				/>
				<KpiCard
					label="Résidences secondaires"
					value={kpis.residencesSecondaires?.value}
					color="border-cyan-700"
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
