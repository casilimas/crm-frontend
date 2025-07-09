import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoutScreen = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      logout();           // 🔐 Limpia token y usuario
      navigate("/");      // 🔁 Redirige al login
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <img
        src="/imagencrm.png" // 📂 Imagen dentro de /public/imagecrm.png
        alt="Saliendo..."
        className="w-64 h-auto animate-pulse"
      />
    </div>
  );
};

export default LogoutScreen;
