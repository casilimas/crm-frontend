import React, { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica"; // ✅ Importar

const CambiarRolTrabajador = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const { toggleRefrescar } = useActualizacion(); // ✅ Activador de actualización
  const [usuarios, setUsuarios] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("");
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newRole) return;

    try {
      await api.put(
        `/users/${selectedUser}/profile`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toggleRefrescar(); // ✅ Refresca otros componentes como CajaAzul

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
      <button
        onClick={() => onToggle(isActive ? null : "cambiarRol")}
        title="Cambiar rol de trabajador"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <div className="relative group">
          <Shuffle size={16} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[10px] mt-1">Rol trabajador</span>
      </button>

      {message && (
        <div className="absolute top-[120%] left-0 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {isActive && (
        <div className="absolute top-[150%] left-0 z-50 bg-white p-4 text-black rounded shadow-md w-[300px]">
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecciona un trabajador</option>
              {Object.entries(usuarios).map(([departamento, lista]) => (
                <optgroup key={departamento} label={departamento}>
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
