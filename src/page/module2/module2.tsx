import React, { useEffect, useState } from "react";
import { Scatter, Bubble } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const Module2 = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("https://iris-db.alawaysdata.net/api/stats/module2")
            .then((res) => res.json())
            .then((res) => setData(res))
            .catch((err) => console.error("Erreur API:", err));
    }, []);

    if (!data) return <p>Chargement du Module 2...</p>;

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => context.raw.name || "",
                },
            },
        },
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <div style={{ width: "80%", margin: "0 auto" }}>
                <h3>Corrélation Pauvreté / Logement Social (2023)</h3>
                <Scatter data={data.scatter} options={options} />
            </div>

            <div style={{ width: "80%", margin: "0 auto" }}>
                <h3>Focus Chômage et Loyer Social (Top 10 départements)</h3>
                <p>
                    <small>
                        Axe X: Chômage (%), Axe Y: Loyer (€), Taille: Vacance
                        (%)
                    </small>
                </p>
                <Bubble data={data.bubble} options={options} />
            </div>
        </div>
    );
};

export default Module2;
