import { useState } from "react";
import useFetchData from "../../utils/useFetchData";

const fixText = (text: string) => {
    if (!text) return "";
    let fixed = text;
    fixed = fixed.replace(/s['’]y\s+[\?\uFFFD]l[\?\uFFFD]ve\s+[\?\uFFFD]/gi, "s'y élève à");
    fixed = fixed.replace(/derni[\?\uFFFD]res/gi, "dernières");
    fixed = fixed.replace(/ch[\?\uFFFD]mage/gi, "chômage");
    fixed = fixed.replace(/Rh[\?\uFFFD]ne/gi, "Rhône");
    fixed = fixed.replace(/Ard[\?\uFFFD]che/gi, "Ardèche");
    fixed = fixed.replace(/Is[\?\uFFFD]re/gi, "Isère");
    fixed = fixed.replace(/[\uFFFD\?]/g, "é");
    return fixed;
};

export default function Departements() {
    const [selectedDep, setSelectedDep] = useState<string | null>(null);
    const endpoint = selectedDep ? `departements/${selectedDep}` : 'departements';
    const { data, loading } = useFetchData(endpoint);
    const [searchTerm, setSearchTerm] = useState("");

    if (loading) return <div className="p-6 text-gray-500">Chargement...</div>;

    if (selectedDep && data?.stats) {
        const s = data.stats;
        return (
            <div className="p-6">
                <button 
                    onClick={() => setSelectedDep(null)}
                    className="mb-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition font-medium"
                >
                    &larr; Retour à la liste
                </button>
                
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    {fixText(s.nom)} ({s.code})
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
                        <p className="text-sm text-gray-500 font-medium">Population</p>
                        <p className="text-2xl font-bold">{Number(s.population).toLocaleString('fr-FR')} hab.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                        <p className="text-sm text-gray-500 font-medium">Chômage</p>
                        <p className="text-2xl font-bold">{s.chomage} %</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <p className="text-sm text-gray-500 font-medium">Logements Sociaux</p>
                        <p className="text-2xl font-bold">{s.taux_sociaux} %</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                        <p className="text-sm text-gray-500 font-medium">Densité</p>
                        <p className="text-2xl font-bold">{s.densite} hab/km²</p>
                    </div>
                </div>
            </div>
        );
    }

    const filteredDeps = data?.departements?.filter((dep: any) => 
        dep.nom.toLowerCase().includes(searchTerm.toLowerCase()) || dep.code.includes(searchTerm)
    );

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Départements</h1>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Rechercher un département..." 
                        className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDeps?.map((dep: any) => (
                    <button 
                        key={dep.code} 
                        onClick={() => setSelectedDep(dep.code)}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all text-left group"
                    >
                        <p className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {fixText(dep.nom)}
                        </p>
                        <span className="text-xs font-black bg-gray-100 text-gray-500 px-2 py-1 rounded mt-2 inline-block">
                            {dep.code}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}