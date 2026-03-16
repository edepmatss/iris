import "./App.scss";
import { Routes, Route } from "react-router-dom";

// components
import Navbar from "./components/Navbar";
import Header from "./components/header/Header";

// pages
import Dashboard from "./page/admin/dashbord";
import Module1 from "./page/module1/module1";
import Module2 from "./page/module2/module2";

function App() {
	return (
		<div className="flex w-screen h-screen bg-white overflow-hidden text-black">
			<Navbar />

			<main className="flex-1 relative">
				<Header title="Dashboard" />
				<Routes>
					<Route path="/" element={<Module1 />} />
					<Route path="/module1" element={<Dashboard />} />
					<Route path="/module2" element={<Module2 />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
