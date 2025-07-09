import React from "react";
import UserSummary from "../../components/stats/UserSummary";
import NavbarJefe from "../../components/navbar/NavbarTrabajador";
import CajaAzul from "../../components/boton/trabajador/CajaAzul";
import Cajanegra from "../../components/boton/trabajador/Cajanegra";
import CajaVerdeTrabajador from "../../movil/perfil/CajaVerdeTrabajador";
import CajaVioletaTrabajador from "../../movil/barras/CajaVioletaTrabajador";
import CajATrabajadorAmarilla from "../../movil/barras/CajaTrabajadorAmailla";

const WorkerDashboard = () => {
  return (
    <div className="relative min-h-screen bg-white text-black md:text-white transition-all duration-300 overflow-x-hidden flex flex-col md:flex-row">

      {/* 🟩 Caja verde arriba, solo visible en sm */}
    <div className="block md:hidden w-full">
        <CajaVerdeTrabajador />
        <CajaVioletaTrabajador />
        <CajATrabajadorAmarilla /> 
      </div>
      

      {/* 🔹 Columna izquierda con UserSummary */}
      <div className="min-h-screen md:w-[500px] bg-white p-6 overflow-x-hidden">
        <UserSummary />
        <CajaAzul />

      </div>


    






      

      {/* 🔸 Columna derecha: NavbarJefe + Cajanegra */}
      <div className="flex flex-col w-full">
        <div className="h-[190px] w-full bg-white p-0 overflow-x-hidden flex items-center justify-center">
          <NavbarJefe />
        </div>

        <div className="w-full">
          <Cajanegra />
        </div>
      </div> 
    </div>
  );
};

export default WorkerDashboard;
