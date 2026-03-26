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
import ChartCard from "../components/ChartCard";

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

// Grouped Bar : vacance 2021 vs 2023 par département
interface VacanceEvolPoint {
	nom_departement: string;
	taux_vacance_2021: number;
	taux_vacance_2023: number;
}

// Bar : ventes à des personnes physiques par région
interface VentesRow {
	nom_region: string;
	// parc_social_ventes_à_des_personnes_physiques
	nb_ventes: number;
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

	const kpis = data?.kpis || {};

	// ── GROUPED BAR : VACANCE 2021 VS 2023 ──
	const vacanceEvol: VacanceEvolPoint[] = data?.vacanceEvol || [];

	const vacanceChartData = {
		labels: vacanceEvol.map((d) => d.nom_departement),
		datasets: [
			{
				label: "2021",
				data: vacanceEvol.map((d) => d.taux_vacance_2021),
				backgroundColor: "rgba(14, 116, 144, 0.4)",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.65,
			},
			{
				label: "2023",
				data: vacanceEvol.map((d) => d.taux_vacance_2023),
				backgroundColor: "#0e7490",
				borderRadius: { topLeft: 4, topRight: 4 },
				barPercentage: 0.8,
				categoryPercentage: 0.65,
			},
		],
	};

	const vacanceOptions = {
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
				ticks: {
					font: { size: 10 },
					callback: (v: number | string) => `${v}%`,
				},
			},
		},
	};

	// ── DOUGHNUT : FLUIDITÉ DU PARC ──
	// Ratio : parc_social_logements_mis_en_location / parc_social_nombre_de_logements
	const tauxFluidite: number = data?.kpis?.tauxFluidite?.raw ?? 0;
	const partSociale: number = data?.kpis?.partSociale?.raw ?? 0;

	const doughnutFluiditeData = {
		labels: ["Mis en location", "Non remis"],
		datasets: [
			{
				data: [tauxFluidite, 100 - tauxFluidite],
				backgroundColor: ["#059669", "#f5f5f4"],
				borderWidth: 0,
				cutout: "76%",
			},
		],
	};

	const doughnutSocialData = {
		labels: ["Parc social", "Parc privé"],
		datasets: [
			{
				data: [partSociale, 100 - partSociale],
				backgroundColor: ["#0e7490", "#f5f5f4"],
				borderWidth: 0,
				cutout: "76%",
			},
		],
	};

	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
	};

	// ── BAR : VENTES À DES PERSONNES PHYSIQUES ──
	const ventesRaw: VentesRow[] = data?.ventes || [];

	const ventesChartData = {
		labels: ventesRaw.map((d) => d.nom_region),
		datasets: [
			{
				label: "Ventes à personnes physiques",
				data: ventesRaw.map((d) => d.nb_ventes),
				backgroundColor: "#d97706",
				borderRadius: { topLeft: 4, topRight: 4 },
				barThickness: 28,
			},
		],
	};

	const ventesOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
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
		<div className="space-y-8 animate-fade-in">
			{/* ── KPIs ── */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<KpiCard
					label="Loyer moyen social"
					value={kpis.loyerMoyen?.value}
					color="border-cyan-700"
					trend="up"
				/>
				<KpiCard
					label="Fluidité du parc"
					value={kpis.tauxFluidite?.value}
					color="border-emerald-500"
				/>
				<KpiCard
					label="Écart vacance 21→23"
					value={kpis.ecartVacance?.value}
					color="border-rose-500"
					trend={kpis.ecartVacance?.raw > 0 ? "up" : "down"}
				/>
			</div>

			{/* ── GROUPED BAR VACANCE + DOUGHNUTS ── */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
					<h3 className="text-xs font-bold text-stone-500 uppercase mb-6">
						Comparaison vacance 2021 vs 2023 par département (top 8)
					</h3>
					<div className="h-[280px] w-full relative">
						<Bar data={vacanceChartData} options={vacanceOptions} />
					</div>
				</div>

				<div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
					<h3 className="text-xs font-bold text-stone-500 uppercase mb-4">
						Fluidité — Mis en location / Parc
					</h3>
					<div className="relative w-[150px] h-[150px] mx-auto">
						<Doughnut
							data={doughnutFluiditeData}
							options={doughnutOptions}
						/>
						<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
							<span className="text-xl font-bold font-['JetBrains_Mono'] text-slate-800">
								{tauxFluidite.toFixed(1)}%
							</span>
							<span className="text-[9px] text-stone-400 uppercase">
								Fluidité
							</span>
						</div>
					</div>

					<h3 className="text-xs font-bold text-stone-500 uppercase mt-6 mb-4">
						Part du parc social
					</h3>
					<div className="relative w-[150px] h-[150px] mx-auto">
						<Doughnut
							data={doughnutSocialData}
							options={doughnutOptions}
						/>
						<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
							<span className="text-xl font-bold font-['JetBrains_Mono'] text-slate-800">
								{partSociale.toFixed(1)}%
							</span>
							<span className="text-[9px] text-stone-400 uppercase">
								Social
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* ── VENTES ── */}
			<ChartCard title="Ventes à des personnes physiques (parc_social_ventes_à_des_personnes_physiques) — 2023">
				<Bar data={ventesChartData} options={ventesOptions} />
			</ChartCard>
		</div>
	);
}
