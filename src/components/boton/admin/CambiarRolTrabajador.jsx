// ✅ src/components/boton/admin/CambiarRolTrabajador.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { UserCog } from "lucide-react";

const CambiarRolTrabajador = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("trabajador");
  const [message, setMessage] = useState("");
  const isActive = activeForm === "cambiarRolTrabajador";

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const todos = Object.values(res.data).flat();
        setUsuarios(todos);
      } catch (error) {
        console.error("❌ Error al cargar usuarios:", error);
      }
    };

    if (isActive) fetchUsuarios();
  }, [isActive, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/users/${selectedUser}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Rol actualizado");
      setTimeout(() => {
        setMessage("");
        setSelectedUser("");
        onToggle(null);
      }, 2000);
    } catch (err) {
      setMessage("❌ Error al actualizar rol");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="mb-6 relative z-50">
      {/* 🔘 Botón */}
      <button
        onClick={() => onToggle(isActive ? null : "cambiarRolTrabajador")}
        title="Cambiar rol"
        className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <UserCog size={16} />
        <span className="text-[10px] mt-1">Rol</span>
      </button>

      {/* ⚠️ Mensaje */}
      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-[9999]">
          {message}
        </div>
      )}

      {/* 📄 Modal */}
      {isActive && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9998]"
          onClick={() => onToggle(null)}
        >
          <div
            className="bg-white text-black rounded shadow-md w-[300px] p-4"
            onClick={(e) => e.stopPropagation()} // ⛔ evita cierre al hacer clic dentro
          >
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <p className="text-sm font-semibold text-center mb-2">Cambiar rol</p>

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
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              >
                <option value="trabajador">Trabajador</option>
                <option value="jefe">Jefe</option>
              </select>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Cambiar rol
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CambiarRolTrabajador;
