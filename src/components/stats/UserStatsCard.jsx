import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const UserStatsCard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("❌ Error al obtener estadísticas:", err);
        setError("No se pudo cargar las estadísticas");
      }
    };

    fetchStats();
  }, [token]);

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  if (!stats) {
    return <div className="text-gray-950 text-sm">Cargando estadísticas...</div>;
  }

return (
  <div className="relative self-start bg-gray-50 text-black rounded-lg shadow-md px-3 py-2 w-[165px] h-[175px] md:w-[150px] md:h-[165px] md:ml-2">
    <h3 className="text-[18px] md:text-sm font-medium mb-3">Estadísticas</h3>

    <p className="text-[13px] sm:text-[12px] md:text-[12px] lg:text-[10px] xl:text-[12px] md:text-xs leading-snug mb-1">
      <strong>tareas:</strong> {stats.totalTasks}
    </p>
    <p className="text-[13px] sm:text-[12px] md:text-[12px] lg:text-[10px] xl:text-[12px] md:text-xs leading-snug mb-1">
      <strong>completadas:</strong> {stats.completedTasks}
    </p>
    <p className="text-[13px] sm:text-[12px] md:text-[12px] lg:text-[8px] xl:text-[12px] md:text-xs leading-snug mb-1">
      <strong>Rendimiento:</strong> {stats.performance}
    </p>
    <p className="text-[13px] sm:text-[12px] md:text-[12px] lg:text-[10px] xl:text-[12px] md:text-xs leading-snug mb-1">
      <strong>promedio:</strong> {stats.averageTimeEfficiency}
    </p>
    <p className="text-[11px] sm:text-[12px] md:text-[12px] lg:text-[10px] xl:text-[12px] 2xl:text-[12px] leading-snug">
  <strong>Clasificacion:</strong>{" "}
  <span
    className={`ml-1 font-semibold ${
      stats.efficiencyStatus === "Eficiente"
        ? "text-green-600"
        : stats.efficiencyStatus === "Óptimo"
        ? "text-blue-500"
        : stats.efficiencyStatus === "Regular"
        ? "text-yellow-500"
        : stats.efficiencyStatus === "Lento"
        ? "text-red-500"
        : "text-gray-500"
    }`}
  >
    {stats.efficiencyStatus}
  </span>
</p>

  </div>
);









};

export default UserStatsCard;
