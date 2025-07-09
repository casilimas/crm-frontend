import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { ClipboardCheck } from "lucide-react";

const FinalizarUltimaTarea = ({ activeForm, onToggle }) => {
  const { token, user } = useAuth();
  const [ultimaTarea, setUltimaTarea] = useState(null);
  const [reportText, setReportText] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const isActive = activeForm === "finalizarTarea";

  // 🔍 Obtener la última tarea asignada
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user?._id) return;

        const res = await api.get(`/tasks/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tareasPendientes = res.data
          .filter((t) => t.status !== "completada")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (tareasPendientes.length > 0) {
          setUltimaTarea(tareasPendientes[0]);
        }
      } catch (err) {
        console.error("❌ Error al cargar tareas:", err);
      }
    };

    if (isActive) fetchTasks();
  }, [isActive, token, user?._id]);

  // 🧾 Finalizar y publicar la tarea (automáticamente)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ultimaTarea) return;

    const formData = new FormData();
    formData.append("report", reportText);
    images.forEach((image) => formData.append("images", image));

    try {
      await api.put(`/tasks/${ultimaTarea._id}/complete`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Tarea finalizada y publicada con éxito");
      setUltimaTarea(null);
      setReportText("");
      setImages([]);
      onToggle(null);
    } catch (error) {
      console.error("❌ Error al finalizar la tarea:", error);
      setMessage("❌ Error al finalizar la tarea");
    }
  };

  return (
    <div className="mb-6 relative">
      {/* 🟣 Botón de acción */}
      <button
        onClick={() => onToggle(isActive ? null : "finalizarTarea")}
        title="Finalizar y publicar tarea"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <div className="relative group">
          <ClipboardCheck size={16} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[10px] mt-1">Finalizar tarea</span>
      </button>

      {/* 📬 Formulario de reporte */}
      {isActive && ultimaTarea && (
        <div className="absolute top-[150%] left-0 z-50 bg-white p-4 text-black rounded shadow-md w-[300px] space-y-3 text-sm">
          <h2 className="text-lg font-bold text-red-600">Finalizar tarea</h2>
          <p><strong>Título:</strong> {ultimaTarea.title}</p>
          <p><strong>Descripción:</strong> {ultimaTarea.description}</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              required
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe lo que hiciste..."
              className="w-full border border-gray-400 p-2 rounded"
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages([...e.target.files])}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Finalizar y publicar
            </button>

            {message && <p className="text-green-600">{message}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default FinalizarUltimaTarea;
