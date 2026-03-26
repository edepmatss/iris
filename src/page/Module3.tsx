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
import ChartCard from "../components/ChartCard";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

interface Module3Props {
	filters: { annee: string; region: string; dept: string };
}

// Horizontal Bar : part énergivores par région
interface EnergieRow {
	nom_region: string;
	// parc_social_taux_de_logements_énergivores_e_f_g_en (en %)
	taux_energivores: number;
}

// Scatter : âge moyen vs taux énergivores
interface AgeEnergiePoint {
	x: number; // parc_social_âge_moyen_du_parc_en_années
	y: number; // parc_social_taux_de_logements_énergivores_e_f_g_en
	dept: string;
}

// Bar renouvellement : démolitions / parc total
interface RenouvellementRow {
	nom_region: string;
	logements_demolis: number; // parc_social_logements_démolis
	parc_total: number;
	taux_renouvellement: number; // (démolis / total) * 100
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
				Analyse de la rénovation énergétique...
			</div>
		);

	const kpis = data?.kpis || {};

	// ── HORIZONTAL BAR : ÉNERGIVORES PAR RÉGION ──
	const energieRaw: EnergieRow[] = data?.energivoresParRegion || [];

	// Trier du plus énergivore au moins pour une lecture immédiate
	const energieSorted = [...energieRaw].sort(
		(a, b) => b.taux_energivores - a.taux_energivores,
	);

	// Couleur conditionnelle : rouge si > 35 %, orange si > 25 %
	const barColors = energieSorted.map((d) =>
		d.taux_energivores > 35
			? "#e05c3a"
			: d.taux_energivores > 25
				? "#d97706"
				: "#059669",
	);

	const energieChartData = {
		labels: energieSorted.map((d) => d.nom_region),
		datasets: [
			{
				label: "Logements énergivores E/F/G (%)",
				data: energieSorted.map((d) => d.taux_energivores),
				backgroundColor: barColors,
				borderRadius: { topRight: 4, bottomRight: 4 },
				barThickness: 18,
			},
		],
	};

	const energieOptions = {
		indexAxis: "y" as const,
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
		scales: {
			x: {
				display: true,
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
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

	// ── SCATTER : ÂGE MOYEN VS TAUX ÉNERGIVORES ──
	const ageEnergieRaw: AgeEnergiePoint[] = data?.ageEnergie || [];

	const ageEnergieChartData = {
		datasets: [
			{
				label: "Département",
				data: ageEnergieRaw,
				backgroundColor: "rgba(217, 119, 6, 0.55)",
				pointRadius: 6,
				pointHoverRadius: 9,
			},
		],
	};

	const ageEnergieOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
		},
		scales: {
			x: {
				title: {
					display: true,
					text: "Âge moyen du parc (années)",
					font: { size: 10 },
				},
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: { font: { size: 10 } },
			},
			y: {
				title: {
					display: true,
					text: "Logements énergivores E/F/G (%)",
					font: { size: 10 },
				},
				border: { display: false },
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: {
					font: { size: 10 },
					callback: (v: number | string) => `${v}%`,
				},
			},
		},
	};

	// ── BAR : INDICATEUR DE RENOUVELLEMENT (DÉMOLITIONS / PARC TOTAL) ──
	const renouvRaw: RenouvellementRow[] = data?.renouvellement || [];

	const renouvChartData = {
		labels: renouvRaw.map((d) => d.nom_region),
		datasets: [
			{
				label: "Taux de renouvellement (%)",
				data: renouvRaw.map((d) => d.taux_renouvellement),
				backgroundColor: "#059669",
				borderRadius: { topLeft: 4, topRight: 4 },
				barThickness: 26,
			},
		],
	};

	const renouvOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (ctx: { dataIndex: number }) => {
						const row = renouvRaw[ctx.dataIndex];
						return [
							` Taux : ${row.taux_renouvellement.toFixed(2)}%`,
							` Démolis : ${row.logements_demolis.toLocaleString("fr-FR")}`,
							` Parc total : ${row.parc_total.toLocaleString("fr-FR")}`,
						];
					},
				},
			},
		},
		scales: {
			x: {
				grid: { display: false },
				ticks: { font: { size: 10 } },
			},
			y: {
				border: { display: false },
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: {
					font: { size: 10 },
					callback: (v: number | string) => `${v}%`,
				},
			},
		},
	};

	return (
		<div className="animate-fade-in space-y-8">
			{/* ── KPIs ── */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<KpiCard
					label="Logts énergivores (E/F/G)"
					value={kpis.tauxEnergivores?.value}
					color="border-amber-500"
				/>
				<KpiCard
					label="Âge moyen du parc"
					value={kpis.ageMoyen?.value}
					color="border-cyan-600"
				/>
				<KpiCard
					label="Logements démolis 2023"
					value={kpis.logementsDemolis?.value}
					color="border-rose-500"
				/>
			</div>

			{/* ── HORIZONTAL BAR + SCATTER ── */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartCard title="Part des logements énergivores (E/F/G) par région (%)">
					<Bar data={energieChartData} options={energieOptions} />
				</ChartCard>

				<ChartCard title="Âge moyen du parc vs Taux de logements énergivores">
					<Scatter
						data={ageEnergieChartData}
						options={ageEnergieOptions}
					/>
				</ChartCard>
			</div>

			{/* ── RENOUVELLEMENT ── */}
			<ChartCard title="Indicateur de renouvellement — Logements démolis 2023 / Parc total (%)">
				<Bar data={renouvChartData} options={renouvOptions} />
			</ChartCard>
		</div>
	);
}
