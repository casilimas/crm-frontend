// ✅ src/components/boton/jefe/CambiarRolTrabajador.jsx
import React, { useEffect, useState, useRef } from "react";
import { Shuffle } from "lucide-react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica";

const CambiarRolTrabajador = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const { toggleRefrescar } = useActualizacion();

  const [usuarios, setUsuarios] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef(null);

  const isActive = activeForm === "cambiarRol";

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const soloTrabajadores = {};
        for (const [departamento, lista] of Object.entries(res.data)) {
          const trabajadores = lista.filter((u) => u.role === "trabajador");
          if (trabajadores.length > 0) {
            soloTrabajadores[departamento] = trabajadores;
          }
        }
        setUsuarios(soloTrabajadores);
      } catch (err) {
        console.error("❌ Error al listar usuarios trabajadores:", err);
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
    if (!selectedUser || !newRole) return;

    try {
      await api.put(
        `/users/${selectedUser}/profile`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toggleRefrescar();
      setMessage("✅ Rol actualizado correctamente");
      setSelectedUser("");
      setNewRole("");
      onToggle(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al actualizar el rol");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="mb-6 relative">
      {/* 🔘 Botón */}
      <button
        onClick={() => onToggle(isActive ? null : "cambiarRol")}
        title="Cambiar rol de trabajador"
        className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <div className="relative group">
          <Shuffle size={22} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[10px] mt-1">Rol trabajador</span>
      </button>

      {/* 🔔 Mensaje */}
      {message && (
        <div className="fixed top-5 right-5 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {/* 📤 Formulario modal centrado */}
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
              <option value="">Selecciona un trabajador</option>
              {Object.entries(usuarios).map(([dep, lista]) => (
                <optgroup key={dep} label={dep}>
                  {lista.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecciona nuevo rol</option>
              <option value="jefe">Jefe</option>
              <option value="trabajador">Trabajador</option>
            </select>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Cambiar rol
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CambiarRolTrabajador;
