import { Link } from "react-router-dom";
import { 
    BarChart3, 
    AlertTriangle, 
    Leaf, 
    Activity, 
    Map 
} from "lucide-react";

export default function Accueil() {
    const modules = [
        {
            id: 1,
            title: "État des Lieux et Évolution de l'Offre",
            description: "Découvrez où en est le parc social en 2023 et analysez sa progression, avec un focus sur les départements les mieux équipés et le rythme de construction au cours de la dernière décennie.",
            icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
            route: "/module1",
            color: "bg-blue-50 border-blue-200"
        },
        {
            id: 2,
            title: "Logement Social et Précarité",
            description: "Les zones les plus précaires (pauvreté, chômage) sont-elles les mieux dotées ? Explorez la corrélation entre les besoins sociaux et l'offre en logements.",
            icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
            route: "/module2",
            color: "bg-red-50 border-red-200"
        },
        {
            id: 3,
            title: "Le Défi de la Rénovation Énergétique",
            description: "Un regard sur la qualité du parc. Analysez la part des logements énergivores (E, F, G) par rapport à l'âge du parc et l'effort de renouvellement.",
            icon: <Leaf className="w-8 h-8 text-green-500" />,
            route: "/module3",
            color: "bg-green-50 border-green-200"
        },
        {
            id: 4,
            title: "Dynamique et Mobilité",
            description: "Le parc social est-il fluide ? Suivez l'évolution du taux de vacance, le ratio de mise en location et le volume de ventes aux personnes physiques.",
            icon: <Activity className="w-8 h-8 text-purple-500" />,
            route: "/module4",
            color: "bg-purple-50 border-purple-200"
        },
        {
            id: 5,
            title: "Analyse Territoriale et Démographique",
            description: "Préparez l'avenir : comparez la répartition jeunes/seniors, examinez l'attractivité territoriale et identifiez la typologie du parc (individuel vs collectif).",
            icon: <Map className="w-8 h-8 text-orange-500" />,
            route: "/module5",
            color: "bg-orange-50 border-orange-200"
        }
    ];

    return (
        <div className="min-h-full p-8 bg-gray-50 text-gray-800 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Exploration du Parc Social Français
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Ce site vous invite à explorer les données clés pour comprendre comment le parc social français s’adapte aux <strong>crises économiques</strong>, au <strong>vieillissement de la population</strong> et à <strong>l’urgence écologique</strong>. À travers 5 modules interactifs, plongez au cœur des enjeux du logement de demain.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((mod) => (
                        <Link 
                            to={mod.route} 
                            key={mod.id}
                            className={`flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${mod.color}`}
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    {mod.icon}
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 leading-tight">
                                    Module {mod.id} <br/> 
                                    <span className="text-base font-semibold text-gray-600">{mod.title}</span>
                                </h2>
                            </div>
                            <p className="text-gray-600 flex-1">
                                {mod.description}
                            </p>
                            <div className="mt-6 font-semibold text-sm text-gray-700 flex items-center">
                                Explorer ce module
                                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
