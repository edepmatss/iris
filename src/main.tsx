import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<SearchProvider>
				<App />
			</SearchProvider>
		</BrowserRouter>
	</StrictMode>,
);
