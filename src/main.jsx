import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import ActualizacionProvider from "./actualizacion/actualizacionAutomatica";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ActualizacionProvider>
          <App /> 
        </ActualizacionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
