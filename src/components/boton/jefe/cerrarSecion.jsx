import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/salida"); // Redirige a pantalla con imagen
  };

  return (
    <div className="mb-6 relative">
      <button
        onClick={handleLogout}
        title="Cerrar sesión"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <div className="relative group">
          <LogOut size={16} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[10px] mt-1">Cerrar sesión</span>
      </button>
    </div>
  );
};

export default LogoutButton;
