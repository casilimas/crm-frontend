import React, { useEffect, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica"; // ✅ Importación

const MigrarUsuario = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const { toggleRefrescar } = useActualizacion(); // ✅ Uso del contexto
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [message, setMessage] = useState("");

  const isActive = activeForm === "migrarUsuario";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const departamentosRes = await api.get("/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const listaUsuarios = Object.values(usersRes.data).flat();
        setUsuarios(listaUsuarios);
        setDepartamentos(departamentosRes.data);
      } catch (error) {
        console.error("❌ Error cargando datos:", error);
      }
    };

    if (isActive) fetchData();
  }, [isActive, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newDepartmentId) return;

    try {
      await api.put(
        `/users/move-department/${selectedUser}`,
        { newDepartmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toggleRefrescar(); // ✅ Refresca la CajaAzul u otros componentes

      onToggle(null); // ✅ Ocultar formulario inmediatamente

      setMessage("✅ Usuario migrado correctamente");
      setSelectedUser("");
      setNewDepartmentId("");

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Error al migrar el usuario";
      setMessage(`❌ ${msg}`);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="mb-6 relative">
      {/* 🧭 Botón con ícono y texto */}
      <button
        onClick={() => onToggle(isActive ? null : "migrarUsuario")}
        title="Migrar usuario"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <div className="relative">
          <FaExchangeAlt size={16} className="transition-transform group-hover:scale-110" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Migrar usuario
          </div>
        </div>
        <span className="text-[10px] mt-1">Usuario..</span>
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
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecciona un usuario</option>
              {usuarios.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>

            <select
              value={newDepartmentId}
              onChange={(e) => setNewDepartmentId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Seleccion nuevo departamento</option>
              {departamentos.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Migrar usuario
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MigrarUsuario;
