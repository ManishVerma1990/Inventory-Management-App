import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HashRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <Router>
    {/* <StrictMode> */}
    <App />
    {/* </StrictMode> */}
  </Router>
);
