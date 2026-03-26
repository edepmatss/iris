import { useState } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Outlet,
	useLocation,
	useNavigate,
} from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./contexts/AuthContext.tsx";

import Home from "./page/Home.tsx";
import Module1 from "./page/Module1";
import Module2 from "./page/Module2";
import Module3 from "./page/Module3";
import Module4 from "./page/Module4";
import Module5 from "./page/Module5";
import Login from "./page/Login.tsx";
import PageHeader from "./components/PageHeader.tsx";
import FiltersBar from "./components/FiltersBar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Admin from "./page/admin/dashbord.tsx";

const TITLES: Record<string, string> = {
	module1: "Vue Nationale",
	module2: "Précarité & Social",
	module3: "Vacance du Parc",
	module4: "Dynamique du Parc",
	module5: "Analyse Territoriale",
};

interface Filters {
	annee: string;
	region: string;
	dept: string;
}

interface ModuleLayoutProps {
	filters: Filters;
	setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

function ModuleLayout({ filters, setFilters }: ModuleLayoutProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const page = location.pathname.substring(1);

	return (
		<div className="max-w-[1200px] mx-auto">
			<PageHeader
				title={TITLES[page] || "Module"}
				onBack={() => navigate("/")}
			/>
			<FiltersBar filters={filters} setFilters={setFilters} />
			<div className="mt-8 animate-fade-in">
				<Outlet />
			</div>
		</div>
	);
}

function AppContent() {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
	const [filters, setFilters] = useState<Filters>({
		annee: "",
		region: "",
		dept: "",
	});

	const location = useLocation();
	const navigate = useNavigate();
	const isLoginPage = location.pathname === "/login";
	const page =
		location.pathname === "/" ? "home" : location.pathname.substring(1);

	return (
		<div className="flex min-h-screen bg-slate-900">
			{!isLoginPage && (
				<Sidebar
					page={page}
					setPage={(p: string) =>
						navigate(p === "home" ? "/" : `/${p}`)
					}
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>
			)}

			<main
				className={
					isLoginPage
						? "flex-1 w-full"
						: `flex-1 transition-all duration-200 p-8 ${
								sidebarOpen ? "ml-[230px]" : "ml-[64px]"
							}`
				}
			>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/"
						element={
							<Home
								onNavigate={(p: string) => navigate(`/${p}`)}
							/>
						}
					/>
					<Route
						element={
							<ModuleLayout
								filters={filters}
								setFilters={setFilters}
							/>
						}
					>
						<Route
							path="/module1"
							element={<Module1 filters={filters} />}
						/>
						<Route
							path="/module2"
							element={<Module2 filters={filters} />}
						/>
						<Route
							path="/module3"
							element={<Module3 filters={filters} />}
						/>
						<Route
							path="/module4"
							element={<Module4 filters={filters} />}
						/>
						<Route
							path="/module5"
							element={<Module5 filters={filters} />}
						/>
						<Route path="/admin" element={<Admin />} />
					</Route>

					<Route
						path="*"
						element={
							<div className="p-10 text-slate-400">
								Page introuvable...
							</div>
						}
					/>
				</Routes>
			</main>
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</BrowserRouter>
	);
}
