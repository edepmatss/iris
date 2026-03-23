import { useState } from "react";
import useFetchData from "../../utils/useFetchData"; 
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Nettoie les caractères brisés (losanges ou ?) issus de la base de données.
 * L'ordre des remplacements est crucial pour la grammaire.
 */
const fixText = (text: string) => {
    if (!text) return "";
    let fixed = text;

    // 1. Phrases complexes et grammaire spécifique (Priorité 1)
    fixed = fixed.replace(/s['’]y\s+[\?\uFFFD]l[\?\uFFFD]ve\s+[\?\uFFFD]/gi, "s'y élève à");
    fixed = fixed.replace(/derni[\?\uFFFD]res/gi, "dernières");
    fixed = fixed.replace(/ch[\?\uFFFD]mage/gi, "chômage");
    fixed = fixed.replace(/[\?\uFFFD]l[\?\uFFFD]ve/gi, "élève");

    // 2. Régions
    fixed = fixed.replace(/PROVENCE-ALPES-C[\?\uFFFD]TE D'AZUR/gi, "Provence-Alpes-Côte d'Azur");
    fixed = fixed.replace(/AUVERGNE-RH[\?\uFFFD]NE-ALPES/gi, "Auvergne-Rhône-Alpes");
    fixed = fixed.replace(/BOURGOGNE-FRANCHE-COMT[\?\uFFFD]/gi, "Bourgogne-Franche-Comté");
    fixed = fixed.replace(/[\?\uFFFD]LE-DE-FRANCE/gi, "Île-de-France");
    fixed = fixed.replace(/LA R[\?\uFFFD]UNION/gi, "La Réunion");

    // 3. Départements
    fixed = fixed.replace(/Rh[\?\uFFFD]ne/gi, "Rhône");
    fixed = fixed.replace(/Ard[\?\uFFFD]che/gi, "Ardèche");
    fixed = fixed.replace(/Dr[\?\uFFFD]me/gi, "Drôme");
    fixed = fixed.replace(/Is[\?\uFFFD]re/gi, "Isère");
    fixed = fixed.replace(/D[\?\uFFFD]me/gi, "Dôme");
    fixed = fixed.replace(/Sa[\?\uFFFD]ne/gi, "Saône");
    fixed = fixed.replace(/Corr[\?\uFFFD]ze/gi, "Corrèze");
    fixed = fixed.replace(/Ni[\?\uFFFD]vre/gi, "Nièvre");
    fixed = fixed.replace(/Ari[\?\uFFFD]ge/gi, "Ariège");
    fixed = fixed.replace(/Loz[\?\uFFFD]re/gi, "Lozère");
    fixed = fixed.replace(/Finist[\?\uFFFD]re/gi, "Finistère");
    fixed = fixed.replace(/S[\?\uFFFD]vres/gi, "Sèvres");
    fixed = fixed.replace(/Pyr[\?\uFFFD]n[\?\uFFFD]es/gi, "Pyrénées");
    fixed = fixed.replace(/H[\?\uFFFD]rault/gi, "Hérault");

    // 4. Nettoyage final (Remplacement par 'é' pour le reste)
    fixed = fixed.replace(/[\uFFFD\?]/g, "é");

    return fixed;
};

export default function Regions() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const endpoint = selectedRegion ? `regions/${selectedRegion}` : 'regions';
    const { data, loading } = useFetchData(endpoint);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#D5D5D8] font-medium text-gray-600">
                <p>Chargement des données...</p>
            </div>
        );
    }

    // --- VUE 1 : Liste de toutes les régions ---
    if (!selectedRegion && data?.regions) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Sélectionnez une région</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.regions.map((region: any) => (
                        <button
                            key={region.code}
                            onClick={() => setSelectedRegion(region.code)}
                            className="bg-white p-4 rounded shadow-sm hover:shadow-md hover:border-indigo-500 border border-transparent transition-all text-left flex flex-col justify-between"
                        >
                            <p className="font-semibold text-gray-800">{fixText(region.nom)}</p>
                            <span className="text-xs text-gray-400 mt-2 bg-gray-100 px-2 py-1 rounded w-max">
                                Code : {region.code}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // --- VUE 2 : Détail de la région sélectionnée ---
    if (selectedRegion && data?.region) {

        // Nettoyage complet des graphiques (Labels ET Légendes)
        if (data.charts) {
            // Axes X (Noms des départements)
            if (data.charts.logementsSociauxByDep?.labels) {
                data.charts.logementsSociauxByDep.labels = data.charts.logementsSociauxByDep.labels.map((l: string) => fixText(l));
            }
            if (data.charts.chomageByDep?.labels) {
                data.charts.chomageByDep.labels = data.charts.chomageByDep.labels.map((l: string) => fixText(l));
            }
            // Légendes (Haut du graphique)
            if (data.charts.logementsSociauxByDep?.datasets?.[0]) {
                data.charts.logementsSociauxByDep.datasets[0].label = fixText(data.charts.logementsSociauxByDep.datasets[0].label);
            }
            if (data.charts.chomageByDep?.datasets?.[0]) {
                data.charts.chomageByDep.datasets[0].label = fixText(data.charts.chomageByDep.datasets[0].label);
            }
        }

        return (
            <div className="p-6">
                <button
                    onClick={() => setSelectedRegion(null)}
                    className="mb-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition font-medium"
                >
                    &larr; Retour aux régions
                </button>

                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Région {fixText(data.region.nom)}
                </h1>

                <div className="bg-indigo-50 p-5 rounded-lg mb-8 border border-indigo-100 text-indigo-900 leading-relaxed">
                    <p>{fixText(data.analytical_text)}</p>
                </div>

                {/* KPIs Nettoyés */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {data.kpis && Object.entries(data.kpis).map(([key, kpi]: [string, any]) => (
                        <div key={key} className="bg-white p-5 rounded shadow-sm border-l-4 border-indigo-500">
                            <p className="text-sm text-gray-500 mb-1 font-medium">
                                {fixText(kpi.label)}
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {kpi.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Graphiques */}
                {data.charts && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                            <h3 className="font-bold mb-4 text-center text-gray-700">Logements Sociaux</h3>
                            <Bar data={data.charts.logementsSociauxByDep} options={{ responsive: true }} />
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                            <h3 className="font-bold mb-4 text-center text-gray-700">Taux de Chômage (%)</h3>
                            <Bar data={data.charts.chomageByDep} options={{ responsive: true }} />
                        </div>
                    </div>
                )}

                {/* Tableau Nettoyé */}
                <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-sm">Département</th>
                                <th className="p-4 font-semibold text-sm">Population</th>
                                <th className="p-4 font-semibold text-sm">Chômage (%)</th>
                                <th className="p-4 font-semibold text-sm">Logements Sociaux (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.table.map((row: any) => (
                                <tr key={row.code_departement} className="hover:bg-gray-50 border-b last:border-0">
                                    <td className="p-4 text-sm font-medium text-gray-800">
                                        {fixText(row.nom_departement)} <span className="text-gray-400">({row.code_departement})</span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {row.population ? Number(row.population).toLocaleString('fr-FR') : 'N/A'}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{row.chomage ?? 'N/A'}</td>
                                    <td className="p-4 text-sm text-gray-600">{row.logements_sociaux ?? 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return <p className="p-6 text-red-500">Erreur lors de la récupération des données.</p>;
}