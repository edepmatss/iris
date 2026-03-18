import { useEffect, useState } from "react";

export default function useFetchData(module: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://iris-db.alwaysdata.net/api/stats/${module === 'module1' ? 'dashboard-module1' : module}`)
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur Fetch:", err);
                setLoading(false);
            });
    }, []);

    return { data, loading };
}