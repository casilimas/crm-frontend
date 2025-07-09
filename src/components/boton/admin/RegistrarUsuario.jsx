import React, { useState, useEffect } from "react";
import { UserRoundPlus } from "lucide-react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const RegistrarUsuario = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "trabajador",
    department: ""
  });
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const isActive = activeForm === "registrarUsuario";

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDepartments(res.data);
      } catch (error) {
        console.error("❌ Error al obtener departamentos", error);
      }
    };
    if (isActive) fetchDepartments();
  }, [isActive, token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    try {
      const res = await api.post("/users/register", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onToggle(null); // ✅ Ocultar formulario tras registrar
      setMessage(res.data.message);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "trabajador",
        department: ""
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al registrar usuario");
      setSuccess(false);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="mb-6 relative">
      {/* 🧭 Botón */}
      <button
        onClick={() => onToggle(isActive ? null : "registrarUsuario")}
        title="Registrar nuevo usuario"
className="flex flex-col items-center bg-blue-400 text-black p-2 rounded w-20 hover:bg-blue-500 transition-all duration-500 ease-in-out"
      >
        <div className="relative group">
          <UserRoundPlus size={16} className="transition-transform group-hover:scale-110" />
          
        </div>
        <span className="text-[10px] mt-1">Nuevo</span>
      </button>

      {/* 📩 Mensaje */}
      {message && (
        <div className="absolute top-[120%] left-0 bg-yellow-100 border border-yellow-600 text-yellow-800 text-sm rounded px-4 py-2 shadow-md w-[300px] z-50">
          {message}
        </div>
      )}

      {/* 📝 Formulario */}
      {isActive && (
        <div className="absolute top-[150%] left-0 z-50 bg-white p-4 text-black rounded shadow-md w-[300px]">
          <form onSubmit={handleSubmit} className="space-y-2 text-sm">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border rounded"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="trabajador">Trabajador</option>
              <option value="jefe">Jefe</option>
              <option value="admin">Admin</option>
            </select>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border rounded"
            >
              <option value="">Departamento</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Registrar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegistrarUsuario;
