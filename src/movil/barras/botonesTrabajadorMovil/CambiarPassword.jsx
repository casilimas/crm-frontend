import React, { useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { FaKey } from "react-icons/fa";

const CambiarPasswordTrabajador = ({ activeForm, onToggle }) => {
  const { token, user } = useAuth();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const isActive = activeForm === "cambiarPassword";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id || !token) {
      setMessage("⚠️ No se pudo obtener tu información de usuario");
      return;
    }

    try {
      await api.put(
        `/users/password/${user.id}`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Contraseña actualizada correctamente");
      setPassword("");
      onToggle(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Error al cambiar la contraseña");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="mb-6 relative z-50">
      {/* 🔘 Botón para abrir el formulario */}
      <button
        onClick={() => onToggle(isActive ? null : "cambiarPassword")}
        title="Cambiar contraseña"
        className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <FaKey size={22} />
        <span className="text-[10px] mt-1">Contraseña</span>
      </button>

      {/* ⚠️ Mensaje flotante */}
      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-[9999]">
          {message}
        </div>
      )}

      {/* 📄 Formulario modal con cierre al hacer clic fuera */}
      {isActive && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9998]"
          onClick={() => onToggle(null)} // cerrar al hacer clic en el fondo
        >
          <div
            className="bg-white text-black rounded shadow-md w-[300px] p-4"
            onClick={(e) => e.stopPropagation()} // evitar cierre si se hace clic dentro del modal
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-sm font-semibold text-center">Cambiar contraseña</p>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Cambiar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CambiarPasswordTrabajador;
