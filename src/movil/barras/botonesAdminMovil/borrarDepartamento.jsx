import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const BorrarDepartamento = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [message, setMessage] = useState("");

  const ID_HISTORICO = "684ae3f26e7ea41616313465";
  const isActive = activeForm === "borrarDepartamento";

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtrados = res.data.filter(
          (dept) =>
            dept._id !== ID_HISTORICO &&
            dept.name.toLowerCase() !== "historico"
        );
        setDepartamentos(filtrados);
      } catch (err) {
        console.error("❌ Error al obtener departamentos:", err);
      }
    };

    if (isActive) fetchDepartments();
  }, [isActive, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;

    if (selectedDept === ID_HISTORICO) {
      setMessage("❌ No se permite eliminar el departamento HISTORICO.");
      return;
    }

    try {
      await api.delete(`/departments/${selectedDept}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onToggle(null); // ✅ Ocultar el formulario al enviar
      setSelectedDept("");
      setMessage("✅ Departamento eliminado correctamente");

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error al eliminar el departamento";
      setMessage(`❌ ${msg}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="mb-6 relative">
      {/* 🔘 Botón con ícono y texto */}
      <button
        onClick={() => onToggle(isActive ? null : "borrarDepartamento")}
        title="Eliminar departamento"
          className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
      >
        <div className="relative">
          <FaTrashAlt size={16} className="transition-transform group-hover:scale-110" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Eliminar departamento
          </div>
        </div>
        <span className="text-[10px] mt-1">Departamento</span>
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
          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecciona un departamento</option>
              {departamentos.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BorrarDepartamento;
