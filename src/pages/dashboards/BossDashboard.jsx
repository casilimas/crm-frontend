import React from "react";
import UserSummary from "../../components/stats/UserSummary";
import NavbarJefe from "../../components/navbar/NavbarJefe";
import CajaAzul from "../../components/boton/jefe/CajaAzul";
import Cajanegra from "../../components/boton/jefe/Cajanegra";
import Cajaverde from "../../movil/perfil/CajaVerde";
import CajaVioletaJefe from "../../movil/barras/CajaVioletaJefe";
import CajAJefeAmarilla from "../../movil/barras/CajaJefeAmarilla";

const BossDashboard = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-white text-black md:text-white transition-all duration-300 flex flex-col md:flex-row">
      
      {/* 🟩 Caja verde arriba, solo visible en sm */}
      <div className="block md:hidden w-full">
        <Cajaverde />
        <CajaVioletaJefe />
        <CajAJefeAmarilla /> 
      </div>

      {/* 🔹 Columna izquierda con UserSummary y CajaAzul */}
      <div className="hidden md:block min-h-screen md:w-[500px] bg-white p-6 overflow-x-hidden">
        <UserSummary />
        <CajaAzul />
      </div>

      {/* 🔸 Columna derecha: NavbarJefe + Cajanegra */}
      <div className="flex flex-col w-full h-full">
        <div className="h-[190px] w-full bg-white p-0 overflow-x-hidden">
          <NavbarJefe />
        </div>

        {/* ✅ Scroll SOLO aquí */}
        <div className="w-full h-[calc(100vh-190px)] overflow-y-auto">
          <Cajanegra />
        </div>
      </div>
    </div>
  );
};

export default BossDashboard;
