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
	accent: "#6366f1",
	textMuted: "#94a3b8",
	textLight: "#cbd5e1",
	ink: "#f8fafc",
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
		lightBg: "bg-indigo-500/10",
		iconColor: "text-indigo-400",
		hoverStyle:
			"hover:border-indigo-500 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]",
	},
	{
		id: "module2",
		icon: Users,
		title: "Précarité & Social",
		desc: "Corrélations pauvreté/logement social, focus chômage et loyers.",
		lightBg: "bg-rose-500/10",
		iconColor: "text-rose-400",
		hoverStyle:
			"hover:border-rose-500 hover:shadow-[0_8px_32px_rgba(244,63,94,0.15)]",
	},
	{
		id: "module3",
		icon: Building2,
		title: "Vacance",
		desc: "Taux de logements vacants par région et répartition des résidences.",
		lightBg: "bg-amber-500/10",
		iconColor: "text-amber-400",
		hoverStyle:
			"hover:border-amber-500 hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)]",
	},
	{
		id: "module4",
		icon: TrendingUp,
		title: "Dynamique du Parc",
		desc: "Évolution de la vacance 2021→2023, part du parc social.",
		lightBg: "bg-teal-500/10",
		iconColor: "text-teal-400",
		hoverStyle:
			"hover:border-teal-500 hover:shadow-[0_8px_32px_rgba(20,184,166,0.15)]",
	},
	{
		id: "module5",
		icon: MapPin,
		title: "Territoire",
		desc: "Moteurs démographiques, attractivité migratoire, typologies urbain/rural.",
		lightBg: "bg-fuchsia-500/10",
		iconColor: "text-fuchsia-400",
		hoverStyle:
			"hover:border-fuchsia-500 hover:shadow-[0_8px_32px_rgba(217,70,239,0.15)]",
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
					<div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-[0_8px_24px_rgba(99,102,241,0.25)] shrink-0">
						<BarChart3
							className="w-7 h-7 text-white"
							strokeWidth={2.5}
						/>
					</div>
					<div>
						<p className="text-xs font-bold text-slate-400 tracking-[0.15em] uppercase">
							Plateforme analytique
						</p>
						<h1 className="font-['Syne',sans-serif] font-extrabold text-[32px] text-white leading-none">
							IRIS
						</h1>
					</div>
				</div>
				<p className="text-[17px] text-slate-400 max-w-[580px] leading-[1.7]">
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
				<p className="font-['Syne',sans-serif] font-bold text-xs uppercase tracking-[0.12em] text-slate-500 mb-4">
					Modules d'analyse
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{modules.map((m) => (
						<button
							key={m.id}
							onClick={() => onNavigate(m.id)}
							className={`bg-slate-800 border-[1.5px] border-slate-700 rounded-[16px] p-6 text-left transition-all duration-200 cursor-pointer hover:-translate-y-[2px] ${m.hoverStyle}`}
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
									className="w-5 h-5 text-slate-500"
									strokeWidth={2}
								/>
							</div>
							<p className="font-['Syne',sans-serif] font-bold text-[15px] text-slate-50 mb-1.5">
								{m.title}
							</p>
							<p className="text-[12.5px] text-slate-400 leading-[1.6]">
								{m.desc}
							</p>
						</button>
					))}

					<div className="bg-slate-800/50 border-[1.5px] border-dashed border-slate-700 rounded-[16px] p-6 flex flex-col items-center justify-center gap-2 opacity-60">
						<Plus
							className="w-8 h-8 text-slate-500"
							strokeWidth={1.5}
						/>
						<p className="text-xs text-slate-500">Module à venir</p>
					</div>
				</div>
			</div>
		</div>
	);
}
