import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const CrearDepartamento = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const isActive = activeForm === "crearDepartamento";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/departments/create",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onToggle(null); // ✅ Ocultar el formulario al crear
      setMessage("✅ Departamento creado exitosamente");
      setName("");

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el departamento";
      setMessage(`❌ ${msg}`);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="mb-6 relative">
      {/* 🧭 Botón con ícono y texto */}
      <button
        onClick={() => onToggle(isActive ? null : "crearDepartamento")}
        title="Crear departamento"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <div className="relative">
          <FaPlus size={16} className="transition-transform group-hover:scale-110" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Crear departamento
          </div>
        </div>
        <span className="text-[10px] mt-1">Nuevo...</span>
      </button>

      {/* 📩 Mensaje */}
      {message && (
        <div className="absolute top-[120%] left-0 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {/* 📝 Formulario */}
      {isActive && (
        <div className="absolute top-[150%] left-0 z-50 bg-white p-4 text-black rounded shadow-md w-[300px]">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Nombre del departamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Crear
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CrearDepartamento;
