import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// import "./main.css";
// import "./bootstrap.min.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <StrictMode> */}
    <App />
    {/* </StrictMode> */}
  </BrowserRouter>
);
