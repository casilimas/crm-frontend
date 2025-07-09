import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica"; // ✅ Importar

const Cajanegra = () => {
  const { token } = useAuth();
  const { refrescar } = useActualizacion(); // ✅ Usar contexto
  const [publishedTasks, setPublishedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // 🆕 Imagen a pantalla completa

  useEffect(() => {
    const fetchPublishedTasks = async () => {
      try {
        const res = await api.get("/tasks/published", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPublishedTasks(res.data);
      } catch (error) {
        console.error("❌ Error al obtener tareas publicadas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedTasks();
  }, [token, refrescar]); // ✅ Se actualiza cuando cambia refrescar

  return (
    <>
      <div className="hidden md:block w-full pl-[10px] mt-0 h-[450px] overflow-y-auto">
        <div className="bg-white text-black p-4 border-spacing-5 rounded shadow w-full max-w-[100%] border border-gray-300">
          <h2 className="text-xl font-bold mb-0">📢 Publicaciones Recientes</h2>

          {loading ? (
            <p>Cargando publicaciones...</p>
          ) : publishedTasks.length === 0 ? (
            <p>No hay tareas publicadas aún.</p>
          ) : (
            publishedTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white text-black p-4 mb-4 rounded shadow-md border border-gray-300"
              >
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm italic text-gray-600">
                  Asignado por: {task.assignedBy?.name || "Desconocido"}
                </p>
                <p className="mt-1">{task.description}</p>

                {task.report && (
                  <p className="mt-2 text-sm text-gray-800">
                    <strong>📝 Reporte:</strong> {task.report}
                  </p>
                )}

                {task.images?.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {task.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`img-${index}`}
                        className="w-24 h-24 object-cover rounded border cursor-pointer"
                        onClick={() => setSelectedImage(img.url)}
                      />
                    ))}
                  </div>
                )}

                <p className="text-xs text-right text-gray-500 mt-2">
                  Publicado: {new Date(task.publishedAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔍 Modal de imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Pantalla completa"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default Cajanegra;
