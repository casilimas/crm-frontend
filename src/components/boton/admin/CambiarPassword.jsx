import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { FaKey } from "react-icons/fa";

const CambiarPassword = ({ activeForm, onToggle }) => {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !password) return;

    try {
      await api.put(
        `/users/password/${selectedUser}`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Contraseña actualizada correctamente");
      setPassword("");
      setSelectedUser("");

      setTimeout(() => {
        setMessage("");
        onToggle(null); // cerrar el formulario
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al actualizar contraseña");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="mb-6 relative z-50">
      {/* 🔘 Botón */}
      <button
        onClick={() => onToggle(isActive ? null : "cambiarPassword")}
        title="Cambiar contraseña"
        className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <FaKey size={16} />
        <span className="text-[10px] mt-1">Contraseña</span>
      </button>

      {/* ⚠️ Mensaje */}
      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-[9999]">
          {message}
        </div>
      )}

      {/* 📄 Formulario modal */}
      {isActive && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9998]"
          onClick={() => onToggle(null)} // cerrar al hacer clic fuera
        >
          <div
            className="bg-white text-black rounded shadow-md w-[300px] p-4"
            onClick={(e) => e.stopPropagation()} // evita cierre si haces clic dentro
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-sm font-semibold text-center mb-2">Cambiar contraseña</p>

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
        </div>
      )}
    </div>
  );
};

export default CambiarPassword;
