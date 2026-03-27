import { useEffect, useState } from "react";

const API_URL = "https://iris-db.alwaysdata.net/api/stats";

export default function useFetchData(endpoint: string, query?: string) {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		const url = query
			? `${API_URL}/${endpoint}?${query}`
			: `${API_URL}/${endpoint}`;

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

	}, [endpoint, query]);

	return { data, loading };
}