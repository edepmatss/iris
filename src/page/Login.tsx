import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const { login } = useAuth();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await login(username, password);
			navigate("/");
		} catch (err: any) {
			setError(err.message || "Impossible de joindre le serveur.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 animate-fade-in">
			<div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-sm w-full max-w-md">
				<div className="text-center mb-8">
					<div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
						<Lock className="text-white" size={24} />
					</div>
					<h1 className="text-2xl font-black text-slate-50 font-['Syne']">
						Connexion Admin
					</h1>
					<p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-bold">
						Plateforme d'analyse IRIS
					</p>
				</div>

				{error && (
					<div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 animate-fade-in">
						<AlertCircle
							className="text-rose-500 mt-0.5 shrink-0"
							size={16}
						/>
						<p className="text-sm text-rose-400 font-medium">
							{error}
						</p>
					</div>
				)}

				<form onSubmit={handleLogin} className="space-y-5">
					<div className="space-y-1.5">
						<label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
							Identifiant
						</label>
						<div className="relative">
							<User
								className="absolute left-3 top-3 text-slate-500"
								size={16}
							/>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500/50 transition-all"
								placeholder="Saisissez votre identifiant"
								required
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
							Mot de passe
						</label>
						<div className="relative">
							<Lock
								className="absolute left-3 top-3 text-slate-500"
								size={16}
							/>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500/50 transition-all"
								placeholder="••••••••"
								required
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white border border-indigo-700 px-5 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
					>
						{isLoading ? (
							<span className="animate-pulse">Connexion...</span>
						) : (
							<>
								<LogIn size={18} />
								Se connecter
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
