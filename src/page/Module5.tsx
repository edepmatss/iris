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

interface DynamiqueData {
	dept: string;
	naturel: number;
	migratoire: number;
	variation: number;
}

interface TypologyData {
	nom: string;
	individuels: number;
	sociaux: number;
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
			<div className="p-10 text-center text-slate-400">
				Analyse des territoires en cours...
			</div>
		);

	const dynamiques: DynamiqueData[] = data?.dynamiques || [];
	const typology: TypologyData[] = data?.typology || [];

	const stackedBarData = {
		labels: dynamiques.map((d: DynamiqueData) => d.dept),
		datasets: [
			{
				label: "Solde naturel",
				data: dynamiques.map((d: DynamiqueData) => d.naturel),
				backgroundColor: "#10b981",
			},
			{
				label: "Solde migratoire",
				data: dynamiques.map((d: DynamiqueData) => d.migratoire),
				backgroundColor: "#6366f1",
				borderRadius: { topLeft: 4, topRight: 4 },
			},
		],
	};

	const stackedBarOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: { font: { size: 11 }, color: "#94a3b8" },
			},
		},
		scales: {
			x: {
				stacked: true,
				grid: { display: false },
				ticks: { font: { size: 11 } },
			},
			y: {
				stacked: true,
				grid: {
					color: "#334155",
					borderDash: [3, 3],
				},
				ticks: { font: { size: 11 } },
			},
		},
	};

	interface ScatterPoint {
		x: number;
		y: number;
		dept: string;
	}

	const scatterData = {
		datasets: [
			{
				label: "Départements",
				data: dynamiques.map(
					(d: DynamiqueData): ScatterPoint => ({
						x: d.migratoire,
						y: d.variation,
						dept: d.dept,
					}),
				),
				backgroundColor: "rgba(168, 85, 247, 0.8)",
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
				title: {
					display: true,
					text: "Migratoire (%)",
					color: "#94a3b8",
				},
				grid: {
					color: "#334155",
					borderDash: [3, 3],
				},
				ticks: { font: { size: 11 } },
			},
			y: {
				title: {
					display: true,
					text: "Variation (%)",
					color: "#94a3b8",
				},
				grid: {
					color: "#334155",
					borderDash: [3, 3],
				},
				ticks: { font: { size: 11 } },
			},
		},
	};

	const typologyBarData = {
		labels: typology.map((d: TypologyData) => d.nom),
		datasets: [
			{
				label: "Individuel",
				data: typology.map((d: TypologyData) => d.individuels),
				backgroundColor: "#f59e0b",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.7,
			},
			{
				label: "Social",
				data: typology.map((d: TypologyData) => d.sociaux),
				backgroundColor: "#6366f1",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.7,
			},
		],
	};

	const typologyBarOptions = {
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
					color: "#334155",
					borderDash: [3, 3],
				},
				ticks: { font: { size: 11 } },
			},
		},
	};

	return (
		<div className="space-y-8 animate-fade-in">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<KpiCard
					label="Variation démo. moy."
					value={data?.kpis?.variationDemo?.value}
					color="border-indigo-500"
				/>
				<KpiCard
					label="Solde migratoire moy."
					value={data?.kpis?.soldeMigratoire?.value}
					color="border-teal-400"
				/>
				<KpiCard
					label="Maisons individuelles"
					value={data?.kpis?.maisonsIndiv?.value}
					color="border-amber-400"
				/>
			</div>

			<div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
				<h3 className="text-xs font-bold text-slate-300 uppercase mb-6">
					Moteurs de croissance — Solde naturel vs migratoire
				</h3>
				<div className="h-[280px] w-full relative">
					<Bar data={stackedBarData} options={stackedBarOptions} />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
					<h3 className="text-xs font-bold text-slate-300 uppercase mb-6">
						Attractivité vs variation globale
					</h3>
					<div className="h-[280px] w-full relative">
						<Scatter data={scatterData} options={scatterOptions} />
					</div>
				</div>

				<div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
					<h3 className="text-xs font-bold text-slate-300 uppercase mb-6">
						Typologies — Individuel vs Social
					</h3>
					<div className="h-[280px] w-full relative">
						<Bar
							data={typologyBarData}
							options={typologyBarOptions}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
