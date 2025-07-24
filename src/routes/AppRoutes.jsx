import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import BossDashboard from "../pages/dashboards/BossDashboard";
import WorkerDashboard from "../pages/dashboards/WorkerDashboard";
import LogoutScreen from "../pages/LogoutScreen";
import { useAuth } from "../context/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const redirectToDashboard = () => {
    if (!isAuthenticated) return <Login />;
    if (user?.role === "admin") return <Navigate to="/admin" />;
    if (user?.role === "jefe") return <Navigate to="/boss" />;
    if (user?.role === "trabajador") return <Navigate to="/worker" />;
    return <Login />;
  };

  return (
    <Routes>
      <Route path="/" element={redirectToDashboard()} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/boss" element={<BossDashboard />} />
      <Route path="/worker" element={<WorkerDashboard />} />
      <Route path="/salida" element={<LogoutScreen />} />
    </Routes>
  );
};

export default AppRoutes;
