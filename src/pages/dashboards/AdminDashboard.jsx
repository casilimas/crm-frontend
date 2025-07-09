import React from "react";
import ProfileAvatar from "../../components/ProfileAvatar";
import Navbar from "../../components/navbar/Navbar";
import CajaAzul from "../../components/boton/admin/CajaAzul";
import Cajanegra from "../../components/boton/admin/Cajanegra";
import Cajaverde from "../../movil/perfil/CajaVerdeAdmin";
import CajaVioletaAdmin from "../../movil/barras/CajaVioletaAdmin";
import CajaAdminAmarilla from "../../movil/barras/CajaAdminAmarilla";

const AdminDashboard = () => {
  return (
    <div className="md:flex">

      {/* ✅ Caja verde móvil (solo visible en sm) */}
      <div className="block md:hidden w-full">
        <Cajaverde />
        <CajaVioletaAdmin />
        <CajaAdminAmarilla />  
      </div>

      {/* 🧾 Columna izquierda */}
      <div className="bg-white md:bg-white text-black md:text-white p-0 transition-all duration-300 mt-3">
        <ProfileAvatar />
        <div>
          <CajaAzul />
        </div>
      </div>

      {/* 📦 Columna derecha */}
      <div className="flex flex-col w-full pl-4">
        <Navbar />
        <div className="mt-4">
          <Cajanegra />
        </div>
        <div className="flex-1 bg-white p-4">{/* Contenido adicional */}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
