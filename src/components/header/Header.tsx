import { BellDot, Search, UserRound } from "lucide-react";

function Header({ title }: { title: string }) {
	return (
		<header className="h-20 flex items-center justify-between px-12 bg-[#FFFFFF] sticky top-0 z-10">
			<h1 className="text-2xl font-bold">{title}</h1>
			<div className="flex items-center gap-4">
				<button className="relative cursor-pointer bg-[#8D8D8D] w-10 h-10 flex items-center justify-center rounded">
					<BellDot size={25} className="invert" />
					<div className="absolute top-2.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
				</button>
				<div className="flex items-center gap-2 cursor-pointer bg-[#8D8D8D] h-10 flex items-center justify-center rounded px-2">
					<Search size={25} className="invert" />
					<input
						type="text"
						placeholder="Search"
						className="outline-none text-white bg-transparent w-full h-full placeholder:text-white"
					/>
				</div>
				<button className="cursor-pointer bg-[#8D8D8D] w-10 h-10 flex items-center justify-center rounded">
					<UserRound size={25} className="invert" />
				</button>
			</div>
		</header>
	);
}

export default Header;
