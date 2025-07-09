import React, { useState } from "react";

// ✅ Botones para opción 1
import Notificacion from "../../movil/barras/botonesTrabajadorMovil/Notificacion";
import FinalizarUltimaTarea from "../../movil/barras/botonesTrabajadorMovil/FinalizarUltimaTarea";
import CerrarSecion from "../../movil/barras/botonesTrabajadorMovil/CerrarCesion";


// ✅ Botones para opción 2
import ListarTodos from "../../movil/barras/botonesTrabajadorMovil/ListarTodos";
import CerrarCesion from "../../movil/barras/botonesTrabajadorMovil/CerrarCesion"; // 👈 corregido
import CambiarPassword from "../../movil/barras/botonesTrabajadorMovil/CambiarPassword";

const BarraDeslizableTrabajador = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleToggle = (formName) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  return (
    <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide w-full">
      
      {/* 🔹 Opción 1 */}
      <div className="flex-shrink-0 w-[90vw] h-16 bg-red-500 rounded-xl shadow-md px-2 snap-center flex items-center justify-between gap-2">
        <Notificacion activeForm={activeForm} onToggle={handleToggle} />
        <FinalizarUltimaTarea activeForm={activeForm} onToggle={handleToggle} />
        <CerrarSecion activeForm={activeForm} onToggle={handleToggle} />
      </div>

      {/* 🔹 Opción 2 */}
      <div className="flex-shrink-0 w-[90vw] h-16 bg-red-500 rounded-xl shadow-md px-2 snap-center flex items-center justify-between  gap-2">
        <ListarTodos activeForm={activeForm} onToggle={handleToggle} />
        <CambiarPassword activeForm={activeForm} onToggle={handleToggle} />
        <CerrarCesion activeForm={activeForm} onToggle={handleToggle} />
         
        

      </div>

    </div>
  );
};

export default BarraDeslizableTrabajador;
