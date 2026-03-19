import { useState } from 'react';
import logo from '../assets/Logo1.svg';
import logoIcon from '../assets/logoIcon.svg';
import diagram from '../assets/diagram.svg';
import { Link } from 'react-router-dom';

const NAV_ITEMS_ADMIN = [
	{
		id: 'dashboard',
		label: 'Dashboard Public',
		icon: (
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 12l4.5-4.5" />
				<circle cx="12" cy="12" r="2" fill="currentColor" />
			</svg>
		),
	},
	{
		id: 'data',
		label: 'Gestion des Données',
		icon: (
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
				<ellipse cx="12" cy="6" rx="8" ry="3" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
			</svg>
		),
	},
	{
		id: 'charts',
		label: 'Configuration des\nGraphiques',
		icon: (
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
				<path strokeLinecap="round" strokeLinejoin="round" d="M4 6v13a1 1 0 001 1h14M8 14l3-3 4 4 5-5" />
			</svg>
		),
	},
	{
		id: 'security',
		label: 'Sécurité',
		icon: (
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			</svg>
		),
	},
];

const NAV_ITEMS_USER = [
	{
		id: 'module1',
		label: 'Module 1',
		icon: (
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
				<path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
			</svg>
		),
	},
	{
		id: 'module2',
		label: 'Module 2',
		icon: (
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
				<path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
			</svg>
		),
	},
	{
		id: 'module3',
		label: 'Module 3',
		icon: (
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
				<path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
			</svg>
		),
	},
	{
		id: 'module4',
		label: 'Module 4',
		icon: (
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
				<path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
			</svg>
		),
	}
];

export default function Navbar() {
	const isAdmin = localStorage.getItem("isAdmin") === "true";
	const currentNavItems = isAdmin ? NAV_ITEMS_ADMIN : NAV_ITEMS_USER;
	const [activeItem, setActiveItem] = useState(isAdmin ? 'dashboard' : ''); // '' pour rediriger vers la page d'accueil dans le cas ou on est pas admin
	const [isOpen, setIsOpen] = useState(true);

	const handleLogout = () => {
		localStorage.removeItem("isAdmin");
	};

	return (
		<aside
			className={`relative h-screen bg-[#3E3E3E] flex flex-col shadow-xl select-none transition-all duration-300 z-40 ${isOpen ? 'w-[280px]' : 'w-[100px]'
				}`}
		>
			<div className="flex flex-col h-full overflow-hidden">

				<div className={`pt-16 pb-10 flex z-10 shrink-0 transition-all duration-300 ${isOpen ? 'px-12 justify-start' : 'px-0 justify-center'}`}>
					<Link to="/" onClick={() => setActiveItem("/")}>
						<img
							src={isOpen ? logo : logoIcon}
							alt="Iris Logo"
							className={`transition-all duration-300 ${isOpen ? 'w-32' : 'w-10'} h-auto`}
						/>
					</Link>
				</div>

				<nav className="flex flex-col w-full z-10">
					{currentNavItems.map((item, index) => {
						const isActive = activeItem === item.id;
						return (
							<Link
								key={item.id}
								onClick={() => setActiveItem(item.id)}
								to={item.id}
								className={`flex items-center w-full py-4 transition-all duration-300 ${isOpen ? 'px-8 gap-4' : 'justify-center px-0'
									} ${isActive
										? isAdmin ? 'bg-[#525252] text-white' : 'text-white'
										: `text-[#9ca3af] hover:text-gray-200 ${isAdmin ? 'hover:bg-[#4a4a4a]' : 'hover:translate-x-2'}`
									}`}
							>
								<div className={`shrink-0 transition-transform duration-300 ${isActive ? 'text-white' : 'text-[#9ca3af]'}`}>
									{item.icon}
								</div>

								{isOpen && (
									<span
										className={`${isAdmin ? 'text-[15px] leading-tight whitespace-pre-line' : 'text-[20px]'} ${isActive ? (isAdmin ? 'font-medium' : 'text-[28px] font-bold tracking-wide') : 'font-normal'
											}`}
									>
										{isAdmin ? item.label : item.label}
									</span>
								)}

								{!isOpen && !isAdmin && (
									<span className={`text-[20px] ${isActive ? 'font-bold text-white' : 'font-normal text-[#9ca3af]'}`}>
										{index + 1}
									</span>
								)}
							</Link>
						)
					})}
				</nav>

				{isAdmin && (
					<div className={`mt-auto mb-10 z-10 w-full flex flex-col ${isOpen ? 'px-8' : 'px-0 items-center'}`}>
						<Link
							to="/"
							onClick={handleLogout}
							className={`flex items-center py-3 w-full transition-colors duration-300 text-red-400 hover:text-red-300 hover:bg-[#4a4a4a] rounded-md ${isOpen ? 'gap-4 px-4' : 'justify-center px-0'
								}`}
						>
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 shrink-0">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
							</svg>
							{isOpen && <span className="text-[15px] font-medium">Déconnexion</span>}
						</Link>
					</div>
				)}

				<div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none flex justify-center">
					<img
						src={diagram}
						alt="Background diagram"
						className="w-full h-auto object-cover opacity-50"
					/>
				</div>
			</div>

			<button
				onClick={() => setIsOpen(!isOpen)}
				className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-50 cursor-pointer group"
				aria-label="Toggle Sidebar"
			>
				<svg
					className={`transition-transform duration-300 ${isOpen ? 'rotate-0 group-hover:rotate-180' : 'rotate-180 group-hover:rotate-0'
						}`}
					width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
				>
					<path d="M9 18l6-6-6-6" />
				</svg>
			</button>

		</aside>
	);
}