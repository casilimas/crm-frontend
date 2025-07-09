import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica";

// 🔁 Utilidades de estilo
const getTextColorByStatus = (status) => {
  switch (status) {
    case "presente": return "text-green-400";
    case "ausente": return "text-red-400";
    case "permiso": return "text-yellow-400";
    default: return "text-white";
  }
};

const getCircleColorByStatus = (status) => {
  switch (status) {
    case "presente": return "bg-green-400";
    case "ausente": return "bg-red-400";
    case "permiso": return "bg-yellow-400";
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

const ModuloIntegradoCajaAmarillaAdmin = () => {
  const { token } = useAuth();
  const { refrescar } = useActualizacion();

  const [mostrarAvatares, setMostrarAvatares] = useState(true);
  const [usuarios, setUsuarios] = useState({});
  const [tareasPublicadas, setTareasPublicadas] = useState([]);
  const [errorUsuarios, setErrorUsuarios] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarExpandido, setAvatarExpandido] = useState(null); // 🆕

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data);
      } catch (err) {
        console.error("❌ Error al obtener usuarios:", err);
        setErrorUsuarios("Error al cargar los usuarios.");
      }
    };

    fetchUsuarios();
  }, [token, refrescar]);

  useEffect(() => {
    const fetchTareasPublicadas = async () => {
      try {
        const res = await api.get("/tasks/published", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTareasPublicadas(res.data);
      } catch (error) {
        console.error("❌ Error al obtener tareas publicadas:", error);
      }
    };

    fetchTareasPublicadas();
  }, [token, refrescar]);

  const toggleExpand = (id) => {
    setAvatarExpandido(prev => (prev === id ? null : id));
  };

  return (
<div className="md:hidden w-full bg-white flex flex-col px-4 py-2 max-h-[calc(100vh-180px)] overflow-y-scroll scrollbar-hide">
      <button
        className="self-end bg-white text-black text-xs px-2 py-1 rounded shadow"
        onClick={() => setMostrarAvatares(!mostrarAvatares)}
      >
        {mostrarAvatares ? "📢 Ver Publicaciones" : "👥 Ver Avatares"}
      </button>

      {mostrarAvatares ? (
        <div className="overflow-y-auto mt-2">
          {errorUsuarios && <p className="text-red-800 text-sm">{errorUsuarios}</p>}
          {Object.entries(usuarios).map(([departamento, users]) => (
            <div key={departamento} className="mb-2">
              <h3 className="text-sm font-bold text-black mb-1">{departamento}</h3>
              <ul className="space-y-1">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        onClick={() => toggleExpand(user._id)}
                        className={`
                          cursor-pointer transition-transform duration-300 border-1 border-black rounded-full
                          ${avatarExpandido === user._id ? "w-20 h-20 z-50 scale-105" : "w-8 h-8"}
                        `}
                      />
                      <span className={`${getTextColorByStatus(user.status)} font-semibold`}>
                        {user.name}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${getCircleColorByStatus(user.status)}`}
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
      ) : (
        <div className="overflow-y-auto mt-2 text-black">
          {tareasPublicadas.length === 0 ? (
            <p className="text-sm">No hay tareas publicadas.</p>
          ) : (
            tareasPublicadas.map((task) => (
              <div
                key={task._id}
                className="bg-white text-black p-2 mb-3 rounded shadow-md border border-gray-300 text-xs"
              >
                <h3 className="text-sm font-bold">{task.title}</h3>
                <p className="italic text-gray-600 text-[10px]">
                  Asignado por: {task.assignedBy?.name || "Desconocido"}
                </p>
                <p>{task.description}</p>
                {task.report && (
                  <p className="mt-1 text-gray-800">
                    <strong>📝 Reporte:</strong> {task.report}
                  </p>
                )}
                {task.images?.length > 0 && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {task.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`img-${index}`}
                        className="w-16 h-16 object-cover rounded border cursor-pointer"
                        onClick={() => setSelectedImage(img.url)}
                      />
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-right text-gray-500 mt-1">
                  Publicado: {new Date(task.publishedAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Ampliada"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ModuloIntegradoCajaAmarillaAdmin;
