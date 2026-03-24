import { BellDot, Search, UserRound } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { useState, useEffect } from "react";

function Header({ title }: { title: string }) {
	const { searchQuery, setSearchQuery } = useSearch();
	const [suggestions, setSuggestions] = useState<
		{ code: string; nom: string }[]
	>([]);
	const [showDropdown, setShowDropdown] = useState(false);

	const isLocal = import.meta.env.DEV;
	const API_URL = isLocal
		? "http://127.0.0.1:8000/api/stats"
		: "https://iris-db.alwaysdata.net/api/stats";

	// Ce useEffect gère la recherche en direct
	useEffect(() => {
		if (searchQuery.length < 2) {
			setSuggestions([]);
			setShowDropdown(false);
			return;
		}

		const fetchSuggestions = async () => {
			try {
				const res = await fetch(
					`${API_URL}/search-suggestions?q=${encodeURIComponent(searchQuery)}`,
				);
				const data = await res.json();
				setSuggestions(data);
				setShowDropdown(true);
			} catch (err) {
				console.error("Erreur Suggestions:", err);
			}
		};

		// On attend 300ms avant de chercher pour éviter de spammer l'API quand on tape vite
		const timer = setTimeout(fetchSuggestions, 300);
		return () => clearTimeout(timer);
	}, [searchQuery, API_URL]);

	// Quand on clique sur une suggestion
	const handleSelect = (nom: string) => {
		setSearchQuery(nom); // Rempli l'input avec le nom complet
		setShowDropdown(false); // Cache le menu
	};

	return (
		<header className="h-20 flex items-center justify-between px-12 bg-[#FFFFFF] sticky top-0 z-10">
			<h1 className="text-2xl font-bold">{title}</h1>
			<div className="flex items-center gap-4">
				<button className="relative cursor-pointer bg-[#8D8D8D] w-10 h-10 flex items-center justify-center rounded">
					<BellDot size={25} className="invert" />
					<div className="absolute top-2.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
				</button>

				{/* --- BLOC RECHERCHE --- */}
				<div className="relative flex items-center gap-2 bg-[#8D8D8D] h-10 rounded px-2 w-64">
					<Search size={25} className="invert" />
					<input
						type="text"
						placeholder="Rechercher (ex: Paris, 75)..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onFocus={() =>
							suggestions.length > 0 && setShowDropdown(true)
						}
						// setTimeout pour laisser le temps de cliquer sur la suggestion avant de cacher
						onBlur={() =>
							setTimeout(() => setShowDropdown(false), 200)
						}
						className="outline-none text-white bg-transparent w-full h-full placeholder:text-gray-300"
					/>

					{/* MENU DÉROULANT DES SUGGESTIONS */}
					{showDropdown && suggestions.length > 0 && (
						<ul className="absolute top-12 left-0 w-full bg-white shadow-xl rounded-lg overflow-hidden z-50 border border-gray-100">
							{suggestions.map((s, index) => (
								<li
									key={index}
									onClick={() => handleSelect(s.nom)}
									className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
								>
									<span className="font-bold text-indigo-400 w-6">
										{s.code}
									</span>
									<span>{s.nom}</span>
								</li>
							))}
						</ul>
					)}
				</div>

				<button className="cursor-pointer bg-[#8D8D8D] w-10 h-10 flex items-center justify-center rounded">
					<UserRound size={25} className="invert" />
				</button>
			</div>
		</header>
	);
}

export default Header;
