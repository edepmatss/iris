import { Link } from "react-router-dom";

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
    return (
        <div className="flex flex-col h-full bg-[#F4F6F9] p-10 animate-fade-in">

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue sur l'Espace d'Apprentissage</h1>
                <p className="text-gray-500">Sélectionnez un module ci-dessous pour commencer votre exploration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MODULE_CARDS.map((card) => (
                    <Link
                        key={card.id}
                        to={card.link}
                        className="group bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
                    >
                        <div className="bg-[#F4F6F9] text-[#7165E3] p-4 rounded-lg mb-6 group-hover:bg-[#7165E3] group-hover:text-white transition-colors duration-300">
                            {card.icon}
                        </div>

                        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#7165E3] transition-colors duration-300">
                            {card.title}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {card.description}
                        </p>

                        <div className="mt-auto pt-6 flex items-center text-[#7165E3] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span>Accéder</span>
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}