import React from "react";
import {
	Home,
	Map,
	Users,
	Building2,
	TrendingUp,
	MapPin,
	Activity,
	ChevronLeft,
	LogIn,
	LogOut,
	Settings,
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
	{ id: "module1", label: "L'Offre et la Tension", icon: Map },
	{ id: "module2", label: "Précarité et Solidarité", icon: Users },
	{ id: "module3", label: "Urgence Énergétique", icon: Building2 },
	{ id: "module4", label: "Mobilité et Vacance", icon: TrendingUp },
	{ id: "module5", label: "Demain, quel Habitat ?", icon: MapPin },
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
			className={`fixed top-0 left-0 bottom-0 z-[200] flex flex-col bg-white border-r border-slate-200 shrink-0 transition-[width] duration-200 ease-in-out ${
				sidebarOpen ? "w-[230px]" : "w-[64px]"
			}`}
		>
			<div
				className={`border-b border-slate-200 ${
					sidebarOpen ? "pt-7 px-5 pb-5" : "pt-7 px-3.5 pb-5"
				}`}
			>
				<div className="flex items-center gap-2.5">
					<div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-xl bg-cyan-900 shadow-md">
						<Activity
							className="w-[18px] h-[18px] text-white"
							strokeWidth={2.5}
						/>
					</div>

					{sidebarOpen && (
						<div>
							<p className="font-abril font-normal text-lg text-slate-900 tracking-normal leading-none">
								iris.
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
									? "bg-sky-50 text-sky-800 font-bold border-sky-100"
									: "bg-transparent text-slate-500 font-medium border-transparent hover:bg-slate-50"
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
								<div className="ml-auto w-1 h-4 rounded-full bg-cyan-600" />
							)}
						</button>
					);
				})}

				{/* admin button qui apparait que quand on est connecté */}
				{user && (
					<button
						key="admin"
						onClick={() => setPage("admin")}
						title={!sidebarOpen ? "Admin" : ""}
						className={`w-full flex items-center rounded-lg mb-1 mt-4 transition-all duration-150 text-[13px] border ${
							sidebarOpen
								? "gap-2.5 justify-start px-3 py-2.5"
								: "gap-0 justify-center p-2.5"
						} ${
							page === "admin"
								? "bg-sky-50 text-sky-800 font-bold border-sky-100"
								: "bg-transparent text-slate-500 font-medium border-transparent hover:bg-slate-50"
						}`}
					>
						<span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">
							<Settings
								className="w-full h-full"
								strokeWidth={page === "admin" ? 2.5 : 2}
							/>
						</span>
						{sidebarOpen && <span>Admin</span>}
						{sidebarOpen && page === "admin" && (
							<div className="ml-auto w-1 h-4 rounded-full bg-cyan-600" />
						)}
					</button>
				)}
			</nav>

			<div className="px-2.5 py-3 border-t border-slate-200">
				{user ? (
					<button
						onClick={logout}
						title={!sidebarOpen ? "Déconnexion" : ""}
						className={`w-full flex items-center rounded-lg mb-3 transition-all duration-150 text-[13px] border border-transparent bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-200 ${
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
						className={`w-full flex items-center rounded-lg mb-3 transition-all duration-150 text-[13px] border border-transparent bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 ${
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
					className={`w-full px-3 py-2 rounded-lg text-slate-500 text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors ${
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
