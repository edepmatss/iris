import React from "react";
import {
	Home,
	Map,
	Users,
	Building2,
	TrendingUp,
	MapPin,
	BarChart3,
	ChevronLeft,
	LogIn,
	LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";

interface SidebarProps {
	page: string;
	setPage: (page: string) => void;
	sidebarOpen: boolean;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NAV = [
	{ id: "home", label: "Accueil", icon: Home },
	{ id: "module1", label: "Vue Nationale", icon: Map },
	{ id: "module2", label: "Précarité", icon: Users },
	{ id: "module3", label: "Vacance", icon: Building2 },
	{ id: "module4", label: "Dynamique", icon: TrendingUp },
	{ id: "module5", label: "Territoire", icon: MapPin },
];

export default function Sidebar({
	page,
	setPage,
	sidebarOpen,
	setSidebarOpen,
}: SidebarProps) {
	const { user, logout } = useAuth();

	return (
		<aside
			className={`fixed top-0 left-0 bottom-0 z-[200] flex flex-col bg-slate-900 border-r border-slate-700 shrink-0 transition-[width] duration-200 ease-in-out ${
				sidebarOpen ? "w-[230px]" : "w-[64px]"
			}`}
		>
			<div
				className={`border-b border-slate-700 ${
					sidebarOpen ? "pt-7 px-5 pb-5" : "pt-7 px-3.5 pb-5"
				}`}
			>
				<div className="flex items-center gap-2.5">
					<div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 shadow-md shadow-indigo-600/20">
						<BarChart3
							className="w-[18px] h-[18px] text-white"
							strokeWidth={2.5}
						/>
					</div>

					{sidebarOpen && (
						<div>
							<p className="font-['Syne',sans-serif] font-extrabold text-lg text-slate-50 tracking-tight leading-none">
								IRIS
							</p>
							<p className="text-[9px] text-slate-400 tracking-widest uppercase mt-0.5">
								Analyse Immo
							</p>
						</div>
					)}
				</div>
			</div>

			<nav className="flex-1 px-2.5 py-3 overflow-y-auto">
				{NAV.map((item) => {
					const isActive = page === item.id;
					const Icon = item.icon;

					return (
						<button
							key={item.id}
							onClick={() => setPage(item.id)}
							title={!sidebarOpen ? item.label : ""}
							className={`w-full flex items-center rounded-lg mb-1 transition-all duration-150 text-[13px] border ${
								sidebarOpen
									? "gap-2.5 justify-start px-3 py-2.5"
									: "gap-0 justify-center p-2.5"
							} ${
								isActive
									? "bg-indigo-500/10 text-indigo-400 font-bold border-indigo-500/30"
									: "bg-transparent text-slate-400 font-medium border-transparent hover:bg-slate-800"
							}`}
						>
							<span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">
								<Icon
									className="w-full h-full"
									strokeWidth={isActive ? 2.5 : 2}
								/>
							</span>

							{sidebarOpen && <span>{item.label}</span>}
							{sidebarOpen && isActive && (
								<div className="ml-auto w-1 h-4 rounded-full bg-indigo-500" />
							)}
						</button>
					);
				})}
			</nav>

			<div className="px-2.5 py-3 border-t border-slate-700">
				{user ? (
					<button
						onClick={logout}
						title={!sidebarOpen ? "Déconnexion" : ""}
						className={`w-full flex items-center rounded-lg mb-3 transition-all duration-150 text-[13px] border border-transparent bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 ${
							sidebarOpen
								? "gap-2.5 justify-start px-3 py-2"
								: "gap-0 justify-center p-2.5"
						}`}
					>
						<span className="shrink-0 flex items-center justify-center w-[16px] h-[16px]">
							<LogOut className="w-full h-full" strokeWidth={2} />
						</span>
						{sidebarOpen && (
							<span className="font-medium truncate">
								Déconnexion ({user})
							</span>
						)}
					</button>
				) : (
					<button
						onClick={() => setPage("login")}
						title={!sidebarOpen ? "Connexion" : ""}
						className={`w-full flex items-center rounded-lg mb-3 transition-all duration-150 text-[13px] border border-transparent bg-slate-800 text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 ${
							sidebarOpen
								? "gap-2.5 justify-start px-3 py-2"
								: "gap-0 justify-center p-2.5"
						}`}
					>
						<span className="shrink-0 flex items-center justify-center w-[16px] h-[16px]">
							<LogIn className="w-full h-full" strokeWidth={2} />
						</span>
						{sidebarOpen && (
							<span className="font-medium">Connexion Admin</span>
						)}
					</button>
				)}

				<button
					onClick={() => setSidebarOpen((s) => !s)}
					className={`w-full px-3 py-2 rounded-lg text-slate-400 text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-colors ${
						sidebarOpen ? "justify-between" : "justify-center"
					}`}
				>
					{sidebarOpen && (
						<span className="text-[11px]">Réduire menu</span>
					)}
					<ChevronLeft
						className={`w-4 h-4 transition-transform duration-200 ${
							sidebarOpen ? "rotate-0" : "rotate-180"
						}`}
						strokeWidth={2}
					/>
				</button>

				{sidebarOpen && (
					<p className="text-[10px] text-slate-500 text-center mt-3">
						irisdb • INSEE 2021–2023
					</p>
				)}
			</div>
		</aside>
	);
}
