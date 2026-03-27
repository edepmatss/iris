import {
	Map,
	Users,
	Building2,
	TrendingUp,
	MapPin,
	ArrowRight,
	Plus,
	Activity,
} from "lucide-react";
import useFetchData from "../utils/useFetchData";

const T = {
	accent: "#0e7490",
	textMuted: "#64748b",
	textLight: "#94a3b8",
	ink: "#0f172a",
};

interface HomeProps {
	onNavigate: (pageId: string) => void;
}

const modules = [
	{
		id: "module1",
		icon: Map,
		title: "L'Offre et la Tension",
		desc: "Découvrez quels départements sont les meilleurs élèves et comment le parc a évolué depuis 2021.",
		lightBg: "bg-sky-50",
		iconColor: "text-sky-600",
		hoverStyle:
			"hover:border-sky-200 hover:shadow-[0_8px_32px_rgba(14,165,233,0.15)]",
	},
	{
		id: "module2",
		icon: Users,
		title: "Précarité et Solidarité",
		desc: "Le logement social est-il vraiment là où on en a le plus besoin ? Croisez les taux de pauvreté avec l'offre de logements.",
		lightBg: "bg-pink-50",
		iconColor: "text-pink-600",
		hoverStyle:
			"hover:border-pink-200 hover:shadow-[0_8px_32px_rgba(236,72,153,0.15)]",
	},
	// {
	// 	id: "module3",
	// 	icon: Building2,
	// 	title: "Urgence Énergétique",
	// 	desc: "Passoires thermiques ou bâtiments basse consommation ? Analysez la performance écologique du parc social actuel.",
	// 	lightBg: "bg-amber-50",
	// 	iconColor: "text-amber-600",
	// 	hoverStyle:
	// 		"hover:border-amber-200 hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)]",
	// },
	{
		id: "module4",
		icon: TrendingUp,
		title: "Mobilité et Vacance",
		desc: "Le parc est-il figé ? Observez les taux de rotation, les démolitions et la vacance locative.",
		lightBg: "bg-emerald-50",
		iconColor: "text-emerald-600",
		hoverStyle:
			"hover:border-emerald-200 hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)]",
	},
	{
		id: "module5",
		icon: MapPin,
		title: "Demain, quel Habitat ?",
		desc: "Entre explosion de la jeunesse et papy-boom, voyez comment les territoires anticipent les besoins de demain.",
		lightBg: "bg-purple-50",
		iconColor: "text-purple-600",
		hoverStyle:
			"hover:border-purple-200 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]",
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
					<div className="w-[52px] h-[52px] rounded-[14px] bg-cyan-900 flex items-center justify-center shadow-md shadow-cyan-900/10 shrink-0">
						<Activity
							className="w-7 h-7 text-white"
							strokeWidth={2.5}
						/>
					</div>
					<div>
						<p className="font-abril text-sm text-slate-500 mb-1">
							Plateforme Analytique
						</p>
						<h1 className="font-abril font-normal text-[36px] text-slate-900 leading-none tracking-tight">
							iris.
						</h1>
					</div>
				</div>
				<p className="font-bold text-xl">
					Le Logement Social sous la Loupe : État des Lieux et Défis Territoriaux (2021-2023)
				</p>
				<p className="text-[17px] text-slate-500 max-w-[580px] leading-[1.7]">Explorez les données clés pour comprendre comment le parc social français s'adapte aux crises économiques, au vieillissement de la population et à l'urgence écologique.</p>

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
				<p className="font-bold text-xs uppercase tracking-[0.12em] text-slate-500 mb-4">
					Modules d'analyse
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{modules.map((m) => (
						<button
							key={m.id}
							onClick={() => onNavigate(m.id)}
							className={`bg-white border-[1.5px] border-slate-100 rounded-[16px] p-6 text-left transition-all duration-200 cursor-pointer hover:-translate-y-[2px] shadow-sm ${m.hoverStyle}`}
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
									className="w-5 h-5 text-slate-300"
									strokeWidth={2}
								/>
							</div>
							<p className="font-bold text-[15px] text-slate-900 mb-1.5">
								{m.title}
							</p>
							<p className="text-[12.5px] text-slate-500 leading-[1.6]">
								{m.desc}
							</p>
						</button>
					))}

					<div className="bg-slate-50/50 border-[1.5px] border-dashed border-slate-200 rounded-[16px] p-6 flex flex-col items-center justify-center gap-2">
						<Plus
							className="w-8 h-8 text-slate-300"
							strokeWidth={1.5}
						/>
						<p className="text-xs text-slate-400">Module à venir</p>
					</div>
				</div>
			</div>
		</div>
	);
}
