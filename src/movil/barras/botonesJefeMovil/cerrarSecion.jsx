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
          className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <div className="relative group">
          <LogOut size={22} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[10px] mt-1">Cerrar sesión</span>
      </button>
    </div>
  );
};

export default LogoutButton;
