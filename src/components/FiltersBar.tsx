import React, { useState, useEffect } from "react";
import { Filter, RotateCcw, ChevronDown } from "lucide-react";

interface Filters {
	annee: string;
	region: string;
	dept: string;
}

interface FiltersBarProps {
	filters: Filters;
	setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

interface Region {
	id: number | string;
	nomRegion?: string;
	nom_region?: string;
}

interface Departement {
	id: number | string;
	nomDepartement?: string;
	nom_departement?: string;
	codeDepartement?: string;
	code_departement?: string;
}

const API_BASE = import.meta.env.DEV
	? "http://127.0.0.1:8000/api"
	: "https://iris-db.alwaysdata.net/api";

export default function FiltersBar({ filters, setFilters }: FiltersBarProps) {
	const [regions, setRegions] = useState<Region[]>([]);
	const [departements, setDepartements] = useState<Departement[]>([]);

	// 1. Fetch des régions au chargement
	useEffect(() => {
		fetch(`${API_BASE}/regions`, {
			headers: { Accept: "application/json" },
		})
			.then((res) => res.json())
			.then((data) => {
				const list = Array.isArray(data)
					? data
					: data["hydra:member"] || [];
				setRegions(list);
			})
			.catch((err) => console.error("Erreur régions:", err));
	}, []);

	useEffect(() => {
		if (filters.region) {
			fetch(`${API_BASE}/departements?idRegion=${filters.region}`, {
				headers: { Accept: "application/json" },
			})
				.then((res) => res.json())
				.then((data) => {
					const list = Array.isArray(data)
						? data
						: data["hydra:member"] || [];
					setDepartements(list);
				})
				.catch((err) => console.error("Erreur départements:", err));
		}
	}, [filters.region]);

	const resetFilters = () => {
		setFilters({ annee: "", region: "", dept: "" });
		setDepartements([]);
	};

	return (
		<div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap items-end gap-6 animate-fade-in">
			<div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] tracking-[0.12em] mb-2.5 px-1">
				<Filter size={14} strokeWidth={2.5} />
				FILTRES
			</div>

			<div className="flex flex-col gap-1.5 min-w-[120px]">
				<label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
					Année
				</label>
				<div className="relative">
					<select
						value={filters.annee}
						onChange={(e) =>
							setFilters({ ...filters, annee: e.target.value })
						}
						className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500/50 cursor-pointer transition-all"
					>
						<option value="2023">2023</option>
						<option value="2022">2022</option>
						<option value="2021">2021</option>
					</select>
					<ChevronDown
						className="absolute right-3 top-3 text-slate-500 pointer-events-none"
						size={14}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1.5 min-w-[200px]">
				<label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
					Région
				</label>
				<div className="relative">
					<select
						value={filters.region}
						onChange={(e) => {
							const newRegion = e.target.value;
							setFilters({
								...filters,
								region: newRegion,
								dept: "",
							});
							if (!newRegion) {
								setDepartements([]);
							}
						}}
						className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500/50 cursor-pointer transition-all"
					>
						<option value="">Toutes les régions</option>
						{regions.map((r) => (
							<option key={r.id} value={r.id}>
								{r.nomRegion || r.nom_region}
							</option>
						))}
					</select>
					<ChevronDown
						className="absolute right-3 top-3 text-slate-500 pointer-events-none"
						size={14}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1.5 min-w-[220px]">
				<label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
					Département
				</label>
				<div className="relative">
					<select
						value={filters.dept}
						onChange={(e) =>
							setFilters({ ...filters, dept: e.target.value })
						}
						disabled={!filters.region}
						className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500/50 cursor-pointer disabled:opacity-50 disabled:bg-slate-800 transition-all"
					>
						<option value="">
							{filters.region
								? "Tous les départements"
								: "Sélectionner une région"}
						</option>
						{departements.map((d) => (
							<option
								key={d.id}
								value={d.nomDepartement || d.nom_departement}
							>
								{d.codeDepartement || d.code_departement} -{" "}
								{d.nomDepartement || d.nom_departement}
							</option>
						))}
					</select>
					<ChevronDown
						className="absolute right-3 top-3 text-slate-500 pointer-events-none"
						size={14}
					/>
				</div>
			</div>

			{(filters.annee !== "2023" || filters.region || filters.dept) && (
				<button
					onClick={resetFilters}
					className="flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-5 py-2.5 rounded-xl text-[11px] font-bold hover:bg-rose-500/20 hover:border-rose-500/30 transition-all mb-0.5 active:scale-95"
				>
					<RotateCcw size={14} strokeWidth={2.5} />
					Réinitialiser
				</button>
			)}
		</div>
	);
}
