export interface KpiCardProps {
	label: string;
	value?: string | number;
	color: string;
	trend?: "up" | "down";
}

export default function KpiCard({ label, value, color, trend }: KpiCardProps) {
	return (
		<div
			className={`bg-white border-t-4 ${color} rounded-xl p-4 shadow-sm transition-transform hover:scale-[1.02]`}
		>
			<p className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">
				{label}
			</p>
			<div className="flex items-center gap-2">
				<p className="text-xl font-black text-slate-900">
					{value || "0"}
				</p>
				{trend && (
					<span
						className={`text-[11px] ${trend === "up" ? "text-teal-400" : "text-rose-400"}`}
					>
						{trend === "up" ? "▲" : "▼"}
					</span>
				)}
			</div>
		</div>
	);
}
