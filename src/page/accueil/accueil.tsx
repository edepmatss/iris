import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const MODULE_CARDS = [
    {
        id: "region",
        title: "Régions",
        description: "Visualisez et analysez les données globales à l'échelle de la région.",
        link: "/regions",
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
        ),
    },
    {
        id: "departement",
        title: "Départements",
        description: "Plongez dans les détails et comparez les statistiques par département.",
        link: "/departements",
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
        ),
    },
    {
        id: "carte",
        title: "Carte Interactive",
        description: "Explorez les données géographiquement grâce à la carte interactive.",
        link: "/map",
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69-.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
        ),
    },
];

export default function Accueil() {
    const [kpiStats, setKpiStats] = useState<any[]>([]);
    const [top5Data, setTop5Data] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("https://iris-db.alwaysdata.net/api/stats/dashboard-accueil");
                if (!response.ok) {
                    throw new Error(`Erreur du serveur: ${response.status}`);
                }
                const data = await response.json();

                const formattedStats = [
                    {
                        id: "logements",
                        label: "Total Logements Sociaux",
                        value: data.kpis?.logementsSociaux?.value || "3.2 Millions",
                        trend: "Donnée à jour",
                        isUp: true,
                        color: "blue"
                    },
                    {
                        id: "chomage",
                        label: "Taux de chômage",
                        value: data.kpis?.tauxChomage?.value || "7.1 %",
                        trend: "Moyenne nationale 2022",
                        isUp: false,
                        color: "orange"
                    },
                    {
                        id: "pauvrete",
                        label: "Taux de pauvreté",
                        value: data.kpis?.tauxPauvrete?.value || "14.5 %",
                        trend: "Moyenne nationale 2022",
                        isUp: false,
                        color: "red"
                    }
                ];

                setKpiStats(formattedStats);
                setTop5Data(data.top5 || []);

            } catch (error) {
                console.error("Erreur API :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const renderSparkline = (type: string, color: string) => {
        let pathFill, pathStroke, colorClasses;

        if (color === "blue") colorClasses = { fill: "text-blue-100", stroke: "#3b82f6" };
        else if (color === "orange") colorClasses = { fill: "text-orange-100", stroke: "#f97316" };
        else if (color === "red") colorClasses = { fill: "text-red-100", stroke: "#ef4444" };
        else colorClasses = { fill: "text-gray-100", stroke: "#9ca3af" };

        if (type === "logements") {
            pathFill = "M0 30 L0 25 L20 22 L40 18 L60 15 L80 10 L100 5 L100 30 Z";
            pathStroke = "M0 25 L20 22 L40 18 L60 15 L80 10 L100 5";
        } else if (type === "chomage") {
            pathFill = "M0 30 L0 15 L15 10 L30 18 L45 8 L60 20 L75 12 L90 15 L100 10 L100 30 Z";
            pathStroke = "M0 15 L15 10 L30 18 L45 8 L60 20 L75 12 L90 15 L100 10";
        } else {
            pathFill = "M0 30 L0 20 L25 18 L50 12 L75 12 L100 10 L100 30 Z";
            pathStroke = "M0 20 L25 18 L50 12 L75 12 L100 10";
        }

        return (
            <svg className={`absolute bottom-0 left-0 w-full h-16 ${colorClasses.fill} opacity-40 pointer-events-none group-hover:opacity-60 transition-opacity`} viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d={pathFill} fill="currentColor" />
                <path d={pathStroke} fill="none" stroke={colorClasses.stroke} strokeWidth="1.5" />
            </svg>
        );
    };

    return (
        <div className="flex flex-col min-h-full bg-[#F4F6F9] p-6 lg:p-10 animate-fade-in">

            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-[#7165E3] rounded-full"></div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytique</h1>
                    </div>
                    <p className="text-gray-500 max-w-2xl text-lg">
                        Vue d'ensemble des indicateurs territoriaux. Sélectionnez un niveau de granularité pour démarrer votre exploration des données.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {isLoading ? (
                    [1, 2, 3].map((skeleton) => (
                        <div key={skeleton} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-32 animate-pulse flex flex-col justify-between">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                        </div>
                    ))
                ) : (
                    kpiStats.map((kpi) => (
                        <div key={kpi.id} className="relative overflow-hidden bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow">

                            {/* Appel de la fonction pour dessiner la courbe personnalisée */}
                            {renderSparkline(kpi.id, kpi.color)}

                            <div className="relative z-10">
                                <span className="text-gray-500 font-medium text-sm">{kpi.label}</span>
                                <div className="flex items-baseline gap-3 mt-2">
                                    <span className="text-3xl font-extrabold text-gray-900">{kpi.value}</span>
                                    {kpi.isUp !== null && (
                                        <span className={`text-sm font-semibold flex items-center ${kpi.isUp ? 'text-green-500' : 'text-gray-400'}`}>
                                            {kpi.trend}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#7165E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Outils d'exploration
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MODULE_CARDS.map((card) => (
                            <Link
                                key={card.id}
                                to={card.link}
                                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
                            >
                                <div className="bg-[#F4F6F9] text-[#7165E3] p-3 rounded-lg mb-4 group-hover:bg-[#7165E3] group-hover:text-white transition-colors duration-300">
                                    {card.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#7165E3] transition-colors duration-300">
                                    {card.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                    {card.description}
                                </p>
                                <div className="mt-auto flex items-center text-[#7165E3] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                                    <span>Accéder au module</span>
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Top 5 - Départements avec le plus de logements sociaux en 2022
                    </h2>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        {isLoading ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-gray-100 rounded"></div>)}
                            </div>
                        ) : top5Data.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {top5Data.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-blue-100 text-blue-600' : idx === 1 ? 'bg-gray-100 text-gray-600' : idx === 2 ? 'bg-blue-50 text-blue-400' : 'bg-[#F4F6F9] text-gray-400'}`}>
                                                #{idx + 1}
                                            </div>
                                            <span className="font-semibold text-gray-700">Dép. {item.code}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-[#7165E3]">
                                                {Number(item.value).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                                            </span>
                                            <span className="text-xs text-gray-400">logements sociaux</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Aucune donnée disponible.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}