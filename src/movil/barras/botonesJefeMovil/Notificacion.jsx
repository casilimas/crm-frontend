import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { useActualizacion } from "../../../actualizacion/actualizacionAutomatica"; // ✅

const Notificacion = ({ activeForm, onToggle }) => {
  const { token } = useAuth();
  const { refrescar } = useActualizacion(); // ✅
  const [ultimaNotificacion, setUltimaNotificacion] = useState(null);
  const [error, setError] = useState("");

  const isActive = activeForm === "notificacion";

  useEffect(() => {
    if (token) fetchNotificacion();
  }, [token]);

  useEffect(() => {
    if (isActive) fetchNotificacion();
  }, [isActive]);

  useEffect(() => {
    fetchNotificacion(); // ✅ Se actualiza cuando cambia refrescar global
  }, [refrescar]);

  const fetchNotificacion = async () => {
    try {
      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const noLeidas = res.data.filter((n) => !n.read);
      if (noLeidas.length > 0) {
        setUltimaNotificacion(noLeidas[0]);
        setError("");
      } else {
        setUltimaNotificacion(null);
        setError("No hay notificaciones recientes.");
      }
    } catch (err) {
      setError("Error al obtener notificación.");
    }
  };

  return (
    <>
      {/* 🔘 Botón */}
      <div className="mb-6 relative">
        <button
          onClick={() => onToggle(isActive ? null : "notificacion")}
          title="Ver notificación"
          className="flex flex-col items-center bg-red-500 text-black p-0.5 w-14 rounded sm:p-2 sm:w-10 hover:bg-gray-400 transition mt-5"
        >
          <div className="relative group">
            <Bell size={22} className="transition-transform group-hover:scale-110" />
            {ultimaNotificacion && !ultimaNotificacion.read && (
              <span className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-green-700 rounded-full" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] mt-1">Notificación</span>
        </button>
      </div>

      {/* 🔳 Fondo modal y notificación */}
      {isActive && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => onToggle(null)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded shadow-md w-[300px] p-4 z-50 text-sm">
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <>
                <p className="font-semibold mb-2">📌 Última notificación:</p>
                <p className="text-gray-800">{ultimaNotificacion?.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(ultimaNotificacion?.createdAt).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Notificacion;
