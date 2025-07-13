import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const CrearDepartamento = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef(null);

  const isActive = activeForm === "crearDepartamento";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/departments/create",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onToggle(null);
      setMessage("✅ Departamento creado exitosamente");
      setName("");

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el departamento";
      setMessage(`❌ ${msg}`);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // 🔒 Cierre al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onToggle(null);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, onToggle]);

  return (
    <div className="mb-6 relative">
      {/* 🧭 Botón */}
      <button
        onClick={() => onToggle(isActive ? null : "crearDepartamento")}
        title="Crear departamento"
        className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <div className="relative">
          <FaPlus size={22} className="transition-transform group-hover:scale-110" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Crear departamento
          </div>
        </div>
        <span className="text-[10px] mt-1">Nuevo...</span>
      </button>

      {/* 📩 Mensaje flotante */}
      {message && (
        <div className="fixed top-5 right-5 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {/* 📬 Formulario flotante centrado */}
      {isActive && (
        <div
          ref={formRef}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 text-black rounded shadow-lg w-[300px] z-50"
        >
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
