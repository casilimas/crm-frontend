import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { FaUserTimes } from "react-icons/fa";

const BorrarUsuario = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const isActive = activeForm === "borrarUsuario";

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
    if (!selectedUser) return;

    const [name, email, department] = selectedUser.split("|");

    try {
      await api.delete("/users/by-data", {
        headers: { Authorization: `Bearer ${token}` },
        data: { name, email, department },
      });

      onToggle(null); // ✅ Ocultar formulario tras enviar
      setMessage("✅ Usuario eliminado correctamente");
      setSelectedUser("");

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error al eliminar el usuario"
      );
      setTimeout(() => setMessage(""), 3000);
    }
  };



  return (
    <div className="mb-6 relative">
      <button
        onClick={() => onToggle(isActive ? null : "borrarUsuario")}
        title="Eliminar usuario"
          className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <div className="relative">
          <FaUserTimes size={22} className="transition-transform group-hover:scale-110" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Eliminar usuario
          </div>
        </div>
        <span className="text-[10px] mt-1">Usuario</span>
      </button>

      {message && (
        <div className="absolute top-[120%] left-0 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {isActive && (
        <div className="absolute top-[150%] left-0 z-50 bg-white p-4 text-black rounded shadow-md w-[300px]">
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
                  {lista.map(
                    (u) =>
                      u.role !== "admin" && (
                        <option
                          key={u._id}
                          value={`${u.name}|${u.email}|${departamento}`}
                        >
                          {u.name} - {u.email}
                        </option>
                      )
                  )}
                </optgroup>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BorrarUsuario;
