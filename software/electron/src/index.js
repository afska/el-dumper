// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/css/bootstrap-theme.css";
import "./components/theme/bootswatch/theme.css";
import "./components/theme/bootswatch/custom.css";
import "./components/theme/bootswatch/global.css";
import "font-awesome/css/font-awesome.css";
import React from "react";
import App from "./components/App";
import { render } from "react-dom";
import "./utils/string";

// Disable secondary clicks
if (window.DESKTOP_IS_PRODUCTION) {
	const prevent = (e) => e.preventDefault();

	window.addEventListener("contextmenu", prevent);
	window.addEventListener("auxclick", prevent);
}

// Render the application
render(<App />, document.getElementById("root"));
