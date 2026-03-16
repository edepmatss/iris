import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
	Home,
	Percent,
	Users,
	Building2,
	Search,
	Bell,
	ChevronRight,
} from "lucide-react";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const Module1 = () => {
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		fetch("http://localhost:8000/api/stats/dashboard-module1")
			.then((res) => res.json())
			.then((data) => setData(data));
	}, []);

	if (!data)
		return (
			<div className="flex h-full items-center justify-center bg-[#D5D5D8] font-medium text-gray-400">
				Initialisation d'Iris...
			</div>
		);

	return (
		<div className="flex h-[100%] bg-[#D5D5D8] p-4 font-sans antialiased">
			<div className="flex-1 flex flex-col">
				<div className=" pb-12">
					<div className="grid grid-cols-4 gap-3 mb-6">
						<KpiCard
							title="Logements Sociaux"
							value={data.kpis.logementsSociaux.value}
							icon={<Home size={28} />}
							color="bg-[#e0e7ff] text-[#6366f1]"
						/>
						<KpiCard
							title="Taux de chômage"
							value={data.kpis.chomage.value}
							icon={<Percent size={28} />}
							color="bg-[#e0f2fe] text-[#0ea5e9]"
						/>
						<KpiCard
							title="Variation de la population"
							value={data.kpis.population.value}
							icon={<Users size={28} />}
							color="bg-[#f5f3ff] text-[#8b5cf6]"
						/>
						<KpiCard
							title="Nombre de logements FR"
							value={data.kpis.logementsTotal.value}
							icon={<Building2 size={28} />}
							color="bg-[#ede9fe] text-[#7c3aed]"
						/>
					</div>

					<div className="grid grid-cols-3 gap-3 h-[100%]">
						<div className="col-span-2 bg-white p-5 rounded-[1rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
							<div className="flex justify-between items-start mb-8">
								<div>
									<h3 className="font-bold text-gray-800 text-lg">
										Densité de population au km²
									</h3>
									<p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">
										Densité
									</p>
								</div>
								<div className="flex bg-[#f3f4f6] p-1 rounded-xl">
									<button className="bg-white shadow-sm px-4 py-1.5 rounded-lg text-xs font-bold text-gray-700">
										N-2
									</button>
									<button className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-600">
										N-3
									</button>
								</div>
							</div>
							<div className="flex items-center justify-center min-h-[400px]">
								<img
									src="/france-map-placeholder.png"
									alt="Map"
									className="max-h-[400px] opacity-80"
								/>
								<p className="absolute text-gray-300 font-medium italic">
									Données : {data.map.length} départements
									chargés
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<div className="bg-white p-5 rounded-[1rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
								<h3 className="text-xs font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">
									Top 5 Departements : Construction
								</h3>
								<div className="h-64">
									<Bar
										data={{
											labels: data.top5.map(
												(t: any) => t.code,
											),
											datasets: [
												{
													data: data.top5.map(
														(t: any) => t.value,
													),
													backgroundColor: (
														context,
													) => {
														const ctx =
															context.chart.ctx;
														const gradient =
															ctx.createLinearGradient(
																0,
																0,
																0,
																300,
															);
														gradient.addColorStop(
															0,
															"#6366f1",
														);
														gradient.addColorStop(
															1,
															"#a5b4fc",
														);
														return gradient;
													},
													borderRadius: 5,
													barThickness: 40,
												},
											],
										}}
										options={{
											maintainAspectRatio: false,
											plugins: {
												legend: { display: false },
											},
											scales: {
												y: {
													display: true,
													grid: { color: "#f3f4f6" },
												},
												x: { grid: { display: false } },
											},
										}}
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-4">
								<QuickLink
									icon={<Users size={20} />}
									label="Démographie"
									color="text-purple-500"
								/>
								<QuickLink
									icon={<Home size={20} />}
									label="Parc Immobilier"
									color="text-blue-500"
								/>
								<QuickLink
									icon={<Percent size={20} />}
									label="Âge moyen du parc"
									color="text-indigo-500"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const KpiCard = ({ title, value, icon, color }: any) => (
	<div className="bg-white p-5 rounded-[1rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-indigo-100 transition-all duration-300 group">
		<div className="flex items-start justify-between mb-4">
			<div
				className={`p-4 rounded-2xl ${color} transition-transform group-hover:scale-110`}
			>
				{icon}
			</div>
			{/* <div className="text-right">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">
                    Variation
                </span>
                <span className="text-green-500 font-bold text-sm">
                    +0.8% YoY
                </span>
            </div> */}
		</div>
		<div className="flex flex-col">
			<h4 className="text-gray-500 font-semibold text-lg leading-tight mb-2">
				{title}
			</h4>
			<div className="text-4xl font-black text-[#2d2d2d] tracking-tight">
				{value}
			</div>
		</div>
	</div>
);

const QuickLink = ({ icon, label, color }: any) => (
	<div className="bg-white p-5 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
		<div
			className={`w-10 h-10 bg-gray-50 ${color} rounded-xl flex items-center justify-center transition-colors group-hover:bg-indigo-50`}
		>
			{icon}
		</div>
		<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">
			{label}
		</span>
	</div>
);

export default Module1;
