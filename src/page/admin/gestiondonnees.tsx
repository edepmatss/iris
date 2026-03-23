import { useState, useEffect } from 'react';
import { MoreVertical, FileText, BarChart2, Loader2, Trash2 } from 'lucide-react';

interface Donnee {
    id?: string | number;
    name: string;
    type: string;
    source: string;
    date: string;
    size?: string;
    status: string;
    widgetType?: string;
}

export default function GestionDonnees() {
    const [donnees, setDonnees] = useState<Donnee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDonnees = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('https://iris-db.alwaysdata.net/');
            if (!response.ok) {
                throw new Error(`Erreur réseau: ${response.status}`);
            }
            const data = await response.json();

            const dataArray = Array.isArray(data) ? data : (data.data || []);

            const sortedData = dataArray.sort((a: any, b: any) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

            setDonnees(sortedData);
        } catch (err: any) {
            console.error("Erreur de fetch:", err);
            setError("Impossible de charger les données depuis la base de données.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDonnees();

        window.addEventListener('donnees_mises_a_jour', fetchDonnees);

        return () => {
            window.removeEventListener('donnees_mises_a_jour', fetchDonnees);
        };
    }, []);

    const handleDelete = async (id: string | number | undefined) => {
        if (!id) return;
        if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return;

        try {
            setDonnees(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Erreur lors de la suppression", err);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Gestion des Données</h2>
                <button className="bg-[#7165E3] hover:bg-[#5b51c4] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    + Ajouter une source
                </button>
            </div>

            {/* Tableau */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Source de données</th>
                                <th className="px-6 py-4">Date de Création</th>
                                <th className="px-6 py-4">Taille</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">

                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#7165E3]" />
                                        <span className="font-medium">Chargement des données...</span>
                                    </td>
                                </tr>
                            ) :

                                error ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-red-500 font-medium">
                                            {error}
                                        </td>
                                    </tr>
                                ) :

                                    donnees.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-medium">
                                                Aucune donnée n'est encore enregistrée.
                                            </td>
                                        </tr>
                                    ) :

                                        (
                                            donnees.map((item, index) => (
                                                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                                                        <div className="p-2 bg-purple-100 text-[#7165E3] rounded-md shrink-0">
                                                            {/* On change l'icône selon si c'est un fichier ou un graphique */}
                                                            {item.type?.toLowerCase().includes('graph') ? <BarChart2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                        </div>
                                                        <span className="truncate max-w-[200px]" title={item.name}>{item.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                                                            {item.type || 'Inconnu'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 truncate max-w-[150px]" title={item.source}>
                                                        {item.source || '--'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.date ? new Date(item.date).toLocaleDateString('fr-FR') : '--'}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">{item.size || '--'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status?.toLowerCase() === 'actif' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                            }`}>
                                                            {item.status || 'Actif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors" title="Options">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}