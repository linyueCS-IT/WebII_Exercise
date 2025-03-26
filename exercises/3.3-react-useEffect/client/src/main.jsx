import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/* 1. createRoot
 * createRoot is a new React 18 API for creating a root for rendering React components.
 * document.getElementById('root') gets the HTML element with the ID root (usually in index.html).
 * createRoot(...) creates a React root, which is required for concurrent rendering features in React 18
 * 2. .render(...)
 * Calls the .render() method on the root to render React elements into the DOM
 * 3. <StrictMode>...</StrictMode>
 * This is a React wrapper that enables additional runtime checks in development mode.
 * It helps identify potential issues, such as deprecated APIs
 * 4. <App />
 * The main component of the React application.
 * This is where your React app starts.
 */
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>
);
