import { useState, useEffect } from 'react';
import { ScatterChart, BubblesIcon, PieChart, LineChart, BarChart, BarChart2, Loader2 } from 'lucide-react'

const WIDGET_TYPES = [
    { id: 'scatter', name: 'Nuage de points', icon: <ScatterChart /> },
    { id: 'bubble', name: 'Bulles', icon: <BubblesIcon /> },
    { id: 'pie', name: 'Camembert', icon: <PieChart /> },
    { id: 'line', name: 'Lignes', icon: <LineChart /> },
    { id: 'hbar', name: 'Barres Horizontales', icon: <BarChart /> },
    { id: 'vbar', name: 'Barres Verticales', icon: <BarChart2 /> },
];

export default function ConfGraphs() {
    const [formData, setFormData] = useState({
        widgetType: 'vbar',
        dataSource: '',
        graphType: 'Barres Verticales',
        year: 'Année 2023',
        xAxis: '',
        yAxis: '',
        filters: ''
    });

    const [columns, setColumns] = useState<string[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    // Nouvel état pour gérer le chargement lors de la création en BDD
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!formData.dataSource) {
            setColumns([]);
            return;
        }

        setIsLoadingData(true);

        fetch(formData.dataSource)
            .then(async (response) => {
                if (!response.ok) throw new Error("Erreur réseau API");
                const contentType = response.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        return Object.keys(data[0]);
                    } else if (data && typeof data === 'object' && Array.isArray(data.data) && data.data.length > 0) {
                        return Object.keys(data.data[0]);
                    }
                    throw new Error("Structure JSON non reconnue");
                }
                else {
                    const text = await response.text();
                    const firstLine = text.split('\n')[0];
                    let headers = firstLine.split(';').map(h => h.replace(/['"\r]/g, '').trim());
                    if (headers.length <= 1) {
                        headers = firstLine.split(',').map(h => h.replace(/['"\r]/g, '').trim());
                    }
                    if (headers.length > 0 && headers[0] !== "") {
                        return headers;
                    }
                    throw new Error("Impossible de lire les entêtes du fichier");
                }
            })
            .then((fetchedColumns) => {
                setColumns(fetchedColumns);
                setFormData(prev => ({
                    ...prev,
                    xAxis: prev.xAxis || fetchedColumns[3] || fetchedColumns[0],
                    yAxis: prev.yAxis || fetchedColumns[5] || fetchedColumns[1]
                }));
            })
            .catch(error => {
                console.warn("L'API a échoué. Chargement du Fallback.", error);
                const fallbackColumns = [
                    "Code région", "Nom de la région", "Code département",
                    "Nom du département", "Nombre de logements",
                    "Parc locatif social", "Résidences principales", "Logements vacants"
                ];
                setColumns(fallbackColumns);
                setFormData(prev => ({
                    ...prev,
                    xAxis: prev.xAxis || "Nom du département",
                    yAxis: prev.yAxis || "Parc locatif social"
                }));
            })
            .finally(() => {
                setIsLoadingData(false);
            });

    }, [formData.dataSource]);

    // --- LOGIQUE D'ENVOI VERS LA BASE DE DONNÉES (API) ---
    const handleCreate = async () => {
        if (!formData.dataSource || !formData.xAxis || !formData.yAxis) {
            alert("Veuillez remplir au moins la source et les axes X/Y.");
            return;
        }

        const cleanSourceName = formData.dataSource.split('/').pop()?.replace('.csv', '') || formData.dataSource;
        const graphName = `${formData.graphType} : ${formData.yAxis} par ${formData.xAxis}`;

        // On formate l'objet pour ton API
        const newGraph = {
            name: graphName,
            type: 'Graphique',
            source: cleanSourceName,
            date: new Date().toISOString(), // Format ISO standard pour les BDD
            status: 'Actif',
            widgetType: formData.widgetType,
            xAxis: formData.xAxis,
            yAxis: formData.yAxis,
            year: formData.year,
            filters: formData.filters
        };

        setIsCreating(true); // On lance le loader du bouton

        try {
            // Requête POST vers ton API
            const response = await fetch('https://iris-db.alwaysdata.net/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGraph)
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // On garde l'événement pour dire à `gestiondonnees.tsx` de refaire un "GET"
            window.dispatchEvent(new Event('donnees_mises_a_jour'));

            console.log("Graphique enregistré en BDD :", newGraph);
            alert(`Le graphique "${graphName}" a bien été enregistré dans la base de données !`);

        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
            alert("Une erreur est survenue lors de l'enregistrement du graphique en base de données.");
        } finally {
            setIsCreating(false);
        }
    };

    const renderChartShapes = () => {
        switch (formData.widgetType) {
            case 'vbar':
                return (
                    <div className="flex items-end justify-between h-full w-full pt-4">
                        <div className="w-[12%] h-[40%] bg-gradient-to-t from-[#8B5CF6] to-[#60A5FA] rounded-t-sm"></div>
                        <div className="w-[12%] h-[85%] bg-gradient-to-t from-[#8B5CF6] to-[#60A5FA] rounded-t-sm"></div>
                        <div className="w-[12%] h-[60%] bg-gradient-to-t from-[#8B5CF6] to-[#60A5FA] rounded-t-sm"></div>
                        <div className="w-[12%] h-[50%] bg-gradient-to-t from-[#8B5CF6] to-[#60A5FA] rounded-t-sm"></div>
                        <div className="w-[12%] h-[45%] bg-gradient-to-t from-[#8B5CF6] to-[#60A5FA] rounded-t-sm"></div>
                        <div className="w-[12%] h-[30%] bg-gradient-to-t from-[#8B5CF6] to-[#60A5FA] rounded-t-sm"></div>
                    </div>
                );
            case 'hbar':
                return (
                    <div className="flex flex-col justify-between h-full w-full py-2">
                        <div className="h-[15%] w-[80%] bg-gradient-to-r from-[#8B5CF6] to-[#60A5FA] rounded-r-sm"></div>
                        <div className="h-[15%] w-[40%] bg-gradient-to-r from-[#8B5CF6] to-[#60A5FA] rounded-r-sm"></div>
                        <div className="h-[15%] w-[95%] bg-gradient-to-r from-[#8B5CF6] to-[#60A5FA] rounded-r-sm"></div>
                        <div className="h-[15%] w-[60%] bg-gradient-to-r from-[#8B5CF6] to-[#60A5FA] rounded-r-sm"></div>
                    </div>
                );
            case 'pie':
                return (
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="w-24 h-24 rounded-full animate-spin-slow"
                            style={{ background: 'conic-gradient(#8B5CF6 0% 35%, #60A5FA 35% 70%, #C4B5FD 70% 100%)' }}>
                        </div>
                    </div>
                );
            case 'line':
                return (
                    <div className="flex items-center justify-center h-full w-full relative">
                        <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-md">
                            <polyline points="0,40 20,30 40,45 60,15 80,25 100,5" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="0,50 30,35 50,40 70,25 100,20" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                        </svg>
                    </div>
                );
            case 'scatter':
                return (
                    <div className="flex items-center justify-center h-full w-full relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {[...Array(20)].map((_, i) => (
                                <circle key={i} cx={Math.random() * 90 + 5} cy={Math.random() * 90 + 5} r="3" fill="#8B5CF6" opacity={Math.random() * 0.5 + 0.5} />
                            ))}
                        </svg>
                    </div>
                );
            case 'bubble':
                return (
                    <div className="flex items-center justify-center h-full w-full relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {[...Array(10)].map((_, i) => (
                                <circle key={i} cx={Math.random() * 80 + 10} cy={Math.random() * 80 + 10} r={Math.random() * 10 + 3} fill={i % 2 === 0 ? "#8B5CF6" : "#60A5FA"} opacity="0.7" />
                            ))}
                        </svg>
                    </div>
                );
            default:
                return <div className="text-gray-400 m-auto">Aperçu indisponible</div>;
        }
    };

    const renderPreview = () => {
        return (
            <div className="relative w-full h-full flex flex-col p-2 pt-4">

                {formData.year && (
                    <div className="absolute top-0 right-2 text-[10px] font-semibold text-[#7165E3] bg-white border border-[#C4B5FD] px-2 py-0.5 rounded shadow-sm z-10">
                        {formData.year}
                    </div>
                )}

                <div className="flex-1 w-full flex flex-col min-h-0">
                    <div className="flex-1 flex min-h-0">
                        {formData.yAxis && (
                            <div className="w-8 flex items-center justify-center shrink-0">
                                <span className="-rotate-90 text-[10px] font-medium text-gray-500 whitespace-nowrap max-w-[120px] truncate block">
                                    {formData.yAxis}
                                </span>
                            </div>
                        )}
                        <div className="flex-1 border-l-2 border-b-2 border-gray-300 relative">
                            <div className="absolute inset-0 pb-1 pl-1">
                                {renderChartShapes()}
                            </div>
                        </div>
                    </div>
                    {formData.xAxis && (
                        <div className="h-6 flex items-center justify-center text-[10px] font-medium text-gray-500 whitespace-nowrap truncate w-full pl-8">
                            {formData.xAxis}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">

            <section>
                <h2 className="text-lg font-bold text-gray-700 mb-4">Widgets Disponibles</h2>
                <div className="flex flex-wrap gap-4">
                    {WIDGET_TYPES.map((widget) => {
                        const isEditing = formData.widgetType === widget.id;

                        return (
                            <div
                                key={widget.id}
                                onClick={() => setFormData({ ...formData, widgetType: widget.id, graphType: widget.name })}
                                className={`relative bg-white border rounded-lg p-4 w-32 h-24 flex flex-col items-center justify-center shadow-sm cursor-pointer transition-all ${isEditing ? 'border-[#7165E3] ring-2 ring-[#7165E3]/50' : 'border-gray-200 hover:border-[#7165E3]/50'
                                    }`}
                            >
                                <div className="text-gray-500 mb-1">{widget.icon}</div>
                                <span className="text-[10px] text-gray-500 text-center">{widget.name}</span>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">

                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <div className="bg-[#C4B5FD] text-[#4C1D95] p-1.5 rounded-md">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Configurer un Nouveau Graphique</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Type de Widget :</label>
                            <select
                                value={formData.widgetType}
                                onChange={(e) => {
                                    const selectedWidget = WIDGET_TYPES.find(w => w.id === e.target.value);
                                    setFormData({
                                        ...formData,
                                        widgetType: e.target.value,
                                        graphType: selectedWidget ? selectedWidget.name : ''
                                    });
                                }}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 bg-white"
                            >
                                {WIDGET_TYPES.map(widget => (
                                    <option key={widget.id} value={widget.id}>{widget.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Source de Données :</label>
                            <select
                                value={formData.dataSource}
                                onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 bg-white"
                            >
                                <option value="">-- Choisir une source --</option>
                                <option value="https://iris-db.alwaysdata.net/">API Iris (https://iris-db.alwaysdata.net/)</option>
                                <option value="logements-et-logements-sociaux-dans-les-departements.csv">CSV : logements-et-logements-sociaux-dans-les-departements</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Type de Graphiques :</label>
                            <input
                                type="text"
                                value={formData.graphType}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 placeholder-gray-400 bg-gray-50"
                                readOnly
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Choix Année</label>
                            <input
                                type="text"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 placeholder-gray-400"
                                placeholder="Ex: 2023"
                            />
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                Axes & Métriques:
                                {isLoadingData && <Loader2 className="w-4 h-4 text-[#7165E3] animate-spin" />}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {columns.length > 0 ? (
                                    <select
                                        value={formData.xAxis}
                                        onChange={(e) => setFormData({ ...formData, xAxis: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 bg-white"
                                    >
                                        <option value="">-- Sélectionner Axe X --</option>
                                        {columns.map(col => (
                                            <option key={col} value={col}>{col}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={formData.xAxis}
                                        onChange={(e) => setFormData({ ...formData, xAxis: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 placeholder-gray-400 disabled:bg-gray-50"
                                        placeholder="Axe X (ex: Categorie, Année)"
                                        disabled={isLoadingData}
                                    />
                                )}

                                {columns.length > 0 ? (
                                    <select
                                        value={formData.yAxis}
                                        onChange={(e) => setFormData({ ...formData, yAxis: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 bg-white"
                                    >
                                        <option value="">-- Sélectionner Axe Y --</option>
                                        {columns.map(col => (
                                            <option key={col} value={col}>{col}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={formData.yAxis}
                                        onChange={(e) => setFormData({ ...formData, yAxis: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 placeholder-gray-400 disabled:bg-gray-50"
                                        placeholder="Axe Y (ex: Valeur, Taux)"
                                        disabled={isLoadingData}
                                    />
                                )}

                            </div>
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1.5 mt-2">
                            <label className="text-sm font-semibold text-gray-700">Filtres:</label>
                            <input
                                type="text"
                                value={formData.filters}
                                onChange={(e) => setFormData({ ...formData, filters: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent text-sm text-gray-600 placeholder-gray-400"
                                placeholder="Ajouter des filtres spécifiques..."
                            />
                        </div>

                    </div>

                    <div className="lg:col-span-1 flex flex-col justify-between">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Prévisualisation:</label>
                            <div className="border border-gray-200 rounded-lg p-4 flex h-48 bg-gray-50/50 overflow-hidden shadow-inner">
                                {renderPreview()}
                            </div>
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={isCreating}
                            className={`w-full mt-6 text-white font-bold py-3 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 
                                ${isCreating ? 'bg-[#5b51c4] cursor-not-allowed' : 'bg-[#7165E3] hover:bg-[#5b51c4]'}`}
                        >
                            {isCreating && <Loader2 className="w-5 h-5 animate-spin" />}
                            {isCreating ? 'Création en cours...' : 'Créer le Graphique'}
                        </button>
                    </div>

                </div>
            </section>
        </div>
    );
}