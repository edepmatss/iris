import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import useFetchData from "../utils/useFetchData";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
);

interface Module1Props {
	filters: { annee: string; region: string; dept: string };
}

interface TopBottomRow {
	nom_departement: string;
	taux_de_logements_sociaux_en: number;
}

interface EvolutionRow {
	nom_region: string;
	annee_2021: number;
	annee_2022: number;
	annee_2023: number;
}

interface ConstructionRow {
	nom_region: string;
	moyenne_10ans: number;
	construction_2023: number;
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
			<div className="p-10 text-center text-stone-400 font-medium">
				Analyse des données IRIS...
			</div>
		);

	const kpis = data?.kpis || {};

	// ── TOP 10 ──
	const top10: TopBottomRow[] = data?.top10 || [];
	const bottom10: TopBottomRow[] = data?.bottom10 || [];

	const top10ChartData = {
		labels: top10.map((d) => d.nom_departement),
		datasets: [
			{
				label: "Taux logements sociaux (%)",
				data: top10.map((d) => d.taux_de_logements_sociaux_en),
				backgroundColor: "#0e7490",
				borderRadius: { topRight: 4, bottomRight: 4 },
				barThickness: 16,
			},
		],
	};

	const bottom10ChartData = {
		labels: bottom10.map((d) => d.nom_departement),
		datasets: [
			{
				label: "Taux logements sociaux (%)",
				data: bottom10.map((d) => d.taux_de_logements_sociaux_en),
				backgroundColor: "#e05c3a",
				borderRadius: { topRight: 4, bottomRight: 4 },
				barThickness: 16,
			},
		],
	};

	const hBarOptions = {
		indexAxis: "y" as const,
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
		scales: {
			x: {
				display: true,
				grid: { color: "#f0f0f0" },
				ticks: {
					font: { size: 10 },
					callback: (v: number | string) => `${v}%`,
				},
			},
			y: {
				border: { display: false },
				grid: { display: false },
				ticks: { font: { size: 10 } },
			},
		},
	};

	// ── ÉVOLUTION 2021-2023 PAR RÉGION ──
	const evolution: EvolutionRow[] = data?.evolution || [];

	const evolutionChartData = {
		labels: evolution.map((d) => d.nom_region),
		datasets: [
			{
				label: "2021",
				data: evolution.map((d) => d.annee_2021),
				borderColor: "#94a3b8",
				backgroundColor: "transparent",
				tension: 0.4,
				pointRadius: 3,
				borderWidth: 1.5,
			},
			{
				label: "2022",
				data: evolution.map((d) => d.annee_2022),
				borderColor: "#5ba8bc",
				backgroundColor: "transparent",
				tension: 0.4,
				pointRadius: 3,
				borderWidth: 1.5,
			},
			{
				label: "2023",
				data: evolution.map((d) => d.annee_2023),
				borderColor: "#0e7490",
				backgroundColor: "rgba(14, 116, 144, 0.07)",
				tension: 0.4,
				pointRadius: 4,
				borderWidth: 2,
				fill: true,
			},
		],
	};

	const lineOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: { font: { size: 10 }, boxWidth: 12, padding: 16 },
			},
		},
		scales: {
			x: { grid: { display: false }, ticks: { font: { size: 10 } } },
			y: {
				border: { display: false },
				grid: { color: "#f0f0f0" },
				ticks: { font: { size: 10 } },
			},
		},
	};

	// ── CONSTRUCTION : MOYENNE 10 ANS vs 2023 ──
	const construction: ConstructionRow[] = data?.construction || [];

	const constructionChartData = {
		labels: construction.map((d) => d.nom_region),
		datasets: [
			{
				label: "Moy. 10 ans",
				data: construction.map((d) => d.moyenne_10ans),
				backgroundColor: "rgba(14, 116, 144, 0.35)",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.65,
			},
			{
				label: "2023",
				data: construction.map((d) => d.construction_2023),
				backgroundColor: "#e05c3a",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.65,
			},
		],
	};

	const constructionOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: { font: { size: 10 }, boxWidth: 12, padding: 16 },
			},
		},
		scales: {
			x: { grid: { display: false }, ticks: { font: { size: 10 } } },
			y: {
				border: { display: false },
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: { font: { size: 10 } },
			},
		},
	};

	return (
		<div className="animate-fade-in space-y-8">
			{/* ── KPIs ── */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
				<KpiCard
					label="Log. Sociaux"
					value={kpis.logementsSociaux?.value}
					color="border-indigo-500"
				/>
				<KpiCard
					label="Taux Chômage"
					value={kpis.chomage?.value}
					color="border-rose-500"
				/>
				<KpiCard
					label="Logts Vacants"
					value={kpis.vacance?.value}
					color="border-amber-500"
				/>
				<KpiCard
					label="Loyer Social"
					value={kpis.loyer?.value}
					color="border-teal-400"
				/>
				<KpiCard
					label="Parc Total"
					value={kpis.parcTotal?.value}
					color="border-slate-600"
				/>
				<KpiCard
					label="Population"
					value={kpis.population?.value}
					color="border-fuchsia-500"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartCard title="Top 10 — Taux de logements sociaux (%)">
					<Bar data={top10ChartData} options={hBarOptions} />
				</ChartCard>
				<ChartCard title="Bottom 10 — Taux de logements sociaux (%)">
					<Bar data={bottom10ChartData} options={hBarOptions} />
				</ChartCard>
			</div>

			<ChartCard title="Évolution du parc social 2021 → 2023 par région (nb logements)">
				<Line data={evolutionChartData} options={lineOptions} />
			</ChartCard>
			<ChartCard title="Comparatif Construction — Moyenne 10 ans vs 2023 par région">
				<Bar
					data={constructionChartData}
					options={constructionOptions}
				/>
			</ChartCard>
		</div>
	);
}
