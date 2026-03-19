import "./App.scss";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Header from "./components/header/Header";

import Identification from "./page/identification/identification";
import Dashboard from "./page/admin/dashbord";
import Regions from "./page/regions/regions";
import Departements from "./page/departements/departements";
import Map from "./page/map/map";
import Accueil from "./page/accueil/accueil";
import Gestiondonnees from "./page/admin/gestiondonnees";
import ConfGraphs from "./page/admin/confgraphs";

const GuestLayout = () => {
	return (
		<div className="flex w-screen h-screen bg-white overflow-hidden text-black">
			<Navbar />
			<main className="flex-1 relative flex flex-col bg-gray-50">
				<Header title={localStorage.getItem('isAdmin') === 'true' ? "Espace Admin" : "Espace Apprentissage"} />
				<div className="flex-1 overflow-y-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

const AdminLayout = () => {
	const isAdmin = localStorage.getItem("isAdmin") === "true";

	if (!isAdmin) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="flex w-screen h-screen bg-white overflow-hidden text-black">
			<Navbar />
			<main className="flex-1 relative flex flex-col bg-gray-50">

				<div className="bg-white border-b border-gray-200 px-10 py-6 shadow-sm z-10">
					<h1 className="text-2xl font-bold text-[#2D3142]">Espace Administrateur</h1>
				</div>

				<div className="flex-1 overflow-y-auto p-10">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

function App() {
	return (
		<Routes>
			<Route path="/admin/login" element={<Identification />} />

			<Route element={<GuestLayout />}>
				<Route path="/" element={<Accueil />} />
				<Route path="/regions" element={<Regions />} />
				<Route path="/departements" element={<Departements />} />
				<Route path="/map" element={<Map />} />
			</Route>

			<Route element={<AdminLayout />}>
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/data" element={<Gestiondonnees />} />
				<Route path="/charts" element={<ConfGraphs />} />
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;