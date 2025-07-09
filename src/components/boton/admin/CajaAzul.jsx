import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica";

// Funciones de colores
const getTextColorByStatus = (status) => {
  switch (status) {
    case "presente": return "text-green-900";
    case "ausente": return "text-red-900";
    case "permiso": return "text-yellow-900";
    default: return "text-white";
  }
};

const getCircleColorByStatus = (status) => {
  switch (status) {
    case "presente": return "bg-green-500";
    case "ausente": return "bg-red-500";
    case "permiso": return "bg-yellow-500";
    default: return "bg-gray-100";
  }
};

const getRoleInitial = (role) => {
  switch (role) {
    case "admin": return "A";
    case "jefe": return "J";
    case "trabajador": return "T";
    default: return "?";
  }
};

const CajaAzul = () => {
  const { token } = useAuth();
  const { refrescar } = useActualizacion();
  const [usuarios, setUsuarios] = useState({});
  const [error, setError] = useState("");
  const [avatarExpandido, setAvatarExpandido] = useState(null); // 👈 Nuevo estado

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data);
      } catch (err) {
        console.error("❌ Error al obtener usuarios:", err);
        setError("Error al cargar los usuarios.");
      }
    };

    fetchUsuarios();
  }, [token, refrescar]);

  const toggleExpand = (id) => {
    setAvatarExpandido(prev => (prev === id ? null : id)); // 👈 Alterna
  };

  return (
    <div className="hidden md:block bg-white w-[20vw] h-[450px] mt-4 ml-2 rounded-lg shadow-md p-1 text-white overflow-x-auto overflow-y-auto">
      {error && <p className="text-red-200 text-sm mb-2">{error}</p>}

      {Object.entries(usuarios).map(([departamento, users]) => (
        <div key={departamento} className="mb-4">
          <h3 className="text-base font-bold text-black mb-2">{departamento}</h3>
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                {/* Avatar + Nombre */}
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    onClick={() => toggleExpand(user._id)} // 👈 Clic para ampliar
                    className={`
                      cursor-pointer transition-transform duration-300 border-2 border-white rounded-full
                      ${avatarExpandido === user._id ? "w-20 h-20 z-50 scale-100" : "w-8 h-8"}
                    `}
                  />
                  <span className={`font-semibold ${getTextColorByStatus(user.status)}`}>
                    {user.name}
                  </span>
                </div>

                {/* Círculo con letra del rol */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getCircleColorByStatus(user.status)}`}
                  title={`Rol: ${user.role}`}
                >
                  {getRoleInitial(user.role)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CajaAzul;
