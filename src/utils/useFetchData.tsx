import { useEffect, useState } from "react";

const API_URL = "https://iris-db.alwaysdata.net/api/stats";
const API_URL_Local = "http://127.0.0.1:8000/api/stats";

// Ajout du paramètre optionnel 'search'
export default function useFetchData(module: string, search?: string) {
	const [data, setData] = useState<any>(null); // 'any' ou une interface pour plus de précision
	const [loading, setLoading] = useState(true);

	const isLocal = import.meta.env.DEV;

	useEffect(() => {
		setLoading(true); // On remet le chargement à vrai dès que la recherche change

		// Construction de l'URL avec le paramètre de requête ?search=
		const endpoint = module === "module1" ? "dashboard-module1" : module;
		const queryParam = search
			? `?search=${encodeURIComponent(search)}`
			: "";
		const base = isLocal ? API_URL_Local : API_URL;

		fetch(`${base}/${endpoint}${queryParam}`)
			.then((res) => res.json())
			.then((json) => {
				setData(json);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Erreur Fetch:", err);
				setLoading(false);
			});

		// Crucial : On ajoute 'search' ici pour que le fetch se relance à chaque frappe
	}, [module, search, isLocal]);

	return { data, loading };
}
