import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Home, Percent, Users, Building2 } from "lucide-react";
import { Chart as ChartJS, registerables } from "chart.js";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import useFetchData from "../../utils/useFetchData";

ChartJS.register(...registerables);

const geoUrl = "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements.geojson";

const Module1 = () => {
	const [tooltip, setTooltip] = useState<{ name: string; value: number | string; x: number; y: number } | null>(null);

	const { data, loading } = useFetchData("module1");

	if (loading || !data) {
        return (
            <div className="flex h-full items-center justify-center bg-[#D5D5D8] font-medium text-gray-400">
                Initialisation d'Iris...
            </div>
        );
    }

	const colorScale = scaleQuantile<string>()
		.domain(data.map.map((d: any) => d.value))
		.range([
			"#e0e7ff",
			"#c7d2fe",
			"#a5b4fc",
			"#818cf8",
			"#6366f1",
			"#4f46e5",
			"#3730a3"
		]);

	return (
		<div className="h-full overflow-y-auto bg-[#D5D5D8] p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 relative">

			<div className="grid grid-cols-4 gap-4 lg:gap-6">
				<KpiCard title="Logements Sociaux" value={data.kpis.logementsSociaux.value} icon={<Home size={28} />} color="bg-[#e0e7ff] text-[#6366f1]" />
				<KpiCard title="Taux de chômage" value={data.kpis.chomage.value} icon={<Percent size={28} />} color="bg-[#e0f2fe] text-[#0ea5e9]" />
				<KpiCard title="Variation population" value={data.kpis.population.value} icon={<Users size={28} />} color="bg-[#f5f3ff] text-[#8b5cf6]" />
				<KpiCard title="Logements FR" value={data.kpis.logementsTotal.value} icon={<Building2 size={28} />} color="bg-[#ede9fe] text-[#7c3aed]" />
			</div>

			{tooltip && (
				<div
					className="pointer-events-none fixed z-[9999] bg-[#2d2d2d] text-white px-4 py-2.5 rounded-xl shadow-2xl flex flex-col gap-1 border border-gray-600/50"
					style={{
						top: tooltip.y,
						left: tooltip.x,
						transform: "translate(-50%, -120%)",
					}}
				>
					<span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
						{tooltip.name}
					</span>
					<div className="flex items-end gap-1">
						<span className="text-lg font-black text-white leading-none">
							{tooltip.value}
						</span>
						{tooltip.value !== "Aucune donnée" && (
							<span className="text-[10px] text-gray-400 font-medium mb-[2px]">
								hab/km²
							</span>
						)}
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 pb-4">

				<div className="xl:col-span-2 bg-white p-5 rounded-[1rem] shadow-sm relative flex flex-col min-h-[500px] overflow-hidden">
					<div className="flex justify-between items-start mb-4 z-10">
						<div>
							<h3 className="font-bold text-gray-800 text-lg">
								Densité de population au km²
							</h3>
							<p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">
								Par département
							</p>
						</div>
						<div className="flex bg-[#f3f4f6] p-1 rounded-xl">
							<button className="bg-white shadow-sm px-4 py-1.5 rounded-lg text-xs font-bold text-gray-700">N-2</button>
							<button className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-600">N-3</button>
						</div>
					</div>

					<div className="flex-1 w-full flex items-center justify-center">
						<ComposableMap
							projection="geoConicConformal"
							projectionConfig={{ center: [2.4, 46.5], scale: 2200 }}
							width={800}
							height={600}
							style={{ width: "100%", height: "100%", maxHeight: "100%" }}
						>
							<ZoomableGroup zoom={1} maxZoom={5}>
								<Geographies geography={geoUrl}>
									{({ geographies }) =>
										geographies.map((geo) => {
											const currentDept = data.map.find(
												(s: any) => s.code === geo.properties.code
											);
											return (
												<Geography
													key={geo.rsmKey}
													geography={geo}
													fill={currentDept ? colorScale(currentDept.value) : "#f3f4f6"}
													stroke="#ffffff"
													strokeWidth={0.5}
													style={{
														default: { outline: "none" },
														hover: {
															fill: "#ff69b4",
															outline: "none",
															cursor: "pointer",
															transition: "all 250ms"
														},
														pressed: { outline: "none" }
													}}
													onMouseEnter={(e: any) => {
														setTooltip({
															name: `${geo.properties.code} - ${geo.properties.nom}`,
															value: currentDept ? currentDept.value : "Aucune donnée",
															x: e.clientX,
															y: e.clientY
														});
													}}
													onMouseMove={(e: any) => {
														setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
													}}
													onMouseLeave={() => {
														setTooltip(null);
													}}
												/>
											);
										})
									}
								</Geographies>
							</ZoomableGroup>
						</ComposableMap>
					</div>

					<div className="absolute bottom-5 left-5 flex flex-col gap-1 pointer-events-none">
						<p className="text-gray-300 font-medium italic text-sm">
							Données : {data.map.length} départements chargés
						</p>
						<p className="text-indigo-300/60 font-medium italic text-xs flex items-center gap-1">
							💡 Utilisez la molette pour zoomer
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-4 lg:gap-6">

					<div className="bg-white p-5 rounded-[1rem] shadow-sm flex flex-col min-h-[350px]">
						<h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">
							Top 5 Départements : Construction
						</h3>
						<div className="flex-1 relative">
							<Bar
								data={{
									labels: data.top5.map((t: any) => t.code),
									datasets: [
										{
											data: data.top5.map((t: any) => t.value),
											backgroundColor: (context) => {
												const ctx = context.chart.ctx;
												const gradient = ctx.createLinearGradient(0, 0, 0, 300);
												gradient.addColorStop(0, "#6366f1");
												gradient.addColorStop(1, "#a5b4fc");
												return gradient;
											},
											borderRadius: 5,
											barThickness: 30,
										},
									],
								}}
								options={{
									maintainAspectRatio: false,
									responsive: true,
									plugins: { legend: { display: false } },
									scales: {
										y: { display: true, grid: { color: "#f3f4f6" } },
										x: { grid: { display: false } },
									},
								}}
							/>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-3">
						<QuickLink icon={<Users size={20} />} label="Démographie" color="text-purple-500" />
						<QuickLink icon={<Home size={20} />} label="Parc Immo" color="text-blue-500" />
						<QuickLink icon={<Percent size={20} />} label="Âge moyen" color="text-indigo-500" />
					</div>
				</div>
			</div>
		</div>
	);
};

const KpiCard = ({ title, value, icon, color }: any) => (
	<div className="bg-white p-4 lg:p-5 rounded-[1rem] shadow-sm border border-transparent hover:border-indigo-100 transition-all duration-300 group flex flex-col h-full min-h-[120px]">
		<div className="flex items-start justify-between mb-2">
			<div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110`}>
				{icon}
			</div>
		</div>
		<div className="flex flex-col mt-auto">
			<h4 className="text-gray-400 font-semibold text-xs lg:text-sm leading-tight mb-1">
				{title}
			</h4>
			<div className="text-2xl lg:text-3xl font-black text-[#2d2d2d] tracking-tight truncate">
				{value}
			</div>
		</div>
	</div>
);

const QuickLink = ({ icon, label, color }: any) => (
	<div className="bg-white p-3 rounded-[1rem] flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer group py-3 min-h-[90px]">
		<div className={`w-9 h-9 bg-gray-50 ${color} rounded-xl flex items-center justify-center transition-colors group-hover:bg-indigo-50`}>
			{icon}
		</div>
		<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">
			{label}
		</span>
	</div>
);

export default Module1;