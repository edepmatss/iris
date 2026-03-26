/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}", // C'est ici qu'on dit à Tailwind de scanner tes composants React !
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
