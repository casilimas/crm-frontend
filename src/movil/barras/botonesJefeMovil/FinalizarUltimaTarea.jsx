import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { CheckCircle } from "lucide-react";

const FinalizarTarea = ({ activeForm, onToggle }) => {
  const { token, user } = useAuth();
  const [ultimaTarea, setUltimaTarea] = useState(null);
  const [reportText, setReportText] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const isActive = activeForm === "finalizarTarea";

  useEffect(() => {
    if (!user?.id || !token || !isActive) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tareasPendientes = res.data
          .filter((t) => t.status !== "completada")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setUltimaTarea(tareasPendientes[0] || null);
      } catch (err) {
        console.error("Error al cargar tareas:", err);
      }
    };

    fetchTasks();
  }, [user, token, isActive]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ultimaTarea) return;

    const formData = new FormData();
    formData.append("report", reportText);
    images.forEach((img) => formData.append("images", img));

    try {
      await api.put(`/tasks/${ultimaTarea._id}/complete`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await api.put("/notifications/read", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Tarea finalizada correctamente");
      setShowMessage(true);
      setUltimaTarea(null);
      setReportText("");
      setImages([]);

      setTimeout(() => {
        setShowMessage(false);
        setMessage("");
        onToggle(null);
      }, 2000);
    } catch (err) {
      console.error("❌ Error:", err);
      const backendMsg = err.response?.data?.message || "❌ Error al finalizar la tarea";
      setMessage(backendMsg);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 4000);
    }
  };

  return (
    <>
      {/* 🔘 Botón */}
      <div className="mb-6 relative">
        <button
          onClick={() => onToggle(isActive ? null : "finalizarTarea")}
          title="Finalizar tarea"
          className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
        >
          <div className="relative group">
            <CheckCircle size={20} className="transition-transform group-hover:scale-110" />
          </div>
          <span className="text-[10px] mt-1">Finalizar tarea</span>
        </button>

        {/* 📩 Mensaje emergente flotante */}
        {showMessage && (
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
            {message}
          </div>
        )}
      </div>

      {/* 🧾 Formulario flotante centrado */}
      {isActive && ultimaTarea && (
        <>
          {/* Fondo oscuro tipo modal */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => onToggle(null)}
          />

          {/* Formulario */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-4 text-black rounded shadow-md w-[300px] space-y-3 text-sm max-h-[90vh] overflow-y-auto">
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
                className="w-full text-sm"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Finalizar
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default FinalizarTarea;
