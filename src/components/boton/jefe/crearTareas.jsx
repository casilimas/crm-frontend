import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { ClipboardPlus } from "lucide-react";

const CrearTareas = ({ activeForm, onToggle }) => {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "media",
    durationHours: 1,
    department: "",
    assignedTo: "",
  });

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const isActive = activeForm === "crearTareas";

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(res.data);
      } catch (error) {
        console.error("Error al cargar departamentos", error);
      }
    };

    if (isActive) fetchDepartments();
  }, [isActive, token]);

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setFormData({ ...formData, department: departmentId, assignedTo: "" });

    if (!departmentId) return;

    try {
      const res = await api.get(`/users/department/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtrados = res.data.filter((u) => {
        if (u.status !== "presente") return false;
        if (user.role === "admin" && u.role === "admin") return false;
        if (user.role === "jefe" && u.role !== "trabajador") return false;
        return true;
      });

      setUsers(filtrados);
    } catch (error) {
      console.error("Error al cargar usuarios del departamento", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { title, description, priority, durationHours, assignedTo } = formData;

      const response = await api.post(
        "/tasks",
        { title, description, priority, durationHours, assignedTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onToggle(null);
      setMessage(response.data.message || "✅ Tarea creada correctamente");
      setShowMessage(true);
      setFormData({
        title: "",
        description: "",
        priority: "media",
        durationHours: 1,
        department: "",
        assignedTo: "",
      });

      setTimeout(() => {
        setShowMessage(false);
        setMessage("");
      }, 2000);
    } catch (err) {
      onToggle(null);
      const backendMsg = err.response?.data?.message || "❌ Error desconocido al crear la tarea";
      setMessage(`❌ ${backendMsg}`);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage("");
      }, 5000);
    }
  };

  return (
    <>
      {/* 🟣 Botón */}
      <div className="mb-6 relative">
        <button
          onClick={() => onToggle(isActive ? null : "crearTareas")}
          title="Crear nueva tarea"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
        >
          <div className="relative group">
            <ClipboardPlus size={16} className="transition-transform group-hover:scale-110" />
          </div>
          <span className="text-[10px] mt-1">Nueva tarea</span>
        </button>

        {/* 📩 Mensaje flotante */}
        {showMessage && (
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
            {message}
          </div>
        )}
      </div>

      {/* 📬 Formulario flotante */}
      {isActive && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-4 text-black rounded shadow-md w-[300px] space-y-3 text-sm">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Título de la tarea"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />

            <textarea
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            ></textarea>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>

            <input
              type="number"
              name="durationHours"
              min="1"
              max="12"
              value={formData.durationHours}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />

            <select
              name="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))}
            </select>

            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecciona un usuario</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Asignar tarea
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CrearTareas;
