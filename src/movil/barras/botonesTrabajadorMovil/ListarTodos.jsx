import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { CheckCircle } from "lucide-react";

const ListarUsuariosPorDepartamento = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const [departamentos, setDepartamentos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const isActive = activeForm === "listarUsuarios";

  useEffect(() => {
    if (!token || !isActive) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data);
        setDepartamentos(Object.keys(res.data));
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      }
    };

    fetchUsers();
  }, [token, isActive]);

  return (
    <>
      {/* 🔘 Botón */}
      <div className="mb-6 relative">
        <button
          onClick={() => onToggle(isActive ? null : "listarUsuarios")}
          title="Listar usuarios por departamento"
          className="flex flex-col items-center bg-red-500 text-black p-0.5 w-16 rounded sm:p-2 sm:w-16 hover:bg-gray-400 transition mt-5"
        >
          <div className="relative group">
            <CheckCircle size={22} className="transition-transform group-hover:scale-110" />
          </div>
          <span className="text-[10px] mt-1">Listar usuarios</span>
        </button>
      </div>

      {/* 🧾 Panel flotante */}
      {isActive && (
        <>
          {/* Fondo tipo modal */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => onToggle(null)}
          />

          {/* Contenido principal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-4 text-black rounded shadow-md w-[300px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-md font-semibold mb-2">Selecciona un departamento</h2>
            <ul className="mb-4 space-y-1">
              {departamentos.map((depto) => (
                <li
                  key={depto}
                  onClick={() => setDepartamentoSeleccionado(depto)}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {depto}
                </li>
              ))}
            </ul>

            {departamentoSeleccionado && (
              <>
                <h3 className="text-sm font-semibold mb-1">Usuarios en {departamentoSeleccionado}:</h3>
                <ul className="space-y-1">
                  {usuarios[departamentoSeleccionado]?.map((user) => (
                    <li key={user._id}>
                      <span
                        onClick={() => setUsuarioSeleccionado(user)}
                        className="cursor-pointer text-blue-500 hover:underline text-sm"
                      >
                        {user.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}

      {/* 🪪 Tarjeta de perfil del usuario */}
      {usuarioSeleccionado && (
        <div className="fixed top-[10%] left-1/2 -translate-x-1/2 bg-white text-black p-4 rounded shadow-md w-[300px] z-50 max-h-[80vh] overflow-y-auto text-sm">
          <h3 className="font-semibold text-center mb-2">Perfil del usuario</h3>
          <p><strong>Nombre:</strong> {usuarioSeleccionado.name}</p>
          <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
          <p><strong>Rol:</strong> {usuarioSeleccionado.role}</p>
          <p><strong>Estado:</strong> {usuarioSeleccionado.status}</p>
          <img
            src={usuarioSeleccionado.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full mt-3 mx-auto"
          />
          <button
            className="w-full bg-gray-300 mt-4 rounded py-1 text-sm hover:bg-gray-400"
            onClick={() => setUsuarioSeleccionado(null)}
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
};

export default ListarUsuariosPorDepartamento;
