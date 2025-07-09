import React, { useState } from "react";

// ✅ Opción 1 (botones principales del jefe)
import Notificacion from "../../movil/barras/botonesJefeMovil/Notificacion";
import FinalizarUltimaTarea from "../../movil/barras/botonesJefeMovil/FinalizarUltimaTarea";
import CrearTareas from "../../movil/barras/botonesJefeMovil/crearTareas";
import CerrarSecion from "../../movil/barras/botonesJefeMovil/cerrarSecion";

// ✅ Opción 2 (botones adicionales del jefe)
import BorrarTareaPendiente from "../../movil/barras/botonesJefeMovil/borrarTareaPendiente";
import ListarTodos from "../../movil/barras/botonesJefeMovil/listarTodos";
import CambiarPassword from "../../movil/barras/botonesJefeMovil/CambiarPassword";

const BarraDeslizableJefe = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleToggle = (formName) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  return (
    <div className="flex overflow-x-auto gap-1 snap-x snap-mandatory scrollbar-hide w-full">
      
      {/* 🔹 Opción 1: botones principales */}
      <div className="flex-shrink-0 w-[90vw] h-16 bg-red-500 rounded-xl shadow-md px-2 snap-center flex items-center justify-between gap-2">
        <Notificacion activeForm={activeForm} onToggle={handleToggle} />
        <FinalizarUltimaTarea activeForm={activeForm} onToggle={handleToggle} />
        <CrearTareas activeForm={activeForm} onToggle={handleToggle} />
        <CerrarSecion activeForm={activeForm} onToggle={handleToggle} />
      </div>

      <div className="w-10">


      </div>

      {/* 🔹 Opción 2: botones adicionales */}
      <div className="flex-shrink-0 w-[90vw] h-16 bg-red-500 rounded-xl shadow-md px-2 snap-center flex items-center justify-between gap-2 ml-10">
        <BorrarTareaPendiente activeForm={activeForm} onToggle={handleToggle} />
        <ListarTodos activeForm={activeForm} onToggle={handleToggle} />
        <CambiarPassword activeForm={activeForm} onToggle={handleToggle} />
        <CerrarSecion activeForm={activeForm} onToggle={handleToggle} />
      </div>
    </div>
  );
};

export default BarraDeslizableJefe;
