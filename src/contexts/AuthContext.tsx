import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
	user: string | null;
	login: (u: string, p: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = import.meta.env.DEV
	? "http://127.0.0.1:8000/api"
	: "https://iris-db.alwaysdata.net/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<string | null>(() => {
		return localStorage.getItem("admin_user");
	});

	const login = async (username: string, password: string) => {
		const response = await fetch(`${API_BASE}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ username, password }),
		});

		if (response.ok) {
			const data = await response.json();
			setUser(data.user);
			localStorage.setItem("admin_user", data.user);
		} else if (response.status === 401) {
			throw new Error("Identifiants incorrects.");
		} else {
			throw new Error("Erreur serveur.");
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("admin_user");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error(
			"useAuth doit être utilisé à l'intérieur d'un AuthProvider",
		);
	}
	return context;
}
