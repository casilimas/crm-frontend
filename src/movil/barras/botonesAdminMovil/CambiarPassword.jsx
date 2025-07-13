import React, { useEffect, useState, useRef } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { FaKey } from "react-icons/fa";

const CambiarPassword = ({ activeForm, onToggle }) => {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef(null);

  const isActive = activeForm === "cambiarPassword";

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data);
      } catch (err) {
        console.error("❌ Error al listar usuarios:", err);
      }
    };
    if (isActive) fetchUsuarios();
  }, [isActive, token]);

  // 🔒 Cerrar al hacer clic fuera
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !password) return;

    try {
      await api.put(
        `/users/password/${selectedUser}`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onToggle(null);
      setMessage("✅ Contraseña actualizada correctamente");

      setTimeout(() => {
        setMessage("");
        setSelectedUser("");
        setPassword("");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al actualizar contraseña");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="mb-6 relative">
      {/* 🔘 Botón */}
      <button
        onClick={() => onToggle(isActive ? null : "cambiarPassword")}
        title="Cambiar contraseña"
        className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <div className="relative">
          <FaKey size={22} className="transition-transform group-hover:scale-110" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Cambiar contraseña
          </div>
        </div>
        <span className="text-[10px] mt-1">Contraseña</span>
      </button>

      {/* 📩 Mensaje */}
      {message && (
        <div className="fixed top-5 right-5 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {/* 📬 Formulario centrado */}
      {isActive && (
        <div
          ref={formRef}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-4 text-black rounded shadow-md w-[300px]"
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecciona un usuario</option>
              {Object.entries(usuarios).map(([departamento, lista]) => (
                <optgroup key={departamento} label={departamento}>
                  {lista.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} {u._id === user._id && "(tú)"}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

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
      )}
    </div>
  );
};

export default CambiarPassword;
