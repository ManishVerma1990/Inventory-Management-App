import { useState } from "react";
import "./main.css";
import "./bootstrap.min.js";
import "./App.css";

import Header from "./layout/header";
import Sidebar from "./layout/sidebar";
import Body from "./layout/body";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="head-body-wrapper">
        <Header />
        <Body />
      </div>
    </div>
  );
}

export default App;
