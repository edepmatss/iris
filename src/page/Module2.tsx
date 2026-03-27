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
} from "chart.js";
import { Scatter, Bubble, Line } from "react-chartjs-2";
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
);

interface Module2Props {
	filters: { annee: string; region: string; dept: string };
}

// Scatter : pauvreté vs logements sociaux
interface ScatterPoint {
	x: number; // taux_de_pauvreté_en
	y: number; // taux_de_logements_sociaux_en
	dept: string;
}

// Bubble : les 10 départements au chômage le plus élevé
interface BubblePoint {
	x: number; // taux_chomage
	y: number; // parc_social_loyer_moyen_en_€_m²_mois
	r: number; // taille de la bulle (proportionnelle au nombre de logements sociaux)
	dept: string;
}

// Tension : variation chômage vs variation vacance
interface TensionRow {
	nom_departement: string;
	delta_chomage: number; // variation chômage 2021→2023
	delta_vacance: number; // variation vacance sociale 2021→2023
}

export default function Module2({ filters }: Module2Props) {
	const queryParams = new URLSearchParams({
		annee: filters.annee || "2023",
		region: filters.region || "",
		dept: filters.dept || "",
	}).toString();

	const { data, loading } = useFetchData("dashboard-module2", queryParams);

	if (loading)
		return (
			<div className="p-10 text-center text-slate-500 font-medium">
				Chargement du Module Social...
			</div>
		);

	const kpis = data?.kpis || {};

	// ── SCATTER : PAUVRETÉ / LOGEMENT SOCIAL ──
	const scatterRaw: ScatterPoint[] = data?.scatter || [];

	const scatterChartData = {
		datasets: [
			{
				label: "Département",
				data: scatterRaw,
				backgroundColor: "rgba(14, 116, 144, 0.55)",
				pointRadius: 6,
				pointHoverRadius: 9,
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
				title: {
					display: true,
					text: "Taux de pauvreté (%)",
					font: { size: 10 },
				},
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: { font: { size: 10 } },
			},
			y: {
				title: {
					display: true,
					text: "Taux logements sociaux (%)",
					font: { size: 10 },
				},
				border: { display: false },
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: { font: { size: 10 } },
			},
		},
	};

	// ── BUBBLE : TOP 10 CHÔMAGE / LOYER SOCIAL ──
	const bubbleRaw: BubblePoint[] = data?.bubble || [];

	const bubbleChartData = {
		datasets: [
			{
				label: "Département",
				data: bubbleRaw,
				backgroundColor: "rgba(224, 92, 58, 0.5)",
				borderColor: "#e05c3a",
				borderWidth: 1,
			},
		],
	};

	const bubbleOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
		},
		scales: {
			x: {
				title: {
					display: true,
					text: "Taux de chômage (%)",
					font: { size: 10 },
				},
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: { font: { size: 10 } },
			},
			y: {
				title: {
					display: true,
					text: "Loyer moyen social (€/m²/mois)",
					font: { size: 10 },
				},
				border: { display: false },
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: { font: { size: 10 } },
			},
		},
	};

	// ── LINE : TENSION — ΔCHÔMAGE VS ΔVACANCE 2021→2023 ──
	const tensionRaw: TensionRow[] = data?.tension || [];

	const tensionChartData = {
		labels: tensionRaw.map((d) => d.nom_departement),
		datasets: [
			{
				label: "Δ Chômage (pts)",
				data: tensionRaw.map((d) => d.delta_chomage),
				borderColor: "#e05c3a",
				backgroundColor: "rgba(224, 92, 58, 0.08)",
				tension: 0.4,
				pointRadius: 4,
				borderWidth: 2,
				yAxisID: "y",
			},
			{
				label: "Δ Vacance sociale (pts)",
				data: tensionRaw.map((d) => d.delta_vacance),
				borderColor: "#0e7490",
				backgroundColor: "rgba(14, 116, 144, 0.08)",
				tension: 0.4,
				pointRadius: 4,
				borderWidth: 2,
				yAxisID: "y1",
			},
		],
	};

	const tensionOptions = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: { mode: "index" as const, intersect: false },
		plugins: {
			legend: {
				position: "top" as const,
				labels: { font: { size: 10 }, boxWidth: 12, padding: 16 },
			},
		},
		scales: {
			x: { grid: { display: false }, ticks: { font: { size: 10 } } },
			y: {
				type: "linear" as const,
				position: "left" as const,
				border: { display: false },
				grid: { color: "#f0f0f0" },
				title: {
					display: true,
					text: "Δ Chômage (pts)",
					font: { size: 10 },
				},
				ticks: { font: { size: 10 } },
			},
			y1: {
				type: "linear" as const,
				position: "right" as const,
				border: { display: false },
				grid: { drawOnChartArea: false },
				title: {
					display: true,
					text: "Δ Vacance (pts)",
					font: { size: 10 },
				},
				ticks: { font: { size: 10 } },
			},
		},
	};

	return (
		<div className="space-y-8 animate-fade-in">
			{/* ── KPIs ── */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<KpiCard
					label="Chômage moyen"
					value={kpis.chomage?.value}
					color="border-pink-500"
				/>
				<KpiCard
					label="Pauvreté moyenne"
					value={kpis.pauvrete?.value}
					color="border-amber-500"
				/>
				<KpiCard
					label="Loyer moyen social"
					value={kpis.loyer?.value}
					color="border-cyan-600"
				/>
			</div>

			{/* ── SCATTER + BUBBLE ── */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartCard title="Corrélation Pauvreté / Logement Social (2023)">
					<Scatter data={scatterChartData} options={scatterOptions} />
				</ChartCard>

				<ChartCard title="Focus Chômage — Top 10 et leur loyer moyen social">
					<Bubble data={bubbleChartData} options={bubbleOptions} />
				</ChartCard>
			</div>

			{/* ── TENSION LINE ── */}
			<ChartCard title="Évolution de la tension — Δ Chômage vs Δ Vacance sociale (2021 → 2023)">
				<Line data={tensionChartData} options={tensionOptions} />
			</ChartCard>
		</div>
	);
}
