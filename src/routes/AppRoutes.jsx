import React from "react"; // 👈 NECESARIO
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/dashboards/AdminDashboard"; 
import BossDashboard from "../pages/dashboards/BossDashboard";
import WorkerDashboard from "../pages/dashboards/WorkerDashboard";
import LogoutScreen from "../pages/LogoutScreen";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/boss" element={<BossDashboard />} /> 
    <Route path="/worker" element={<WorkerDashboard />} /> 
    <Route path="/salida" element={<LogoutScreen />} />

  </Routes>
);

export default AppRoutes;
