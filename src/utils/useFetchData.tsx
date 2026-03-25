import { useEffect, useState } from "react";

// On définit les deux URLs
const API_URL_LOCAL = "http://127.0.0.1:8000/api/stats";
const API_URL_PROD = "https://iris-db.alwaysdata.net/api/stats";

export default function useFetchData(endpoint: string, query?: string) {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// Détection de l'environnement (Vite utilise import.meta.env.DEV)
	const isLocal = import.meta.env.DEV;

	useEffect(() => {
		setLoading(true);

		// On choisit la base en fonction de l'environnement
		const base = isLocal ? API_URL_LOCAL : API_URL_PROD;
		const url = query
			? `${base}/${endpoint}?${query}`
			: `${base}/${endpoint}`;

		fetch(url, { headers: { Accept: "application/json" } })
			.then((res) => {
				if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
				return res.json();
			})
			.then((json) => {
				setData(json);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Erreur API IRIS:", err);
				setLoading(false);
			});
	}, [endpoint, query, isLocal]);

	return { data, loading };
}
