import {
	Map,
	Users,
	Building2,
	TrendingUp,
	MapPin,
	ArrowRight,
	Plus,
	BarChart3,
} from "lucide-react";
import useFetchData from "../utils/useFetchData";

const T = {
	accent: "#0e7490",
	textMuted: "#78716c",
	textLight: "#a8a29e",
	ink: "#1e293b",
};

interface HomeProps {
	onNavigate: (pageId: string) => void;
}

const modules = [
	{
		id: "module1",
		icon: Map,
		title: "Vue Nationale",
		desc: "Densité de population, top départements, KPIs généraux du parc immobilier.",
		lightBg: "bg-sky-100",
		iconColor: "text-cyan-700",
		hoverStyle:
			"hover:border-cyan-700 hover:shadow-[0_8px_32px_rgba(14,116,144,0.15)]",
	},
	{
		id: "module2",
		icon: Users,
		title: "Précarité & Social",
		desc: "Corrélations pauvreté/logement social, focus chômage et loyers.",
		lightBg: "bg-rose-50",
		iconColor: "text-rose-600",
		hoverStyle:
			"hover:border-rose-500 hover:shadow-[0_8px_32px_rgba(224,92,58,0.15)]",
	},
	{
		id: "module3",
		icon: Building2,
		title: "Vacance",
		desc: "Taux de logements vacants par région et répartition des résidences.",
		lightBg: "bg-amber-50",
		iconColor: "text-amber-600",
		hoverStyle:
			"hover:border-amber-500 hover:shadow-[0_8px_32px_rgba(217,119,6,0.15)]",
	},
	{
		id: "module4",
		icon: TrendingUp,
		title: "Dynamique du Parc",
		desc: "Évolution de la vacance 2021→2023, part du parc social.",
		lightBg: "bg-emerald-50",
		iconColor: "text-emerald-600",
		hoverStyle:
			"hover:border-emerald-600 hover:shadow-[0_8px_32px_rgba(5,150,105,0.15)]",
	},
	{
		id: "module5",
		icon: MapPin,
		title: "Territoire",
		desc: "Moteurs démographiques, attractivité migratoire, typologies urbain/rural.",
		lightBg: "bg-violet-50",
		iconColor: "text-violet-600",
		hoverStyle:
			"hover:border-violet-600 hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)]",
	},
];

export default function Home({ onNavigate }: HomeProps) {
	const { data: globalStats, loading } = useFetchData("global");

	const statsToShow = globalStats || [
		{ val: "51", label: "Départements" },
		{ val: "3", label: "Années" },
		{ val: "5", label: "Thématiques" },
		{ val: "~8k", label: "Enregistrements" },
	];

	return (
		<div className="max-w-[1100px] mx-auto px-8 py-[60px] animate-fade-in">
			<div className="mb-16 animate-fade-up">
				<div className="flex items-center gap-4 mb-6">
					<div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-cyan-700 to-sky-600 flex items-center justify-center shadow-[0_8px_24px_rgba(14,116,144,0.25)] shrink-0">
						<BarChart3
							className="w-7 h-7 text-white"
							strokeWidth={2.5}
						/>
					</div>
					<div>
						<p className="text-xs font-bold text-stone-500 tracking-[0.15em] uppercase">
							Plateforme analytique
						</p>
						<h1 className="font-['Syne',sans-serif] font-extrabold text-[32px] text-slate-800 leading-none">
							IRIS
						</h1>
					</div>
				</div>
				<p className="text-[17px] text-stone-500 max-w-[580px] leading-[1.7]">
					Analyse territoriale et démographique du parc immobilier
					français. Données INSEE — départements, régions, logements,
					économie.
				</p>

				<div className="flex gap-8 mt-9 flex-wrap animate-fade-up-d1">
					{statsToShow.map((s: any, i: number) => (
						<div key={i}>
							<p
								style={{
									fontFamily: "'JetBrains Mono', monospace",
									fontWeight: 700,
									fontSize: 26,
									color: T.accent,
								}}
							>
								{loading ? "..." : s.val}
							</p>
							<p
								style={{
									fontSize: 12,
									color: T.textLight,
									marginTop: 2,
								}}
							>
								{s.label}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="animate-fade-up-d2">
				<p className="font-['Syne',sans-serif] font-bold text-xs uppercase tracking-[0.12em] text-stone-500 mb-4">
					Modules d'analyse
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{modules.map((m) => (
						<button
							key={m.id}
							onClick={() => onNavigate(m.id)}
							className={`bg-white border-[1.5px] border-stone-200 rounded-[16px] p-6 text-left transition-all duration-200 cursor-pointer hover:-translate-y-[2px] ${m.hoverStyle}`}
						>
							<div className="flex items-start justify-between mb-[14px]">
								<div
									className={`w-10 h-10 rounded-[10px] ${m.lightBg} flex items-center justify-center`}
								>
									<m.icon
										className={`w-5 h-5 ${m.iconColor}`}
										strokeWidth={2}
									/>
								</div>
								<ArrowRight
									className="w-5 h-5 text-stone-300"
									strokeWidth={2}
								/>
							</div>
							<p className="font-['Syne',sans-serif] font-bold text-[15px] text-slate-800 mb-1.5">
								{m.title}
							</p>
							<p className="text-[12.5px] text-stone-500 leading-[1.6]">
								{m.desc}
							</p>
						</button>
					))}

					<div className="bg-[#eeecea] border-[1.5px] border-dashed border-stone-200 rounded-[16px] p-6 flex flex-col items-center justify-center gap-2 opacity-60">
						<Plus
							className="w-8 h-8 text-stone-400"
							strokeWidth={1.5}
						/>
						<p className="text-xs text-stone-500">Module à venir</p>
					</div>
				</div>
			</div>
		</div>
	);
}
