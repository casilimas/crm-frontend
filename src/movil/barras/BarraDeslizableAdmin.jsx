import React, { useState } from "react";

// ✅ Opción 1: botones del admin
import RegistrarUsuario from "../../movil/barras/botonesAdminMovil/RegistrarUsuario";
import BorrarTareaPendiente from "../../movil/barras/botonesAdminMovil/borrarTareaPendiente";
import CrearTareas from "../../movil/barras/botonesAdminMovil/crearTareas";
import CerrarCesion from "../../movil/barras/botonesAdminMovil/CerrarCesion";

// ✅ Opción 2: herramientas admin
import BorrarUsuario from "../../movil/barras/botonesAdminMovil/BorrarUsuario";
import BorrarDepartamento from "../../movil/barras/botonesAdminMovil/borrarDepartamento";
import CambiarCorreo from "../../movil/barras/botonesAdminMovil/cambiarCorreo";

// ✅ Opción 3: otros módulos admin
import CrearDepartamento from "../../movil/barras/botonesAdminMovil/crearDepartamento";
import CambiarPassword from "../../movil/barras/botonesAdminMovil/CambiarPassword";
import MigrarUsuario from "../../movil/barras/botonesAdminMovil/migrarUsuario";

// ✅ Opción 4: listar todos
import ListarTodos from "../../movil/barras/botonesAdminMovil/listarTodos";

import CambiarStatus from "../../movil/barras/botonesAdminMovil/cambiarStatus";

const BarraDeslizableAdmin = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleToggle = (formName) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  return (
    <div className="flex overflow-x-auto gap-1 snap-x snap-mandatory scrollbar-hide w-full">

      {/* 🔹 Opción 1: botones del admin */}
      <div className="flex-shrink-0 w-[90vw] h-16 bg-red-500 rounded-xl shadow-md px-2 snap-center flex items-center justify-between gap-2 ml-10">
       
        <BorrarTareaPendiente activeForm={activeForm} onToggle={handleToggle} />
        <CrearTareas activeForm={activeForm} onToggle={handleToggle} />
         <RegistrarUsuario activeForm={activeForm} onToggle={handleToggle} />
        <CerrarCesion activeForm={activeForm} onToggle={handleToggle} />
      </div>

      {/* 🔹 Opción 2: herramientas admin */}
      <div className="flex-shrink-0 w-[90vw] h-16 bg-red-500 rounded-xl shadow-md px-2 snap-center flex items-center justify-between gap-2 ml-10">
        <BorrarUsuario activeForm={activeForm} onToggle={handleToggle} />
        <MigrarUsuario activeForm={activeForm} onToggle={handleToggle} />
        <BorrarDepartamento activeForm={activeForm} onToggle={handleToggle} />
        
      </div>

      {/* 🔹 Opción 3: otros módulos admin */}
      <div className="flex-shrink-0 w-[90vw] h-16 bg-red-500 rounded-xl shadow-md px-2 snap-center flex items-center justify-between gap-2 ml-10">
        <CambiarCorreo activeForm={activeForm} onToggle={handleToggle} />
        <CrearDepartamento activeForm={activeForm} onToggle={handleToggle} />
        <CambiarPassword activeForm={activeForm} onToggle={handleToggle} />
        
      </div>

      {/* 🔹 Opción 4: listar todos */}
      <div className="flex-shrink-0 w-[90vw] h-16 bg-red-500 rounded-xl shadow-md px-2 snap-center flex items-center justify-between gap-2 ml-10">
       
        <ListarTodos activeForm={activeForm} onToggle={handleToggle} />
        <CambiarStatus activeForm={activeForm} onToggle={handleToggle} />
        
        <CerrarCesion activeForm={activeForm} onToggle={handleToggle} />
      </div>
    </div>
  );
};

export default BarraDeslizableAdmin;
