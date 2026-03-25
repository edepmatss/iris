import React from "react";

export interface ChartCardProps {
	title: string;
	children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
	return (
		<div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
			<h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-6 border-b border-slate-700/50 pb-2">
				{title}
			</h3>
			<div className="h-[300px] w-full relative">{children}</div>
		</div>
	);
}
