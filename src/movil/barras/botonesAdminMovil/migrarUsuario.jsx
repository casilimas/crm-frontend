import React, { useEffect, useState, useRef } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica";

const MigrarUsuario = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const { toggleRefrescar } = useActualizacion();
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef(null);

  const isActive = activeForm === "migrarUsuario";

  // 🔒 Cierre automático si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onToggle(null); // Oculta el formulario
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

      toggleRefrescar();
      onToggle(null);

      setMessage("✅ Usuario migrado correctamente");
      setSelectedUser("");
      setNewDepartmentId("");

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al migrar el usuario";
      setMessage(`❌ ${msg}`);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="mb-6 relative">
      <button
        onClick={() => onToggle(isActive ? null : "migrarUsuario")}
        title="Migrar usuario"
        className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <div className="relative">
          <FaExchangeAlt size={22} className="transition-transform group-hover:scale-110" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Migrar usuario
          </div>
        </div>
        <span className="text-[10px] mt-1">Usuario..</span>
      </button>

      {message && (
        <div className="fixed top-5 right-5 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {isActive && (
        <div
          ref={formRef}
          className="fixed top-20 right-5 z-50 bg-white p-4 text-black rounded shadow-lg w-[300px]"
        >
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
