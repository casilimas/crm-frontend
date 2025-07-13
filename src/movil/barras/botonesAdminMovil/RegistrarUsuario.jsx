import React, { useState, useEffect, useRef } from "react";
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

  const modalRef = useRef(null);

  // 👀 Cierra si se hace clic fuera del formulario
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onToggle(null);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, onToggle]);

  useEffect(() => {
    if (!isActive) return;
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
    fetchDepartments();
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

      onToggle(null);
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
    <div className="mb-6 relative block sm:hidden">
      {/* 🧭 Botón */}
      <button
        onClick={() => onToggle(isActive ? null : "registrarUsuario")}
        title="Registrar nuevo usuario"
        className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded hover:bg-red-500 transition mt-5"
      >
        <div className="relative group">
          <UserRoundPlus size={22} className="transition-transform group-hover:scale-110" />
        </div>
        <span className="text-[10px] mt-1">Nuevo</span>
      </button>

      {/* 📝 Modal centrado */}
      {isActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white text-black p-4 rounded shadow-md w-full max-w-xs">
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

            {/* Mensaje */}
            {message && (
              <p className={`mt-2 text-center text-sm ${success ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarUsuario;
