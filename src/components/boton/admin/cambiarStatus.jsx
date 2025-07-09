import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica";
import { ShieldCheck } from "lucide-react";

const CambiarStatus = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const { toggleRefrescar } = useActualizacion(); // ✅ ✅ AÑADIDO AQUÍ
  const [usuarios, setUsuarios] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [status, setStatus] = useState("presente");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const isActive = activeForm === "cambiarStatus";

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const agrupados = {};
        for (const [departamento, lista] of Object.entries(res.data)) {
          if (lista.length > 0) agrupados[departamento] = lista;
        }

        setUsuarios(agrupados);
      } catch (error) {
        console.error("❌ Error al cargar usuarios:", error);
      }
    };

    if (isActive) fetchUsuarios();
  }, [isActive, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await api.put(
        `/users/${selectedUser}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toggleRefrescar(); // ✅ ACTUALIZA LA CAJA AZUL

      setSelectedUser("");
      setStatus("presente");
      onToggle(null);

      setMessage("✅ Estado actualizado correctamente");
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
        setMessage("");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al actualizar estado";
      setMessage(`❌ ${msg}`);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage("");
      }, 2000);
    }
  };



  
  return (
    <div className="mb-6 relative">
      {/* 🔘 Botón de activación */}
      <button
        onClick={() => onToggle(isActive ? null : "cambiarStatus")}
        title="Cambiar Status"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <div className="relative group">
          <ShieldCheck size={16} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[10px] mt-1">Status</span>
      </button>

      {/* 📩 Mensaje */}
      {showMessage && (
        <div className="absolute top-[120%] left-0 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {/* 📬 Formulario */}
      {isActive && (
        <div className="absolute top-[150%] left-0 z-50 bg-white p-4 text-black rounded shadow-md w-[300px]">
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
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
                      {u.name} ({u.role})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
              <option value="permiso">Permiso</option>
            </select>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Cambiar estado
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CambiarStatus;
