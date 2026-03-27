import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
	FilePlus2,
	Upload,
	CheckCircle2,
	XCircle,
	Pencil,
	Trash2,
	ListChecks,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const widgets = [
	{ id: 1, name: "Tableau France 3", status: "Active" },
	{ id: 2, name: "Tableau France 2", status: "Active" },
	{ id: 3, name: "Tableau France 1", status: "Unactive" },
];

export default function Dashboard() {
	const [dragging, setDragging] = useState<boolean>(false);
	const [fileName, setFileName] = useState<string | null>(null);
	const progress = 67;

	// Typage strict de la référence vers l'input HTML
	const inputRef = useRef<HTMLInputElement>(null);

	const { user } = useAuth();
	const navigate = useNavigate();

	// si c'est pas connecté on retourne a l'accueil
	if (!user) {
		navigate("/");
		return null;
	}

	// Typage strict du fichier
	const handleFile = (file?: File) => {
		if (file) setFileName(file.name);
	};

	return (
		<div
			className="h-100 bg-slate-100 flex items-start justify-center"
			style={{ padding: "2rem" }}
		>
			<div className="w-full max-w-12xl grid grid-cols-2 gap-5">
				{/* ── Importer des Données ── */}
				<div
					className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5"
					style={{ padding: "1.5rem" }}
				>
					<h3 className="flex items-center gap-2 text-xs font-semibold text-slate-700 tracking-wide m-0">
						<FilePlus2 size={15} className="text-slate-400" />
						Importer des Données
					</h3>

					{/* Input caché */}
					<input
						ref={inputRef}
						type="file"
						accept=".csv"
						style={{ display: "none" }}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							handleFile(e.target.files?.[0])
						}
					/>

					{/* Drop zone */}
					<div
						onDragOver={(e: DragEvent<HTMLDivElement>) => {
							e.preventDefault();
							setDragging(true);
						}}
						onDragLeave={() => setDragging(false)}
						onDrop={(e: DragEvent<HTMLDivElement>) => {
							e.preventDefault();
							setDragging(false);
							handleFile(e.dataTransfer.files?.[0]);
						}}
						onClick={() => inputRef.current?.click()}
						className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
							dragging
								? "border-blue-400 bg-blue-50"
								: "border-slate-200 bg-slate-50 hover:border-slate-300"
						}`}
						style={{ padding: "2.5rem 1.5rem" }}
					>
						<Upload size={22} className="text-slate-400" />
						<p className="text-xs text-slate-400 text-center leading-relaxed m-0">
							{fileName ? (
								<strong className="text-slate-600">
									{fileName}
								</strong>
							) : (
								<>
									Glissez-déposez votre fichier{" "}
									<strong className="text-slate-500">
										.csv
									</strong>
								</>
							)}
						</p>
						<button
							onClick={(e) => {
								e.stopPropagation();
								inputRef.current?.click();
							}}
							className="rounded-lg border border-slate-300 bg-white text-xs text-slate-600 font-medium shadow-sm hover:bg-slate-50 cursor-pointer"
							style={{
								padding: "0.375rem 1rem",
								marginTop: "0.25rem",
							}}
						>
							Choisir un fichier
						</button>
					</div>

					{/* Progress */}
					<div className="flex flex-col gap-1.5">
						<div className="flex justify-between items-center">
							<span className="text-xs text-slate-500">
								Importation en cours...
							</span>
							<span className="text-xs font-semibold text-slate-600">
								{progress}%
							</span>
						</div>
						<div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
							<div
								className="h-full rounded-full bg-blue-500 transition-all duration-700"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<p className="text-xs text-slate-400 m-0">
							Dernier import : 07/03/2025
						</p>
					</div>
				</div>

				{/* ── Gérer les Widgets Existants ── */}
				<div
					className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4"
					style={{ padding: "1.5rem" }}
				>
					<h3 className="flex items-center gap-2 text-xs font-semibold text-slate-700 tracking-wide m-0">
						<ListChecks size={15} className="text-slate-400" />
						Gérer les widgets existants
					</h3>

					<ul
						className="list-none m-0 flex flex-col gap-2"
						style={{ padding: 0 }}
					>
						{widgets.map((w) => {
							const isActive = w.status === "Active";
							return (
								<li
									key={w.id}
									className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100 transition-colors"
									style={{ padding: "0.75rem 1rem" }}
								>
									<div className="flex items-center gap-3">
										{isActive ? (
											<CheckCircle2
												size={18}
												className="text-emerald-500 shrink-0"
											/>
										) : (
											<XCircle
												size={18}
												className="text-rose-400 shrink-0"
											/>
										)}
										<div>
											<p className="m-0 text-sm font-semibold text-slate-700">
												{w.name}
											</p>
											<p
												className={`m-0 text-xs font-medium ${isActive ? "text-emerald-500" : "text-rose-400"}`}
											>
												Statut : {w.status}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-1">
										<button
											className="rounded-lg border-none bg-transparent cursor-pointer text-slate-400 hover:text-blue-500 hover:bg-blue-50 flex items-center transition-colors"
											style={{ padding: "0.35rem" }}
										>
											<Pencil size={13} />
										</button>
										<button
											className="rounded-lg border-none bg-transparent cursor-pointer text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center transition-colors"
											style={{ padding: "0.35rem" }}
										>
											<Trash2 size={13} />
										</button>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}
