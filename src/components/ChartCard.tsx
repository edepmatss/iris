import React from "react";

export interface ChartCardProps {
	title: string;
	children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
	return (
		<div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
			<h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
				{title}
			</h3>
			<div className="h-[300px] w-full relative">{children}</div>
		</div>
	);
}
