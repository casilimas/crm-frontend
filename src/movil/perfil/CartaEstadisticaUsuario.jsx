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
    <div className="block md:hidden bg-white text-black rounded-lg shadow-md px-3 py-2 w-[45%] mx-auto mt-4">
      <h3 className="text-[16px] font-semibold mb-3 text-center">Estadísticas</h3>

      <p className="text-sm mb-1"><strong>Tareas:</strong> {stats.totalTasks}</p>
      <p className="text-sm mb-1"><strong>Completadas:</strong> {stats.completedTasks}</p>
      <p className="text-sm mb-1"><strong>Rendimiento:</strong> {stats.performance}</p>
      <p className="text-sm mb-1"><strong>Promedio:</strong> {stats.averageTimeEfficiency}</p>
      <p className="text-sm">
        <strong>Clasificación:</strong>{" "}
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
