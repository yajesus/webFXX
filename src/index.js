import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundaryWrapper from "./components/ErrorBoundaryWrapper";
import "./i18n";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundaryWrapper>
        <App />
      </ErrorBoundaryWrapper>
    </BrowserRouter>
    ,
  </React.StrictMode>
);
