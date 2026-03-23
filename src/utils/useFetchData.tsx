import { useEffect, useState } from "react";

export default function useFetchData(endpoint: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        
        const path = endpoint === 'module1' ? 'dashboard-module1' : endpoint;

        fetch(`https://iris-db.alwaysdata.net/api/stats/${path}`)
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur Fetch:", err);
                setLoading(false);
            });
    }, [endpoint]);

    return { data, loading };
}