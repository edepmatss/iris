import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
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
	BarElement,
	PointElement,
	Title,
	Tooltip,
	Legend,
);

interface Module5Props {
	filters: { annee: string; region: string; dept: string };
}

// Stacked Bar : % moins de 20 ans vs % 60 ans et plus par département
interface DemoRow {
	nom_departement: string;
	pct_moins_20: number; // %_population_de_moins_de_20_ans
	pct_plus_60: number; // %_population_de_60_ans_et_plus
}

// Scatter : solde migratoire vs construction neuve
interface AttractivitePoint {
	x: number; // solde_migratoire (%)
	y: number; // construction neuve (logements mis en service)
	dept: string;
}

// Grouped Bar : part individuel social vs part individuel parc général
interface TypologieRow {
	nom_region: string;
	pct_individuel_social: number; // % logements individuels dans le parc social
	pct_individuel_general: number; // % logements individuels dans le parc total
}

export default function Module5({ filters }: Module5Props) {
	const queryParams = new URLSearchParams({
		annee: filters.annee || "2023",
		region: filters.region || "",
		dept: filters.dept || "",
	}).toString();

	const { data, loading } = useFetchData("dashboard-module5", queryParams);

	if (loading)
		return (
			<div className="p-10 text-center text-stone-400">
				Analyse des territoires en cours...
			</div>
		);

	const kpis = data?.kpis || {};

	// ── STACKED BAR : JEUNESSE VS SENIORS ──
	const demoRaw: DemoRow[] = data?.demographie || [];

	const demoStackedData = {
		labels: demoRaw.map((d) => d.nom_departement),
		datasets: [
			{
				label: "< 20 ans (%)",
				data: demoRaw.map((d) => d.pct_moins_20),
				backgroundColor: "#0e7490",
				borderRadius: { topLeft: 3, topRight: 3 },
				stack: "demo",
			},
			{
				label: "≥ 60 ans (%)",
				data: demoRaw.map((d) => d.pct_plus_60),
				backgroundColor: "#d97706",
				stack: "demo",
			},
		],
	};

	const demoStackedOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: { font: { size: 10 }, boxWidth: 12, padding: 16 },
			},
			tooltip: {
				callbacks: {
					label: (ctx: { dataset: { label: string }; raw: number }) =>
						` ${ctx.dataset.label} : ${ctx.raw.toFixed(1)}%`,
				},
			},
		},
		scales: {
			x: {
				stacked: true,
				grid: { display: false },
				ticks: { font: { size: 10 } },
			},
			y: {
				stacked: true,
				border: { display: false },
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: {
					font: { size: 10 },
					callback: (v: number | string) => `${v}%`,
				},
			},
		},
	};

	// ── SCATTER : ATTRACTIVITÉ (SOLDE MIGRATOIRE VS CONSTRUCTION) ──
	const attrRaw: AttractivitePoint[] = data?.attractivite || [];

	const attrChartData = {
		datasets: [
			{
				label: "Département",
				data: attrRaw,
				backgroundColor: "rgba(224, 92, 58, 0.6)",
				pointRadius: 6,
				pointHoverRadius: 9,
			},
		],
	};

	const attrOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (ctx: { raw: AttractivitePoint }) =>
						`${ctx.raw.dept} — Migratoire : ${ctx.raw.x.toFixed(2)}% | Construction : ${ctx.raw.y}`,
				},
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: "Solde migratoire (%)",
					font: { size: 10 },
				},
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: { font: { size: 10 } },
			},
			y: {
				title: {
					display: true,
					text: "Construction neuve (logements)",
					font: { size: 10 },
				},
				border: { display: false },
				grid: { color: "#f0f0f0", borderDash: [3, 3] },
				ticks: { font: { size: 10 } },
			},
		},
	};

	// ── GROUPED BAR : TYPOLOGIES ──
	// Part individuel dans le parc social vs parc général
	const typoRaw: TypologieRow[] = data?.typologies || [];

	const typoChartData = {
		labels: typoRaw.map((d) => d.nom_region),
		datasets: [
			{
				label: "Individuel — Parc social (%)",
				data: typoRaw.map((d) => d.pct_individuel_social),
				backgroundColor: "#d97706",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.65,
			},
			{
				label: "Individuel — Parc général (%)",
				data: typoRaw.map((d) => d.pct_individuel_general),
				backgroundColor: "#0e7490",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.65,
			},
		],
	};

	const typoOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: { font: { size: 10 }, boxWidth: 12, padding: 16 },
			},
			tooltip: {
				callbacks: {
					label: (ctx: { dataset: { label: string }; raw: number }) =>
						` ${ctx.dataset.label} : ${ctx.raw.toFixed(1)}%`,
				},
			},
		},
		scales: {
			x: { grid: { display: false }, ticks: { font: { size: 10 } } },
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
		<div className="space-y-8 animate-fade-in">
			{/* ── KPIs ── */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<KpiCard
					label="< 20 ans (moy.)"
					value={kpis.pctMoins20?.value}
					color="border-cyan-700"
				/>
				<KpiCard
					label="≥ 60 ans (moy.)"
					value={kpis.pctPlus60?.value}
					color="border-amber-500"
				/>
				<KpiCard
					label="Individuel dans le social"
					value={kpis.pctIndividuelSocial?.value}
					color="border-emerald-500"
				/>
			</div>

			{/* ── STACKED BAR ── */}
			<ChartCard title="Jeunesse vs Seniors — % moins de 20 ans vs 60 ans et plus (2023)">
				<Bar data={demoStackedData} options={demoStackedOptions} />
			</ChartCard>

			{/* ── SCATTER ATTRACTIVITÉ + TYPOLOGIES ── */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartCard title="Attractivité — Solde migratoire vs Construction neuve">
					<Scatter data={attrChartData} options={attrOptions} />
				</ChartCard>

				<ChartCard title="Typologies — Part individuel : parc social vs parc général">
					<Bar data={typoChartData} options={typoOptions} />
				</ChartCard>
			</div>
		</div>
	);
}
