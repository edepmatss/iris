import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
	title: string;
	onBack: () => void;
}

export default function PageHeader({ title, onBack }: PageHeaderProps) {
	return (
		<div className="mb-7 animate-fade-in">
			<div className="flex items-center gap-2.5 mb-1">
				<button
					onClick={onBack}
					className="text-[12px] text-stone-500 hover:text-cyan-700 transition-colors flex items-center gap-1 py-1 px-2 -ml-2 rounded-md hover:bg-stone-100"
				>
					<ChevronLeft size={14} />
					Accueil
				</button>
				<span className="text-stone-300 text-[12px]">/</span>
				<span className="text-[12px] text-cyan-700 font-semibold tracking-wide">
					{title}
				</span>
			</div>
			<h1 className="font-['Syne',sans-serif] font-extrabold text-[28px] text-slate-800 tracking-tight leading-tight">
				{title}
			</h1>
		</div>
	);
}
